// Estimativa simples usando Gwei -> "USDC" (placeholders)
// A lógica é a mesma de antes, só mudamos o texto que aparece.

function calculate() {
  const gasUsed = Number(document.getElementById("gasUsed").value);
  const gasPriceGwei = Number(document.getElementById("gasPrice").value);

  if (!gasUsed || !gasPriceGwei) {
    alert("Please enter Gas Used and Gas Price.");
    return;
  }

  // 1 gwei = 1e-9 unidade "USDC" (apenas para ter um número pequeno bonitinho)
  const unitPerGwei = 1e-9;

  const totalFeeUSDC = gasUsed * gasPriceGwei * unitPerGwei;

  // Como USDC ~ 1 USD, a estimativa em USD é praticamente igual
  const estimatedUSD = totalFeeUSDC;

  document.getElementById("fee").textContent =
    totalFeeUSDC.toFixed(10) + " USDC";

  document.getElementById("usd").textContent =
    "$" + estimatedUSD.toFixed(6);

  document.getElementById("result").classList.remove("hidden");
}
