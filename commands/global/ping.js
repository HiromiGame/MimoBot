const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('ping値を表示'),
    async execute(interaction, client) {

        return interaction.reply(
            `Websocket Ping: ${client.ws.ping}\
            \nAPI Endpoint Ping: ${message.createdTimestamp - interaction.createdTimestamp}`
        );

    },
};