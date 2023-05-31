const {
    Events,
    EmbedBuilder,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');
const fs = require('fs');

const { genshin } = require('../../config.js');


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'registerUIDButton') {

            const uidInputModal = new ModalBuilder()
                .setCustomId('registerUIDModal')
                .setTitle('あなたの原神の情報を表示');

            const uidInput = new TextInputBuilder()
                .setCustomId('uidInput')
                .setLabel("UIDを入力")
                .setMaxLength(9)
                .setMinLength(9)
                .setPlaceholder('*********')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const actionRow = new ActionRowBuilder().addComponents(uidInput);
            uidInputModal.addComponents(actionRow);

            await interaction.showModal(uidInputModal);

        };

        if (interaction.customId === 'registerUIDModal') {

            const userId = interaction.user.id;
            const uid = interaction.fields.getTextInputValue('uidInput');
            let filePath = genshin.uidJson;
            let userData = [];

            if (fs.existsSync(filePath)) {

                let json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                json.UserData.forEach((obj) => {
                    let data = {
                        id: obj.id,
                        uid: obj.uid
                    };
                    userData.push(data)
                });

            }

            let data = {
                id: userId,
                uid: uid,
            };

            userData.push(data);
            let outputData = JSON.stringify({ UserData: userData }, null, ' ')
            fs.writeFileSync(filePath, outputData);

            // UID登録の埋め込みメッセージ
            const registeredEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setDescription(
                    `UID: **${uid}** を登録しました\
                    \n続けてスコアを表示しますか？`
                )
                .setTimestamp()

            const showScoreButton = new ButtonBuilder()
                .setCustomId('showScoreButton')
                .setLabel('登録したUIDで確認')
                .setStyle(ButtonStyle.Success);
            const notShowScoreButton = new ButtonBuilder()
                .setCustomId('notShowScoreButton')
                .setLabel('確認しない')
                .setStyle(ButtonStyle.Success);
            const selectShowRow = new ActionRowBuilder()
                .addComponents(showScoreButton, notShowScoreButton);

            await interaction.update({ embeds: [registeredEmbed], components: [selectShowRow] });

        };

    },
};