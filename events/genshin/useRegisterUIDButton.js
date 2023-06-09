const {
    Events,
    EmbedBuilder,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const fs = require('fs');

// 関数の読み込み
const checkExistsUserData = require('../../functions/genshin/checkExistsUserData');
const httpsRequest = require('../function/Genshin/httpsRequest');
const getEnkaInfo = require('../function/Genshin/getEnkaInfo');
const makeUserInfoEmbed = require('../../functions/genshin/makeUserInfoEmbed');
const makeScoreImage = require('../../functions/genshin/makeScoreImage');

// 変数の読み込み
const { genshin } = require('../../config.js');
const filePath = genshin.uidJsonPath;
let data, row;

const options = {
    method: 'GET',
};
const postData = null;

// 待機用の埋め込みメッセージ
const waitEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`読み込み中...`)

// UIDを取得する関数
// function checkExistsUserData(path, id) {

//     let ck = false;

//     if (fs.existsSync(path)) {

//         const json = JSON.parse(fs.readFileSync(path, 'utf8'));

//         json.UserData.forEach(data => {

//             if (data.id === id) {

//                 console.log(`Found! ${data.id} === ${id}`);
//                 ck = data.uid;

//             };

//         });

//     };

//     return ck;

// };


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isStringSelectMenu() || !interaction.isButton()) return;

        // ボタン
        if (interaction.customId === 'useRegisterUIDButton') {

            await interaction.update({ embeds: [waitEmbed], components: [] });

            const userId = interaction.user.id;
            const uid = checkExistsUserData(filePath, userId);  // UIDを取得

            if (uid) {

                const url = `https://enka.network/api/uid/${uid}?keyword_or=javascript&format=json`;

                const res = await httpsRequest(url, options, postData);
                data = await getEnkaInfo(res);

                const userInfoEmbed = makeUserInfoEmbed(uid, data);

                const select = new StringSelectMenuBuilder()
                    .setCustomId('select-character')
                    .setPlaceholder('表示するキャラクターを選択')

                let characterLength = Object.keys(data.CharacterData).length;
                for (let i = 0; i < characterLength; i++) {
                    select.addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`${data.CharacterData[i].Character.name}`)
                            .setValue(`${i}`),
                    );
                };

                row = new ActionRowBuilder()
                    .addComponents(select);

                await interaction.editReply({ embeds: [userInfoEmbed], components: [row] });

            }
            else {

                await interaction.editReply({ content: 'UIDが登録されていません', embeds: [], components: [] });

            };

        }

        // セレクトメニュー
        else if (interaction.customId === 'select-character') {

            const character = interaction.values[0];
            const scoreImage = makeScoreImage(data, character);

            const scoreEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${data.CharacterData[i].Character.name}`)
                .setImage(`${scoreImage}`)
                .setFooter('負荷軽減のため、最後の画像生成から約5分後に操作ができなくなります。')

            await interaction.update({ embeds: [scoreEmbed], components: [row] });

        };

    },
};