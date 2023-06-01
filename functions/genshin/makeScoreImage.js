const { createCanvas, loadImage, registerFont } = require('canvas');


module.exports = async function makeScoreImage(data) {

    registerFont('assets/genshin/fonts/genshinFont.ttf', { family: 'GenshinFont' });

    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');  // ここからはブラウザと共通

    const baseImg = await loadImage('assets/genshin/images/bot/base.png');
    // const charaImg = await loadImage('');
    // const overlayImg = await loadImage('assets/genshin/images/bot/overlay.png');

    ctx.drawImage(baseImg, 0, 0, 1920, 1080);
    // ctx.drawImage(charaImg, 0, 0, 1920, 1080);
    // ctx.drawImage(overlayImg, 0, 0, 1920, 1080);

    const character = data.CharacterData[0].Character;
    const status = character.status;
    // let elementDamageTxt = `${character.element}元素ダメージ`;

    ctx.fillStyle = "white";
    ctx.textBaseline = "top";

    ctx.textAlign = "left";
    ctx.font = '23px "GenshinFont"';
    ctx.fillText('会心ダメージ', 1580, 133, 155);
    ctx.fillText('88.8%', 1753, 133, 130);
    ctx.fillText('会心率', 1580, 164, 155);
    ctx.fillText('88.8%', 1753, 164, 130);
    ctx.fillText('元素チャージ効率', 1580, 195, 155);
    ctx.fillText('88.8%', 1753, 195, 130);
    ctx.fillText('元素熟知', 1580, 226, 155);
    ctx.fillText('888', 1753, 226, 130);
    ctx.fillText('会心ダメージ', 1580, 319, 155);
    ctx.fillText('会心率', 1580, 350, 155);
    ctx.fillText('元素チャージ効率', 1580, 381, 155);
    ctx.fillText('元素熟知', 1580, 412, 155);
    ctx.fillText('会心ダメージ', 1580, 505, 155);
    ctx.fillText('会心率', 1580, 536, 155);
    ctx.fillText('元素チャージ効率', 1580, 567, 155);
    ctx.fillText('元素熟知', 1580, 598, 155);
    ctx.fillText('会心ダメージ', 1580, 691, 155);
    ctx.fillText('会心率', 1580, 722, 155);
    ctx.fillText('元素チャージ効率', 1580, 753, 155);
    ctx.fillText('元素熟知', 1580, 784, 155);
    ctx.fillText('会心ダメージ', 1580, 877, 155);
    ctx.fillText('会心率', 1580, 908, 155);
    ctx.fillText('元素チャージ効率', 1580, 939, 155);
    ctx.fillText('元素熟知', 1580, 970, 155);
    ctx.font = '36px "GenshinFont"';
    ctx.fillText('HP', 131, 55);
    ctx.fillText(`${status["HP"]}`, 455, 55);
    ctx.fillText(`攻撃力　　　　　　${status["攻撃力"]}`, 131, 148);
    ctx.fillText(`防御力　　　　　　${status["防御力"]}`, 131, 237);
    ctx.fillText(`元素熟知　　　　　${status["元素熟知"]}`, 131, 330);
    ctx.fillText(`会心率　　　　　　${status["会心率"]}%`, 131, 421);
    ctx.fillText(`会心ダメージ　　　${status["会心ダメージ"]}%`, 131, 511);
    ctx.fillText(`元素チャージ効率　${status["元素チャージ効率"]}%`, 131, 604);
    if (status[`${character.element}元素ダメージ`]) {
        ctx.fillText(`${character.element}元素ダメージ　　${status[`${character.element}元素ダメージ`]}%`, 131, 695);
    };
    ctx.font = '41px "GenshinFont"';
    ctx.fillText(`${character.level}`, 349, 939);
    if (character.const == 0) ctx.fillText('無凸', 428, 939);
    else ctx.fillText(`${character.const}凸`, 428, 939);
    ctx.font = '100px "GenshinFont"';
    ctx.fillText(`${character.name}`, 64, 808);

    ctx.textAlign = "center";
    ctx.font = '18px "GenshinFont"';
    ctx.fillText('+20', 1597, 268);
    ctx.font = '26px "GenshinFont"';
    ctx.fillText('スコア合計：', 1480, 52);
    ctx.fillText('（攻撃力%）', 1782, 52);
    ctx.font = '32px "GenshinFont"';
    ctx.fillText('Lv 10', 1093, 854);
    ctx.fillText('Lv 10', 1203, 854);
    ctx.fillText('Lv 10', 1311, 854);
    ctx.font = '41px "GenshinFont"';
    ctx.fillText('888.8', 1625, 37);

    ctx.textAlign = "right";
    ctx.font = '21px "GenshinFont"';
    ctx.fillText('精錬ランク5  Lv 90', 1350, 1010);
    ctx.font = '23px "GenshinFont"';
    ctx.fillText('基礎攻撃力 888/元チャ効率 88.8%', 1350, 974, 355);
    ctx.font = '32px "GenshinFont"';
    ctx.fillText('HP', 1552, 203);
    ctx.fillText('攻撃力', 1552, 388);
    ctx.fillText('元チャ効率', 1552, 575, 150);
    ctx.fillText('雷元素ダメ', 1552, 760, 150);
    ctx.fillText('会心ダメ', 1552, 946, 150);
    ctx.font = '36px "GenshinFont"';
    ctx.fillText('蒼古なる自由への誓い', 1350, 925);
    ctx.font = '41px "GenshinFont"';
    ctx.fillText('8888', 1552, 240);
    ctx.fillText('8888', 1552, 426);
    ctx.fillText('88.8%', 1552, 610);
    ctx.fillText('88.8%', 1552, 797);
    ctx.fillText('88.8%', 1552, 984);

    const buffer = canvas.toBuffer('image/png');
    return buffer;

};