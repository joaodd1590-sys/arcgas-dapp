// Estimated ARC price in USD (placeholder since Arc has no token yet)
const ARC_USD = 0.002; 

function calculate() {
    const gasUsed = Number(document.getElementById("gasUsed").value);
    const gasPriceGwei = Number(document.getElementById("gasPrice").value);

    if (!gasUsed || !gasPriceGwei) {
        alert("Please enter Gas Used and Gas Price.");
        return;
    }

    // Convert Gwei to ARC (1 gwei = 1e-9 ARC, similar to ETH)
    const gasPriceARC = gasPriceGwei * 1e-9;

    const totalFeeARC = gasUsed * gasPriceARC;
    const estimatedUSD = totalFeeARC * ARC_USD;

    document.getElementById("fee").textContent = totalFeeARC.toFixed(10);
    document.getElementById("usd").textContent = "$" + estimatedUSD.toFixed(6);

    document.getElementById("result").classList.remove("hidden");
}
