const {
    Events,
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

// 関数の読み込み
const checkExistsUserData = require('../../functions/genshin/checkExistsUserData');  // UIDが登録済みか確認

// 変数の読み込み
const { genshin } = require('../../config.js');
const filePath = genshin.uidJson;


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {


        if (!interaction.isChatInputCommand()) return;


        if (interaction.commandName === 'genshin') {

            if (interaction.options.getSubcommand() === 'score') {

                const userId = interaction.user.id;

                const ck = checkExistsUserData(filePath, userId);  // UIDが登録済みか確認

                // UID登録の埋め込みメッセージ
                const selectUIDEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('UIDを選択')

                const registerUIDButton = new ButtonBuilder()
                const notRegisterUIDButton = new ButtonBuilder()
                const useRegisteredUIDButton = new ButtonBuilder()
                const notUseRegisteredUIDButton = new ButtonBuilder()
                const selectUIDRow = new ActionRowBuilder()

                // 選択によって埋め込みメッセージとボタンを変更
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

                // リプライ
                await interaction.reply({ embeds: [selectUIDEmbed], components: [selectUIDRow], ephemeral: true });

            };

        };


    },
};