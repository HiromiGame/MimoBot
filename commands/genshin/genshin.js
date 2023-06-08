const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('genshin')
        .setDescription('原神にまつわる便利機能です')
        .addSubcommand(subcommand =>
            subcommand
                .setName('score')
                .setDescription('UIDからキャラ情報を取得し、スコア計算をします'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('code')
                .setDescription('交換コードから、コードが入力済みのURLを表示します')
                .addStringOption(option =>
                    option
                        .setName('code')
                        .setDescription('交換コードを入力')
                        .setMinLength(1)
                )
        ),
    async execute(interaction) { },
};