/** 
 * キャラクターIdからキャラクター名を取得
 * @returns {string} - キャラクター名
 */
exports.character = function (id, characterData, translationData) {

    console.log(`id: ${id}`);
    const targetId = characterData[`${id}`].NameTextMapHash;
    console.log(`target: ${targetId} -> ${translationData.ja[`${targetId}`]}`);
    let stringName = String(translationData.ja[`${targetId}`]);
    console.log(`type: ${typeof (stringName)}, value: ${stringName}`);
    return stringName;

};


/** 
 * 元素名を英語から日本語に翻訳
 * @returns {string} - 元素名
 */
exports.element = function (id, characterData) {

    const target = characterData[`${id}`].Element;

    switch (target) {
        case "Ice":
            return "氷";
        case "Wind":
            return "風";
        case "Electric":
            return "雷";
        case "Water":
            return "水";
        case "Fire":
            return "炎";
        case "Rock":
            return "岩";
        case "Grass":
            return "草";
        default:
            return;
    };

};


/** 
 * 以下の英語名を日本語に翻訳
 * ・武器名
 * ・スタータス名（武器、聖遺物）
 * @returns {string} - 日本語名
 */
exports.func = function (id, translationData) {

    return translationData.ja[`${id}`];

};