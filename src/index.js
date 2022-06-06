const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const fs = require('fs');
const { normalizedItemData, run } = require('./helper.js');

Handlebars.registerHelper('offset', (index) => {
    return index + 1;
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'x-requested-with, authorization, Content-Type, Authorization, X-XSRF-TOKEN');
    res.setHeader('Access-Control-Allow-Credentials', false);
    next();
});

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(urlencodedParser);

app.get('/', (req, res) => {
    let sites = [];
    try {
        sites = require('./config/sites.json');
    } catch (err) {
        console.log(err)
    }
    res.render('home', { data: sites });
});

app.post('/save', async (req, res) => {
    //normalized data
    const data = [];
    if (Array.isArray(req.body.siteName)) {
        req.body.siteName.forEach((name, index) => {
            if (name && name.trim().length > 0) {
                normalizedItemData(req, name, index, data)
            }

        });
    } else {
        if (req.body.siteName && req.body.siteName.trim().length > 0) {
            normalizedItemData(req, req.body.siteName, undefined, data)
        }

    }
    console.log('data ', data)
    try {
        fs.writeFileSync('src/config/sites.json', JSON.stringify(data));
        res.render('save_success');
    } catch (err) {
        res.end(`An error occurred: ${err}`);
    }
});

app.post('/run', async (req, res) => {
    //normalized data
    const data = [];
    if (Array.isArray(req.body.siteName)) {
        req.body.siteName.forEach((name, index) => {
            if (name && name.trim().length > 0) {
                normalizedItemData(req, name, index, data)
            }
        });
    } else {
        if (req.body.siteName && req.body.siteName.trim().length > 0) {
            normalizedItemData(req, req.body.siteName, undefined, data)
        }
    }
   
    try {
        await run(data);
        res.render('run_success');
    } catch (err) {
        res.end(`An error occurred: ${err}`);
    }
});



const server = app.listen(8081, async () => {
    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})