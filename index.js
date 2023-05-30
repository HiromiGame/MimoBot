const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const express = require("express");  // APIサーバー (UptimeRobot用)

const { token } = require('./config.js');


// インスタンスの作成（GatewayIntents全定義）
const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
});


// コマンドハンドリング
client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        };
    };
};


// イベントハンドリング
const eventFoldersPath = path.join(__dirname, 'events');
const eventFolders = fs.readdirSync(eventFoldersPath);

for (const folder of eventFolders) {
    const eventsPath = path.join(eventFoldersPath, folder);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        };
    };
};


// ルーティングの設定
const app = express();

app.get("/", (req, res) => {
    res.write("online");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
});

app.listen(3000, () => {
    console.log(`Opened API Server`);
});


// ログイン
client.login(token);