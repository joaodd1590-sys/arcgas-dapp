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

/* ==============================
   GAS ESTIMATOR
================================= */
function runEstimator() {
  const gas = Number(gasUsedInput.value);
  const gwei = Number(gasPriceInput.value);

  if (!gas || !gwei) {
    alert("Enter valid values.");
    return;
  }

  const fee = (gas * gwei) / 1e9;

  feeUsdcEl.textContent = `${fee.toFixed(8)} USDC`;
  feeUsdEl.textContent = `$${fee.toFixed(4)}`;
  feeGasUsedEl.textContent = gas;
  feeGasPriceEl.textContent = `${gwei} Gwei`;

  resultCard.classList.remove("hidden");
}

calculateBtn.addEventListener("click", runEstimator);

/* PRESETS */
function clearActive() {
  presetTransferBtn.classList.remove("active");
  presetContractBtn.classList.remove("active");
  presetDeployBtn.classList.remove("active");
}

presetTransferBtn.onclick = () => {
  clearActive();
  presetTransferBtn.classList.add("active");
  gasUsedInput.value = 21000;
};

presetContractBtn.onclick = () => {
  clearActive();
  presetContractBtn.classList.add("active");
  gasUsedInput.value = 55000;
};

presetDeployBtn.onclick = () => {
  clearActive();
  presetDeployBtn.classList.add("active");
  gasUsedInput.value = 600000;
};

/* COPY SUMMARY */
copySummaryBtn.onclick = () => {
  const text = `
ARC Gas Estimate

Fee: ${feeUsdcEl.textContent}
USD: ${feeUsdEl.textContent}
Gas Used: ${feeGasUsedEl.textContent}
Gas Price: ${feeGasPriceEl.textContent}
`;

  navigator.clipboard.writeText(text);
  copySummaryBtn.textContent = "Copied!";
  setTimeout(() => (copySummaryBtn.textContent = "Copy summary"), 1000);
};

/* ==============================
   WALLET GAS COMPARISON
================================= */
async function fetchWallet(address) {
  const url =
    `https://testnet.arcscan.app/api?module=account&action=txlist&address=${address}`;

  const res = await fetch(url);
  const data = await res.json();

  const txs = data.result ?? [];

  let totalGas = 0;
  let fee = 0;

  for (const tx of txs) {
    const gasUsed = Number(tx.gasUsed || 0);
    const gasPrice = Number(tx.gasPrice || 0);
    totalGas += gasUsed;
    fee += (gasUsed * gasPrice) / 1e18;
  }

  return {
    txCount: txs.length,
    gasUsed: totalGas,
    fee,
  };
}

compareBtn.onclick = async () => {
  const A = addrAInput.value.trim();
  const B = addrBInput.value.trim();

  compareStatusEl.textContent = "Loading...";
  compareResultCard.classList.add("hidden");

  try {
    const [a, b] = await Promise.all([fetchWallet(A), fetchWallet(B)]);

    aTxCountEl.textContent = a.txCount;
    aGasUsedEl.textContent = a.gasUsed;
    aFeeUsdcEl.textContent = `${a.fee.toFixed(6)} USDC`;

    bTxCountEl.textContent = b.txCount;
    bGasUsedEl.textContent = b.gasUsed;
    bFeeUsdcEl.textContent = `${b.fee.toFixed(6)} USDC`;

    compareSummaryTextEl.textContent =
      a.fee > b.fee
        ? "Wallet A spent more gas."
        : b.fee > a.fee
        ? "Wallet B spent more gas."
        : "Both wallets spent the same amount.";

    compareStatusEl.textContent = "";
    compareResultCard.classList.remove("hidden");
  } catch {
    compareStatusEl.textContent = "Error fetching data.";
  }
};
