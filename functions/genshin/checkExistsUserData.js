module.exports = function checkExistsUserData(path, id) {

    let ck = false;

    if (fs.existsSync(path)) {

        const json = JSON.parse(fs.readFileSync(path, 'utf8'));

        json.UserData.forEach(data => {

            if (data.id === id) {

                console.log(`Check! ${data.id} === ${id}`);
                ck = true;

            };

        });

    };

    return ck;

};