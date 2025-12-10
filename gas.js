// =======================
// DOM ELEMENT REFERENCES
// =======================

const gasUsedInput = document.getElementById("gasUsed");
const gasPriceInput = document.getElementById("gasPrice");
const calculateBtn = document.getElementById("calculate");

const feeUsdcEl = document.getElementById("feeUsdc");
const feeUsdEl = document.getElementById("feeUsd");
const feeGasUsedEl = document.getElementById("feeGasUsed");
const feeGasPriceEl = document.getElementById("feeGasPrice");
const resultCard = document.getElementById("result");

const presetTransferBtn = document.getElementById("presetTransfer");
const presetContractBtn = document.getElementById("presetContract");
const presetDeployBtn = document.getElementById("presetDeploy");

const copySummaryBtn = document.getElementById("copySummary");

// Wallet comparison
const addrAInput = document.getElementById("addrA");
const addrBInput = document.getElementById("addrB");
const compareBtn = document.getElementById("compare");
const compareStatusEl = document.getElementById("compareStatus");
const compareResultCard = document.getElementById("compareResult");

const aTxCountEl = document.getElementById("aTxCount");
const aGasUsedEl = document.getElementById("aGasUsed");
const aFeeUsdcEl = document.getElementById("aFeeUsdc");

const bTxCountEl = document.getElementById("bTxCount");
const bGasUsedEl = document.getElementById("bGasUsed");
const bFeeUsdcEl = document.getElementById("bFeeUsdc");

const compareSummaryTextEl = document.getElementById("compareSummaryText");

const themeToggleBtn = document.getElementById("themeToggle");


// =======================
// VALIDATION HELPERS
// =======================

// ARC/EVM address = 0x + 40 hex chars
function isValidArcAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}

// Decimal number (0–9 with optional decimal point)
function isValidDecimalNumber(n) {
  return /^[0-9]*([.][0-9]+)?$/.test(n.trim()) && n.trim() !== "";
}

// Add shake animation
function shake(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 400);
}

// Create error message element under input
function createErrorBox(input) {
  const div = document.createElement("div");
  div.style.fontSize = "12px";
  div.style.marginTop = "4px";
  div.style.color = "#ff7373";
  input.insertAdjacentElement("afterend", div);
  return div;
}

// Block paste of invalid address
function blockInvalidAddressPaste(input) {
  input.addEventListener("paste", e => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (!isValidArcAddress(text)) {
      e.preventDefault();
      shake(input);
    }
  });
}

// Full validation for address fields
function setupAddressValidation(input) {
  const errorBox = createErrorBox(input);
  blockInvalidAddressPaste(input);

  input.addEventListener("input", () => {
    let v = input.value.trim().toLowerCase();
    input.value = v;

    if (v === "") {
      input.style.border = "1px solid var(--border)";
      errorBox.textContent = "";
      return;
    }

    if (!isValidArcAddress(v)) {
      input.style.border = "1px solid #ff4444";
      input.style.color = "#ff7373";
      errorBox.textContent = "Invalid ARC address";
    } else {
      input.style.border = "1px solid var(--border)";
      input.style.color = "var(--text-main)";
      errorBox.textContent = "";
    }
  });
}

// Full validation for numeric decimal inputs
function setupDecimalValidation(input) {
  const errorBox = createErrorBox(input);

  input.addEventListener("input", () => {
    const v = input.value.trim();

    if (v === "") {
      errorBox.textContent = "";
      return;
    }

    if (!isValidDecimalNumber(v)) {
      input.style.border = "1px solid #ff4444";
      input.style.color = "#ff7373";
      errorBox.textContent = "Enter a valid decimal number";
    } else {
      input.style.border = "1px solid var(--border)";
      input.style.color = "var(--text-main)";
      errorBox.textContent = "";
    }
  });
}


// =======================
// APPLY VALIDATION
// =======================

setupAddressValidation(addrAInput);
setupAddressValidation(addrBInput);

setupDecimalValidation(gasUsedInput);
setupDecimalValidation(gasPriceInput);


// =======================
// GAS CALCULATOR
// =======================

