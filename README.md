<p align="center">
  <img src="https://raw.githubusercontent.com/joaodd1590-sys/arcgas-dapp/main/banner.png.png" width="850">
</p>

# 🚀 ARC Gas Estimator  
Gas & cost analysis toolkit for the **Arc Testnet** · USDC-focused

A lightweight and intuitive dApp built to help developers and users estimate gas fees on the **Arc Testnet**, compare total gas usage between wallets, and simplify cost analysis for on-chain activity.

The tool is fully responsive, optimized for mobile, and designed to deliver a clean and fast UX.

---

## 🔥 Live Demo
🔗 **https://arcgas-dapp-liart.vercel.app/**

---

## ✨ Features

### 🔹 **Gas Cost Estimator**
- Estimate transaction cost in **USDC** using gas used × gas price (Gwei)  
- Real-time precision calculation  
- Quick presets for:
  - Simple transfer  
  - Contract call  
  - Contract deployment  
- Summary export with **copy-to-clipboard**

### 🔹 **Wallet Gas Comparison**
- Compare gas usage between two wallets on Arc Testnet  
- Fetches:
  - Number of transactions  
  - Total gas consumed  
  - Total estimated fee in USDC  
- Provides a smart comparison summary  
- Uses live data from **ArcScan API**

### ⚡ Additional improvements
- Fully redesigned UI/UX  
- Smooth animations & active-state indicators  
- Built-in dark/light mode (with theme persistence)  
- Mobile-optimized layout  
- Clean and modern component structure

---

## 🖼️ Preview

*(Opcional — posso gerar imagens reais do seu dApp e adicionar aqui.)*

---

## 🛠️ Tech Stack

| Technology | Description |
|-----------|-------------|
| **HTML5 + CSS3** | UI layout + responsive design |
| **JavaScript (Vanilla)** | Core logic and estimators |
| **ArcScan API** | On-chain data (gas, tx, wallets) |
| **Vercel** | Deployment and hosting |

---

## 📡 API Reference (ArcScan)

### 🔍 Fetch wallet transactions
```url
https://testnet.arcscan.app/api?module=account&action=txlist&address=<WALLET>
