# 🤖 Mudak AI — Minecraft Bot

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Mineflayer](https://img.shields.io/badge/Mineflayer-1E1E1E?style=for-the-badge&logo=minecraft&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=ai&logoColor=white)

An intelligent, interactive Minecraft bot powered by **Groq AI** and built with **Mineflayer**. It can carry out basic tasks like gathering resources, hunting animals, cooking food, following the player, and responding to chat commands in real time.

---

## ✨ Features

- **🌲 Resource Gathering:** Automatically chops down trees and harvests wood blocks.
- **🍖 Hunting & Cooking:** Hunts passive mobs (e.g., sheep, cows) and cooks raw meat.
- **🚶 Player Companion:** Smartly follows specified players and assists with in-game automation.
- **⚡ Fast AI Processing:** Powered by **Groq Cloud API** for ultra-fast LLM inference and low-latency responses.

---

## 📋 Prerequisites

Before running the bot, ensure you have the following installed and set up:

1. **Node.js**: Download and install [Node.js](https://nodejs.org) (v18 or higher recommended).
2. **Groq API Key**: Create a free account at [Groq Console](https://groq.com) and generate your personal API key.

---

## ⚙️ Configuration & Setup

1. **Clone or Download** this repository:
   ```text
   git clone https://github.com
   cd Minecraft-AI-comrade-MUDAK
   ```

2. **Install Dependencies:**
   ```text
   npm install
   ```

3. **Set Up API Key:**
   Open `mudak.js` in your code editor and paste your **Groq API Key** in the designated client configuration field.

4. **Configure Bot Connection:**
   Inside `mudak.js`, locate and adjust the connection options to match your local setup:
   ```javascript
   const bot = mineflayer.createBot({
       host: 'localhost',
       port: 55555,
       username: 'Mudak_AI',
       version: '1.21.1'
   });
   ```

> 💡 **Note:** Change `host` and `port` to match your local server or opened LAN world settings. We strongly recommend keeping the game version at **1.21.1**, as Mineflayer core plugins function most reliably on this release.

---

## 🚀 How to Run

1. Open your Minecraft world/server (ensure LAN is opened or server port matches your config).
2. Open the project folder in your terminal or command line.
3. Start the script by running:
   ```text
   node index.js
   ```
