document.getElementById("calculate").addEventListener("click", () => {
    const gas = Number(document.getElementById("gasUsed").value);
    const gwei = Number(document.getElementById("gasPrice").value);

    if (!gas || !gwei) {
        alert("Please enter valid numeric values.");
        return;
    }

    // Convert Gwei → USDC-like decimals
    const totalFee = (gas * gwei) / 1e9;

    document.getElementById("totalFee").innerText = totalFee.toFixed(12) + " USDC";
    document.getElementById("totalUSD").innerText = "$" + totalFee.toFixed(12);
});
