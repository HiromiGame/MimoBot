function makeUserInfoEmbed(uid, data) {

    const UserInfoEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${data.PlayerData.name}のステータス`)
        .setURL(`https://enka.network/u/${uid}`)
        // .setThumbnail(`https://enka.network/ui/UI_AvatarIcon_${data.PlayerData.icon}.png`)
        // .setAuthor({ name: `UID: ${uid}` })
        .addFields(
            { name: 'ステータスメッセージ', value: `${data.PlayerData.statusMessage}` },
            { name: '冒険ランク', value: `${data.PlayerData.level}`, inline: true },
            { name: '世界ランク', value: `${data.PlayerData.worldLevel}`, inline: true },
            { name: 'アチーブメント', value: `${data.PlayerData.achievement}`, inline: true },
        )
        .setFooter({ text: `UID: ${uid}` });
    // .setTimestamp()

    if (data.PlayerData.towerFloor) {
        if (data.PlayerData.towerLevel) {
            UserInfoEmbed.addFields(
                { name: '深境螺旋', value: `${data.PlayerData.towerFloor} - ${data.PlayerData.towerLevel}`, inline: true },
            )
        }
        else {
            UserInfoEmbed.addFields(
                { name: '深境螺旋', value: `8 - 3`, inline: true },
            )
        };
    }
    else {
        UserInfoEmbed.addFields(
            { name: '深境螺旋', value: '未解放', inline: true },
        )
    };

    return UserInfoEmbed;

};