// const httpsRequest = require('./httpsRequest');

// /** 
//  * 翻訳用のJsonファイルを取得
//  * @returns {Object} キャラクター名が格納されたオブジェクト
//  * @returns {Object} 諸単語が格納されたオブジェクト
//  */
// module.exports = async function () {

//     const getCharacterURL = 'https://github.com/EnkaNetwork/API-docs/blob/master/store/characters.json?keyword_or=javascript&format=json';
//     const translatetionURL = 'https://github.com/EnkaNetwork/API-docs/blob/master/store/loc.json?keyword_or=javascript&format=json';
//     const options = {
//         method: 'GET',
//     };
//     const postData = null;

//     const getCharacterRes = await httpsRequest(getCharacterURL, options, postData);
//     const translationRes = await httpsRequest(translatetionURL, options, postData);

//     return { json1: getCharacterRes, json2: translationRes };

// };


const fs = require('fs');

/**
 * 翻訳用のJsonファイルを取得（ローカル）
 * @returns {Object} キャラクター名が格納されたオブジェクト
 * @returns {Object} 諸単語が格納されたオブジェクト
 */
module.exports = function () {

    const characterObject = JSON.parse(fs.readFileSync('data/Genshin/Translation/characters.json', 'utf8'));
    // console.log('[CK]');
    // console.log(characterObject);
    const translateObject = JSON.parse(fs.readFileSync('data/Genshin/Translation/translate.json', 'utf8'));
    // console.log(translateObject);

    return { characterObj: characterObject, translateObj: translateObject };

};