const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());


const nike = async (url, username, password, qty, autoClose) => {
    console.log(qty)
    const browser = await puppeteer.launch({
        headless: false, defaultViewport: null, args: ['--start-fullscreen',
            "--user-data-dir=./Google/Chrome/User Data/"
        ], ignoreDefaultArgs: ["--disable-extensions"]
    });
    let [page] = await browser.pages();
    if (!page) {
        page = await browser.newPage();
    }

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.bringToFront();

    //click on login link
    const loginLink = await page.waitForXPath('//html/body/div[2]/div/div/div[1]/div/header/div[1]/section/div/ul/li[1]/button');
    loginLink && await loginLink.click();

    //enter username
    const usernameInput =  await page.waitForSelector('input[name=emailAddress]');
    usernameInput && await usernameInput.type(username);

    // enter password
    const pwInput = await page.waitForSelector('input[name=password]');
    pwInput && await pwInput.type(password);

    // click login button
    const loginBtn = await page.waitForXPath('//html/body/div[4]/div/div[1]/div/div[6]/form/div[6]/input');
    await Promise.all([
        loginBtn.click(),
        // page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
    
    while(true) {
        try {
            await page.waitForTimeout(1000);
            const closeLoginMessageBtn = await page.waitForXPath('//html/body/div[4]/div/div[1]/div/div[3]/div/div[2]/input', { timeout: 1000});
            closeLoginMessageBtn && await closeLoginMessageBtn.click();

            // enter password
            const pwInput = await page.waitForSelector('input[name=password]');
            pwInput && await pwInput.type(password);

            // click login button
            const loginBtn = await page.waitForXPath('//html/body/div[4]/div/div[1]/div/div[6]/form/div[6]/input');
            await Promise.all([
                loginBtn.click(),
                // page.waitForNavigation({ waitUntil: 'networkidle2' })
            ]);
        } catch (err) {
            break;
        }
    }
  
    // select size
    const sizeBtn = await page.waitForXPath('//html/body/div[2]/div/div/div[1]/div/div[1]/div[2]/div/section[1]/div[2]/aside/div/div[2]/div/div[2]/ul/li[1]/button');
    sizeBtn && await sizeBtn.click();

    // add to card
    await page.waitForTimeout(1000);
    const cardAddCardBtn = await page.waitForXPath('//html/body/div[2]/div/div/div[1]/div/div[1]/div[2]/div/section[1]/div[2]/aside/div/div[2]/div/div[2]/div/button');
    cardAddCardBtn && cardAddCardBtn.click();
    
    if (autoClose) {
        await page.close();
    }
}

module.exports = nike;