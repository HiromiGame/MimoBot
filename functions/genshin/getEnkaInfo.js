const fs = require('fs');                   // Jsonファイル操作用
const BigNumber = require('bignumber.js');  // 計算用

const getTranslationInfo = require('./getTranslationInfo');  // 翻訳情報を取得
const getTranslateName = require('./getTranslateName');      // 単語を翻訳
const calcArticactScore = require('./calcArtifactScore');    // 聖遺物スコア計算用


module.exports = function (json) {

    // 翻訳用のオブジェクト
    const { characterObj, translateObj } = getTranslationInfo();

    // オブジェクト作成（プレーヤー情報、キャラクター情報）
    let PlayerData = new Object();
    let CharacterData = new Array();

    /**
     * @type {object} プレーヤーの詳細情報
     */
    let playerInfo = json.playerInfo;

    PlayerData.name = playerInfo.nickname;                 // プレーヤー名
    PlayerData.level = playerInfo.level;                   // 冒険ランク
    PlayerData.worldLevel = playerInfo.worldLevel;         // 世界ランク
    let statusMessage = playerInfo.signature;              // ステータスメッセージ
    if (!statusMessage) statusMessage = " ";
    PlayerData.statusMessage = statusMessage;
    PlayerData.icon = playerInfo.profilePicture.avatarId;  // プロフアイコン
    PlayerData.nameCardId = playerInfo.nameCardId;         // 名刺

    let achievement = playerInfo.finishAchievementNum;     // アチーブメント
    if (!achievement) achievement = "-";
    PlayerData.achievement = achievement;
    let towerFloor = playerInfo.towerFloorIndex;           // 深境螺旋の階層
    if (!towerFloor) towerFloor = "-";
    PlayerData.towerFloor = towerFloor;
    let towerLevel = playerInfo.towerLevelIndex;           // 深境螺旋の深度
    if (!towerLevel) towerLevel = "-";
    PlayerData.towerLevel = towerLevel;

    // キャラクターリスト
    let characterList = json.avatarInfoList;
    if (!characterList) return 0;
    let characterListLength = Object.keys(characterList).length;  // キャラクター数

    for (let i = 0; i < characterListLength; i++) {

        // オブジェクト作成（キャラクター、武器、聖遺物）
        CharacterData[i] = {
            Character: new Object(),
            Weapon: new Object(),
            Artifacts: new Object(),
            Score: new Object()
        };
        let character = CharacterData[i].Character;  // キャラクター
        let weapon = CharacterData[i].Weapon;        // 武器
        let artifacts = CharacterData[i].Artifacts;  // 聖遺物
        let score = CharacterData[i].Score;          // 聖遺物スコア

        /**
         * @param {Object} characterInfo - キャラクターの詳細情報
         */
        let characterInfo = characterList[i];

        let characterName = String(getTranslateName.character(characterInfo.avatarId, characterObj, translateObj));       // 名前
        console.log(`type: ${typeof (characterName)}, result: ${characterName}`);
        character.name = characterName;
        let characterElement = getTranslateName.element(characterInfo.avatarId, characterObj);          // 元素
        character.element = characterElement;
        character.level = parseFloat(characterInfo.propMap["4001"].val);                    // レベル
        let characterConst = characterInfo.talentIdList;
        if (!characterConst) character.const = 0
        else character.const = Object.keys(characterInfo.talentIdList).length;  // 命の星座（凸）
        character.love = characterInfo.fetterInfo.expLevel;                     // 好感度

        // オブジェクト作成（ステータス、基礎ステータス）
        character.status = new Object();
        let status = character.status;
        character.base = new Object();
        let base = character.base;

        /**
         * @param {Object} characterStatus - キャラクターのステータス
         */
        let characterStatus = characterInfo.fightPropMap;

        status["HP"] = Math.round(characterStatus["2000"]);
        status["攻撃力"] = Math.round(characterStatus["2001"]);
        status["防御力"] = Math.round(characterStatus["2002"]);
        status["元素熟知"] = Math.round(characterStatus["28"]);
        status["会心率"] = parseFloat((Math.round((characterStatus["20"] * 100) * 10) / 10).toFixed(1));
        status["会心ダメージ"] = parseFloat((Math.round((characterStatus["22"] * 100) * 10) / 10).toFixed(1));
        status["元素チャージ効率"] = parseFloat((Math.round((characterStatus["23"] * 100) * 10) / 10).toFixed(1));

        // 元素ダメージの元素を判別
        let statusNum, elementName;
        for (statusNum = 40; statusNum < 47; statusNum++) {
            if (characterStatus[`${statusNum}`] !== 0) break;
        };
        switch (statusNum) {
            case 40:
                elementName = '炎';
                break;
            case 41:
                elementName = '雷';
                break;
            case 42:
                elementName = '水';
                break;
            case 43:
                elementName = '草';
                break;
            case 44:
                elementName = '風';
                break;
            case 45:
                elementName = '岩';
                break;
            case 46:
                elementName = '氷';
                break;
            default:
                elementName = '不明';
                break;
        };

        status[`${elementName}元素ダメージ`] = parseFloat((Math.round((characterStatus[`${statusNum}`] * 100) * 10) / 10).toFixed(1));
        base["HP"] = Math.round(characterStatus["1"]);
        base["攻撃力"] = Math.round(characterStatus["4"]);
        base["防御力"] = Math.round(characterStatus["7"]);

        // console.log('CharacterStatus:');
        // console.dir(status);

        // オブジェクト作成（スキル）
        character.skill = new Object();
        let skill = character.skill;

        /**
         * @param {Object} characterSkill - キャラクターのスキル
         */
        let characterSkill = Object.values(characterInfo.skillLevelMap);

        skill["通常"] = characterSkill[0];
        skill["スキル"] = characterSkill[1];
        skill["爆発"] = characterSkill[2];

        /**
         * @param {number} equipInfoLength - 武器情報の格納位置
         * @param {Object} equipInfo - キャラクターの装備
         * @param {Object} weaponInfo - キャラクターの武器
         */
        let equipInfoLength = Object.keys(characterInfo.equipList).length;
        // console.log(`EquipLength: ${equipInfoLength}`);
        let equipInfo = characterInfo.equipList;
        let weaponInfo = equipInfo[`${equipInfoLength - 1}`];

        let weaponId = weaponInfo.itemId;                            // 名前
        let weaponName = getTranslateName.func(weaponId, translateObj);
        weapon.name = weaponName;
        // console.log(`WeaponName: ${weapon.name}`);
        weapon.level = weaponInfo.weapon.level;                      // レベル
        // console.log(`WeaponLevel: ${weapon.level}`);
        let weaponRank = Object.values(weaponInfo.weapon.affixMap);    // 精錬ランク
        weapon.rank = weaponRank[0] + 1;
        // console.log(`WeaponRank: ${weapon.rank}`);
        weapon.rarelity = weaponInfo.flat.rankLevel;                 // レアリティ
        // console.log(`WeaponRarelity: ${weapon.rarelity}`);
        let weaponStats = Object.values(weaponInfo.flat.weaponStats);  // 基礎攻撃力
        weapon.baseATK = weaponStats[0].statValue;
        // console.log(`WeaponBaseATK: ${weapon.baseATK}`);

        // オブジェクト作成（武器のサブステータス）
        weapon.sub = new Object();
        let weaponSub = weapon.sub;

        let weaponSubStatusName = getTranslateName.func(weaponStats[1].appendPropId, translateObj);  // ステータス名
        weaponSub.name = weaponSubStatusName;
        weaponSub.value = weaponStats[1].statValue;                                     // ステータスの値
        // console.log(`WeaponSubStatus: ${weaponSub.name}, ${weaponSub.value}`);

        // 聖遺物スコア用
        let scoreArray = [0, 0, 0, 0, 0];

        for (let j = 0; j < equipInfoLength - 1; j++) {

            // 聖遺物の判別
            let artifact;
            switch (j) {
                case 0:
                    artifacts.flower = new Object();
                    artifact = artifacts.flower;
                    break;
                case 1:
                    artifacts.wing = new Object();
                    artifact = artifacts.wing;
                    break;
                case 2:
                    artifacts.clock = new Object();
                    artifact = artifacts.clock;
                    break;
                case 3:
                    artifacts.cup = new Object();
                    artifact = artifacts.cup;
                    break;
                case 4:
                    artifacts.crown = new Object();
                    artifact = artifacts.crown;
                    break;
            };

            /**
             * @param {object} equip - キャラクターの聖遺物
             */
            let equip = equipInfo[j];

            let artifactId = equip.flat.setNameTextMapHash;
            let artifactName = getTranslateName.func(artifactId, translateObj);
            artifact.type = artifactName;
            artifact.level = (equip.reliquary.level) - 1;
            // console.log(`_ArtifactLevel: ${artifact.level}`);
            artifact.rarelity = equip.flat.rankLevel;
            // console.log(`_ArtifactRarelity: ${artifact.rarelity}`);

            // オブジェクト作成（聖遺物のメインステータス、サブステータス群）
            artifact.main = new Object();
            let artifactMain = artifact.main;
            artifact.sub = new Array();
            let artifactSub = artifact.sub;

            let mainStatusName = getTranslateName.func(equip.flat.reliquaryMainstat.mainPropId, translateObj);
            artifactMain.option = mainStatusName;
            artifactMain.value = equip.flat.reliquaryMainstat.statValue;
            // console.log(`__ArtifactMainStatus: ${artifactMain.option}, ${artifactMain.value}`);

            let artifactSubStatusLength = Object.keys(equip.flat.reliquarySubstats).length;  // サブステータスの数
            let artifactSubStatusList = Object.values(equip.flat.reliquarySubstats);

            for (let k = 0; k < artifactSubStatusLength; k++) {

                // オブジェクト作成（サブステータス）
                artifactSub[k] = new Object();
                let artifactSubStatus = artifactSub[k];

                let subStatusName = getTranslateName.func(artifactSubStatusList[k].appendPropId, translateObj);
                artifactSubStatus.option = subStatusName;
                artifactSubStatus.value = artifactSubStatusList[k].statValue;

                // スコア計算
                scoreArray[j] = calcArticactScore(scoreArray[j], artifactSubStatus.option, artifactSubStatusList[k].statValue);

            };

        };

        score.flower = parseFloat(scoreArray[0]).toFixed(1);
        score.wing = parseFloat(scoreArray[1]).toFixed(1);
        score.clock = parseFloat(scoreArray[2]).toFixed(1);
        score.cup = parseFloat(scoreArray[3]).toFixed(1);
        score.crown = parseFloat(scoreArray[4]).toFixed(1);

        let total = 0;
        for (let l = 0; l < 5; l++) {
            total = BigNumber(total).plus(scoreArray[l]);
        };
        score.total = parseFloat(total).toFixed(1);
    };

    // console.dir(CharacterData);

    // オブジェクトからJSONファイルを作成
    let outputData = JSON.stringify({ PlayerData, CharacterData }, null, ' ')
    fs.writeFileSync('userData.json', outputData);

    // 戻り値
    let data = {
        PlayerData: PlayerData,
        CharacterData: CharacterData
    };
    console.dir(data);
    return data;

};