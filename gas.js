function calculate() {
  const gasUsed = Number(document.getElementById("gasUsed").value);
  const gasPriceGwei = Number(document.getElementById("gasPrice").value);

  if (!gasUsed || !gasPriceGwei) {
    alert("Please enter Gas Used and Gas Price.");
    return;
  }

  const unitPerGwei = 1e-9;

  const totalFeeUSDC = gasUsed * gasPriceGwei * unitPerGwei;
  const estimatedUSD = totalFeeUSDC;

  document.getElementById("fee").textContent =
    totalFeeUSDC.toFixed(10) + " USDC";

  document.getElementById("usd").textContent =
    "$" + estimatedUSD.toFixed(6);

  document.getElementById("result").classList.remove("hidden");
}
