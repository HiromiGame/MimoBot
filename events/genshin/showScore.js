const {
    Events,
    EmbedBuilder,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    User
} = require('discord.js');
const fs = require('fs');

const checkExistsUserData = require('../../functions/genshin/checkExistsUserData');
const makeUserInfoEmbed = require('../../functions/genshin/makeUserInfoEmbed');
const httpsRequest = require('../function/Genshin/httpsRequest');
const getEnkaInfo = require('../function/Genshin/getEnkaInfo');

const { genshin } = require('../../config.js');
const filePath = genshin.uidJson;
let timeout = [];
let data;

const waitEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setDescription(`処理中...`)


module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (interaction.customId === 'showScoreButton' || interaction.customId === 'useRegisterUIDButton') {

            const userId = interaction.user.id;

            if (timeout.includes(userId)) {
                return interaction.update({ content: 'クールダウン中です\n1分後にやり直してください', embeds: [], components: [] });
            };

            await interaction.update({ embeds: [waitEmbed], components: [] });

            let uid = checkExistsUserData(filePath, userId);
            console.log(uid);

            if (uid) {

                const url = `https://enka.network/api/uid/${uid}?keyword_or=javascript&format=json`;
                const options = {
                    method: 'GET',
                };
                const postData = null;

                const res = await httpsRequest(url, options, postData);
                data = await getEnkaInfo(res);

                const userInfoEmbed = makeUserInfoEmbed(uid, data);

                let buttonList = [];
                let characterLength = Object.keys(data.CharacterData).length;
                for (let i = 0; i < characterLength; i++) {
                    const button = new ButtonBuilder()
                        .setCustomId(`button${i}`)
                        .setLabel(`${data.CharacterData[i].Character.name}`)
                        .setStyle(ButtonStyle.Secondary);

                    buttonList[i] = button;
                }

                let row1 = new ActionRowBuilder();
                let row2 = new ActionRowBuilder();

                if (buttonList.length > 4) {

                    for (let i = 0; i < 4; i++) {
                        row1.addComponents(buttonList[i]);
                    };
                    for (let i = 4; i < buttonList.length; i++) {
                        row2.addComponents(buttonList[i]);
                    };

                    await interaction.editReply({ embeds: [userInfoEmbed], components: [row1, row2] });

                }
                else {

                    for (let i = 0; i < buttonList.length; i++) {
                        row1.addComponents(buttonList[i]);
                    };

                    await interaction.editReply({ embeds: [userInfoEmbed], components: [row1] });

                };

                timeout.push(interaction.user.id);
                setTimeout(() => {
                    timeout.shift();
                }, 60000);

            }
            else {
                await interaction.editReply({ content: 'UIDが登録されていません', embeds: [], components: [] });
            };

        };

        if (interaction.customId === 'button0') {

            const character = data.CharacterData[0].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button1') {

            const character = data.CharacterData[1].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button2') {

            const character = data.CharacterData[2].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button3') {

            const character = data.CharacterData[3].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button4') {

            const character = data.CharacterData[4].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button5') {

            const character = data.CharacterData[5].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button6') {

            const character = data.CharacterData[6].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

        if (interaction.customId === 'button7') {

            const character = data.CharacterData[7].Character;
            const status = character.status;
            let elementDamageTxt = `${character.element}元素ダメージ`;

            const characterEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${character.name}`)
                .addFields(
                    { name: 'レベル', value: `Lv. ${character.level}`, inline: true },
                    { name: '元素', value: `${character.element}元素`, inline: true },
                    { name: '命の星座（凸）', value: `${character.const}`, inline: true },
                    { name: '好感度', value: `${character.love}`, inline: true },
                )
                .addFields(
                    { name: 'HP', value: `Lv. ${status["HP"]} (${character.base["HP"]} + ${status["HP"] - character.base["HP"]})` },
                    { name: '攻撃力', value: `${status["攻撃力"]} (${character.base["攻撃力"]} + ${status["攻撃力"] - character.base["攻撃力"]})` },
                    { name: '防御力', value: `${status["防御力"]} (${character.base["防御力"]} + ${status["防御力"] - character.base["防御力"]})` },
                    { name: '元素熟知', value: `${status["元素熟知"]}` },
                    { name: '会心率', value: `${status["会心率"]}` },
                    { name: '会心ダメージ', value: `${status["会心ダメージ"]}` },
                    { name: '元素チャージ効率', value: `${status["元素チャージ効率"]}` },
                    { name: `${elementDamageTxt}`, value: `${status[`${elementDamageTxt}`]}` },
                )
            // .setFooter({ text: `UID: ${uid}` });

            await interaction.update({ embeds: [characterEmbed] });

        };

    },
};