const https = require('https');


module.exports = function (url, options, postData) {
    return new Promise((resolve, reject) => {

        let req = https.request(url, options, (res) => {

            console.log('statusCode:', res.statusCode);

            // エラー
            if (res.statusCode >= 503) {
                reject(new Error('サーバーが停止中です\n（エラーコード: 503）'));
            };
            if (res.statusCode >= 500) {
                reject(new Error('サーバーのエラーです\n（エラーコード: 505）'));
            };
            if (res.statusCode >= 429) {
                reject(new Error('レート制限中です\n（エラーコード: 429）'));
            };
            if (res.statusCode >= 424) {
                reject(new Error('ゲームのメンテナンス中です\n（エラーコード: 424）'));
            };
            if (res.statusCode >= 404) {
                reject(new Error('対象のプレイヤーが存在しません\n（エラーコード: 404）'));
            };
            if (res.statusCode >= 400) {
                reject(new Error('UIDが9桁ではありません\n（エラーコード: 400）'));
            };

            let chunks = [];  //チャンクレスポンスストック配列

            res.on('data', chunk => chunks.push(Buffer.from(chunk)));
            res.on('end', () => {  //チャンクレスポンスストリーム終了
                let buffer = Buffer.concat(chunks);
                console.log(buffer);
                resolve(JSON.parse(buffer));  // 戻り値
            });

        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData != null) {
            req.write(postData);
        }

        req.end();

    });
};