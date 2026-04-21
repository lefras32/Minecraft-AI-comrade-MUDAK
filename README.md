This is an AI bot that can perform basic functions like harvesting wood, killing a sheep, cooking meat, following you, etc. It runs on the free groq AI.
MUDAK AI REQUIRES NODE JS https://nodejs.org/en
Also, be sure to register at https://console.groq.com/ and get an API key, which you paste into mudak.js.
To run, open a local server in the world or server, open mudak.js, and look for this piece of code:
const bot = mineflayer.createBot({
host: 'localhost',
port: 55555,
username: 'Mudak_AI',
version: '1.21.1'
});
Feel free to change the data to suit your needs, but I recommend using version 1.21.1 because the plugins work most reliably on it.
After opening the server, return to the folder, click an empty space, open it in the terminal, and type node index.js.
