const BigNumber = require('bignumber.js');


module.exports = function (target, statusName, value) {

    switch (statusName) {
        case '会心率':
            console.log(`[Calc] ${value} x 2 = ${value * 2}`);
            value = BigNumber(value).times(2);
            break;
        case '攻撃力%':
        case '会心ダメージ':
            console.log(`[Calc] ${value}`);
            break;
        default:
            console.log('[Calc] 0');
            value = 0;
            break;
    };

    return BigNumber(target).plus(value).toFixed(2);

};