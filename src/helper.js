const normalizedItemData = (req, siteName, index, destData) => {
    const item = {};
    console.log(req.body.autoClose);
    item.use = Boolean((Array.isArray(req.body.use) ? req.body.use[index] : req.body.use) || false);
    item.autoClose = Boolean((Array.isArray(req.body.autoClose) ? req.body.autoClose[index] : req.body.autoClose) || false);
    item.qty = Number((Array.isArray(req.body.qty) ? req.body.qty[index] : req.body.qty) || 1);
    item.url = Array.isArray(req.body.siteUrl) ? req.body.siteUrl[index] : req.body.siteUrl;
    item.name = siteName;

    const usernameField = `${siteName}--username`;
    const passwordField = `${siteName}--password`;
    const accounts = [];
    if (Array.isArray(req.body[usernameField])) {
        const _accounts = req.body[usernameField].map((username, index) => {
            return {
                username,
                password: req.body[passwordField][index],
            }
        });
        accounts.push(..._accounts)
    } else {
        accounts.push({
            username: req.body[usernameField],
            password: req.body[passwordField]
        })
    }
    item.accounts = accounts;
    destData.push(item);
}

const run = async (data) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i].use && data[i].name && data[i].name.trim().length > 0 && data[i].url && data[i].url.trim().length > 0) {
            try {
                for (let j = 0; j < data[i].accounts.length; j++) {
                    console.log('data[i].autoClose ', data[i].autoClose);
                    await (require(`./sites/${data[i].name}`)(data[i].url, data[i].accounts[j].username, data[i].accounts[j].password, data[i].qty, data[i].autoClose));
                }
            } catch (err) {
                console.log(err)
            }

        }

    }
}

module.exports = {
    normalizedItemData,
    run
}