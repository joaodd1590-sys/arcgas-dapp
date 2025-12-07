document.getElementById("calculate").addEventListener("click", () => {
    const gas = Number(document.getElementById("gasUsed").value);
    const gwei = Number(document.getElementById("gasPrice").value);

    if (!gas || !gwei) {
        alert("Please enter valid numeric values.");
        return;
    }

    // Convert Gwei to USDC-like units (1 gwei = 1e-9)
    const totalFee = (gas * gwei) / 1e9;

    document.getElementById("fee").innerText = totalFee.toFixed(10) + " USDC";
    document.getElementById("usd").innerText = "$" + totalFee.toFixed(6);

    document.getElementById("result").classList.remove("hidden");
});
