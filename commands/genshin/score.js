const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const fs = require('fs');

const checkExistsUserData = require('../../functions/genshin/checkExistsUserData');

const { genshin } = require('./config.js');
const filePath = genshin.uidJson;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('スコアを計算します'),
    async execute(interaction) {

        const userId = interaction.user.id;

    },
};