function runEstimator() {
  const gas = gasUsedInput.value.trim();
  const gwei = gasPriceInput.value.trim();

  if (!isValidDecimalNumber(gas) || !isValidDecimalNumber(gwei)) {
    shake(gasUsedInput);
    shake(gasPriceInput);
    return;
  }

  const gasNum = Number(gas);
  const gweiNum = Number(gwei);

  const feeUSDC = (gasNum * gweiNum) / 1e9;

  feeUsdcEl.textContent = feeUSDC.toFixed(8) + " USDC";
  feeUsdEl.textContent = "$" + feeUSDC.toFixed(4);
  feeGasUsedEl.textContent = gasNum;
  feeGasPriceEl.textContent = gweiNum + " Gwei";

  resultCard.classList.remove("hidden");
}

calculateBtn.addEventListener("click", runEstimator);


// =======================
// GAS PRESET BUTTONS
// =======================

const presetButtons = [
  presetTransferBtn,
  presetContractBtn,
  presetDeployBtn
];

function clearPresetActive() {
  presetButtons.forEach(btn => btn.classList.remove("active"));
}

function applyPreset(btn, value) {
  clearPresetActive();
  btn.classList.add("active");
  gasUsedInput.value = value;
}

presetTransferBtn.addEventListener("click", () =>
  applyPreset(presetTransferBtn, 21000)
);
presetContractBtn.addEventListener("click", () =>
  applyPreset(presetContractBtn, 55000)
);
presetDeployBtn.addEventListener("click", () =>
  applyPreset(presetDeployBtn, 600000)
);


// =======================
// COPY SUMMARY
// =======================

copySummaryBtn.addEventListener("click", () => {
  const summary = `
ARC Gas Estimate

Fee: ${feeUsdcEl.textContent}
Approx USD: ${feeUsdEl.textContent}
Gas used: ${feeGasUsedEl.textContent}
Gas price: ${feeGasPriceEl.textContent}
`.trim();

  navigator.clipboard.writeText(summary);

  copySummaryBtn.textContent = "Copied!";
  copySummaryBtn.classList.add("btn-copied");

  setTimeout(() => {
    copySummaryBtn.textContent = "Copy summary";
    copySummaryBtn.classList.remove("btn-copied");
  }, 900);
});


// =======================
// WALLET COMPARISON
// =======================

async function fetchWalletGas(address) {
  const url = `https://testnet.arcscan.app/api?module=account&action=txlist&address=${address}`;
  const res = await fetch(url);
  const data = await res.json();

  const txs = data.result || [];
  let totalGas = 0;
  let totalFee = 0;

  txs.forEach(tx => {
    const gasUsed = Number(tx.gasUsed || 0);
    const gasPrice = Number(tx.gasPrice || 0);

    totalGas += gasUsed;
    totalFee += (gasUsed * gasPrice) / 1e18;
  });

  return {
    txCount: txs.length,
    gasUsed: totalGas,
    fee: totalFee
  };
}


compareBtn.addEventListener("click", async () => {
  const A = addrAInput.value.trim();
  const B = addrBInput.value.trim();

  if (!isValidArcAddress(A) || !isValidArcAddress(B)) {
    shake(addrAInput);
    shake(addrBInput);
    return;
  }

  compareStatusEl.textContent = "Fetching wallet data...";
  compareResultCard.classList.add("hidden");

  try {
    const [a, b] = await Promise.all([
      fetchWalletGas(A),
      fetchWalletGas(B)
    ]);

    aTxCountEl.textContent = a.txCount;
    aGasUsedEl.textContent = a.gasUsed;
    aFeeUsdcEl.textContent = a.fee.toFixed(6) + " USDC";

    bTxCountEl.textContent = b.txCount;
    bGasUsedEl.textContent = b.gasUsed;
    bFeeUsdcEl.textContent = b.fee.toFixed(6) + " USDC";

    compareSummaryTextEl.textContent =
      a.fee > b.fee
        ? "Wallet A spent more gas overall."
        : b.fee > a.fee
        ? "Wallet B spent more gas overall."
        : "Both wallets spent similar gas amounts.";

    compareStatusEl.textContent = "";
    compareResultCard.classList.remove("hidden");

  } catch (err) {
    compareStatusEl.textContent = "Error fetching data.";
  }
});


// =======================
// THEME TOGGLE
// =======================

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    themeToggleBtn.textContent = "🌞 Light";
  } else {
    document.body.classList.remove("light");
    themeToggleBtn.textContent = "🌙 Dark";
  }
}

themeToggleBtn.addEventListener("click", () => {
  const newTheme =
    document.body.classList.contains("light") ? "dark" : "light";

  applyTheme(newTheme);
  localStorage.setItem("arc_theme", newTheme);
});

(function initTheme() {
  const saved = localStorage.getItem("arc_theme");
  applyTheme(saved || "dark");
})();
