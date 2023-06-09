const {
    clientId,
    guildId,
    token
} = process.env;


module.exports = {
    "clientId": clientId,
    "guildId": guildId,
    "token": token,
    "genshin": {
        "uidJsonPath": 'data/Genshin/uidData.json',
        "infoJsonPath": 'data/Genshin/UserData/uidData.json'
    },

};