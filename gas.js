// ===== DOM ELEMENT REFERENCES =====
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

// Wallet comparison elements
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

// ================== GAS ESTIMATOR ==================

function runEstimator() {
  const gas = Number(gasUsedInput.value);
  const gwei = Number(gasPriceInput.value);

  // Basic validation
  if (!gas || !gwei || gas <= 0 || gwei <= 0) {
    alert("Please enter valid gas values.");
    return;
  }

  // Fee calculation (USDC ~ ETH units)
  const feeUSDC = (gas * gwei) / 1e9;

  // Update UI
  feeUsdcEl.textContent = feeUSDC.toFixed(8) + " USDC";
  feeUsdEl.textContent = "$" + feeUSDC.toFixed(4);
  feeGasUsedEl.textContent = gas.toString();
  feeGasPriceEl.textContent = gwei + " Gwei";

  // Reveal result card
  resultCard.classList.remove("hidden");
}

calculateBtn.addEventListener("click", runEstimator);

// ================== GAS PRESET BUTTONS ==================

const presetButtons = [
  presetTransferBtn,
  presetContractBtn,
  presetDeployBtn
];

// Removes highlight from all preset buttons
function clearPresetActive() {
  presetButtons.forEach(btn => btn.classList.remove("active"));
}

// Applies a preset value and highlights the chosen button
function applyPreset(btn, value) {
  clearPresetActive();
  btn.classList.add("active");
  gasUsedInput.value = value;
}

// Preset definitions
presetTransferBtn.addEventListener("click", () =>
  applyPreset(presetTransferBtn, 21000)
);
presetContractBtn.addEventListener("click", () =>
  applyPreset(presetContractBtn, 55000)
);
presetDeployBtn.addEventListener("click", () =>
  applyPreset(presetDeployBtn, 600000)
);

// ================== COPY SUMMARY BUTTON ==================

copySummaryBtn.addEventListener("click", () => {
  const summary = `
ARC Gas Estimate

Fee: ${feeUsdcEl.textContent}
Approx USD: ${feeUsdEl.textContent}
Gas used: ${feeGasUsedEl.textContent}
Gas price: ${feeGasPriceEl.textContent}
`.trim();

  navigator.clipboard.writeText(summary);

  // Visual feedback
  copySummaryBtn.textContent = "Copied!";
  copySummaryBtn.classList.add("btn-copied");

  setTimeout(() => {
    copySummaryBtn.textContent = "Copy summary";
    copySummaryBtn.classList.remove("btn-copied");
  }, 900);
});

// ================== WALLET GAS COMPARISON ==================

async function fetchWalletGas(address) {
  const url = `https://testnet.arcscan.app/api?module=account&action=txlist&address=${address}`;
  const res = await fetch(url);
  const data = await res.json();

  const txs = data.result || [];
  let totalGas = 0;
  let totalFee = 0;

  // Aggregate gas usage and estimated cost
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

  compareStatusEl.textContent = "Fetching wallet data...";
  compareResultCard.classList.add("hidden");

  try {
    // Fetch both wallets in parallel
    const [a, b] = await Promise.all([
      fetchWalletGas(A),
      fetchWalletGas(B)
    ]);

    // Update UI results
    aTxCountEl.textContent = a.txCount;
    aGasUsedEl.textContent = a.gasUsed;
    aFeeUsdcEl.textContent = a.fee.toFixed(6) + " USDC";

    bTxCountEl.textContent = b.txCount;
    bGasUsedEl.textContent = b.gasUsed;
    bFeeUsdcEl.textContent = b.fee.toFixed(6) + " USDC";

    // Comparison summary
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

// ================== THEME TOGGLER ==================

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light");
    themeToggleBtn.textContent = "🌞 Light";
  } else {
    document.body.classList.remove("light");
    themeToggleBtn.textContent = "🌙 Dark";
  }
}

// Toggle light/dark mode
themeToggleBtn.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(newTheme);
  localStorage.setItem("arc_theme", newTheme);
});

// Initial theme load
(function initTheme() {
  const saved = localStorage.getItem("arc_theme");
  applyTheme(saved || "dark");
})();
