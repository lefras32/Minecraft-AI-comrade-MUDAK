# 🤖 Mudak AI — Minecraft Bot

An intelligent, interactive Minecraft bot powered by **Groq AI** and built with **Mineflayer**. It can carry out basic tasks like gathering resources, hunting animals, cooking food, following the player, and responding to commands.

---

## ✨ Features

- **🌲 Resource Gathering:** Automatically chops down trees and harvests wood.
- **🍖 Hunting & Cooking:** Hunts animals (e.g., sheep) and cooks raw meat.
- **🚶 Player Companion:** Follows you around and assists with in-game tasks.
- **⚡ Fast AI Processing:** Powered by **Groq Cloud API** for ultra-fast, low-latency AI responses.

---

## 📋 Prerequisites

Before running the bot, ensure you have the following installed and set up:

1. **Node.js**: Download and install [Node.js](https://nodejs.org/en) (v18 or higher recommended).
2. **Groq API Key**: Create a free account at [Groq Console](https://console.groq.com/) and generate an API key.

---

## ⚙️ Configuration & Setup

1. **Clone or Download** this repository:
   git clone [https://github.com/lefras32/Minecraft-AI-comrade-MUDAK.git](https://github.com/lefras32/Minecraft-AI-comrade-MUDAK.git)
   cd Minecraft-AI-comrade-MUDAK

```

2. **Install Dependencies:**
```bash
npm install

```


3. **Set Up API Key:**
Open `mudak.js` in a code editor and paste your **Groq API Key** in the designated field.
4. **Configure Bot Connection:**
Inside `mudak.js`, locate the bot connection settings:

const bot = mineflayer.createBot({
    host: 'localhost',
    port: 55555,
    username: 'Mudak_AI',
    version: '1.21.1'
});




> 💡 **Note:** Change `host` and `port` to match your local server or LAN world settings. We strongly recommend keeping the game version at **1.21.1**, as Mineflayer plugins work most reliably on this version.



---

## 🚀 How to Run

1. Open your Minecraft world/server (make sure LAN is opened or server port matches).
2. Open the project folder in terminal or command line.
3. Run the following command:

node index.js

