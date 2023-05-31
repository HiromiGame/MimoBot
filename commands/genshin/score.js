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

const { genshin } = require('../../config.js');
const filePath = genshin.uidJson;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('calc')
        .setDescription('スコアを計算します'),
    async execute(interaction) {

        const userId = interaction.user.id;

        let ck = checkExistsUserData(filePath, userId);

        // UID登録の埋め込みメッセージ
        const selectUIDEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('UIDを選択')
            .setTimestamp()

        const registerUIDButton = new ButtonBuilder()
        const notRegisterUIDButton = new ButtonBuilder()
        const useRegisteredUIDButton = new ButtonBuilder()
        const notUseRegisteredUIDButton = new ButtonBuilder()
        const selectUIDRow = new ActionRowBuilder()

        if (!ck) {

            selectUIDEmbed
                .setDescription(
                    'UIDが登録されていません\
                    \nUIDを登録しますか？\
                    \n※登録すると、今後はUIDを入力する必要がなくなります'
                );

            registerUIDButton
                .setCustomId('registerUIDButton')
                .setLabel('UIDを登録して確認')
                .setStyle(ButtonStyle.Success);

            notRegisterUIDButton
                .setCustomId('notRegisterUIDButton')
                .setLabel('登録せずに直接UIDから確認')
                .setStyle(ButtonStyle.Success);

            selectUIDRow.addComponents(registerUIDButton, notRegisterUIDButton);

        }
        else {

            selectUIDEmbed
                .setDescription(
                    'UIDが登録されています\
                    \n登録されているUIDを使いますか？'
                );

            useRegisteredUIDButton
                .setCustomId('useRegisterUIDButton')
                .setLabel('登録されたUIDから確認')
                .setStyle(ButtonStyle.Success);

            notUseRegisteredUIDButton
                .setCustomId('notUseRegisterUIDButton')
                .setLabel('直接UIDを入力して確認')
                .setStyle(ButtonStyle.Success);

            selectUIDRow.addComponents(useRegisteredUIDButton, notUseRegisteredUIDButton);

        };

        await interaction.reply({ embeds: [selectUIDEmbed], components: [selectUIDRow], ephemeral: true });

    },
};