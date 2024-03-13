const puppeteer = require('puppeteer');

const fetch = require('node-fetch');

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

(async () => {
    
    const browser = await puppeteer.launch({"headless": false, "defaultViewport": false});
    
    const page = await browser.newPage();
  
    await page.goto('https://2captcha.com/demo/recaptcha-v2');

    // await page.goto('https://www.google.com/recaptcha/api2/demo');

    await delay(2000)

    const checkbox = await page.waitForSelector('iframe[title=reCAPTCHA]');
    
    await checkbox.click();

    await delay(3000)

    elementHandle2 = await page.waitForSelector("[title='recaptcha challenge expires in two minutes']")

    bframe = await elementHandle2.contentFrame()

    await bframe.waitForSelector("#recaptcha-audio-button")

    await bframe.click("#recaptcha-audio-button")

    await delay(3000)

    await bframe.waitForSelector(".rc-audiochallenge-tdownload-link")
    
    // Get URL of audio from the website
    const href = await bframe.$eval(".rc-audiochallenge-tdownload-link", (elm) => elm.href);

    // console.log(href)

    // Send request with Audio URL to Flask API to get text as response.
    const response = await fetch('http://localhost:5000',
                                {
                                    method: 'POST',
                                    body: JSON.stringify({ "url" : href }),
                                    headers: {
                                        'Content-type':
                                            'application/json; charset=UTF-8',
                                    },
                                })
    const result = await response.json()
    const text = result.message

    // console.log(text)

    textInput = await bframe.waitForSelector("#audio-response")

    await textInput.click()

    await bframe.type("#audio-response",text)

    await delay(3000);

    await bframe.click("#recaptcha-verify-button")

    await delay(3000);

    const submit = await page.waitForSelector('button[type=submit]');
    
    await submit.click();
    

    // await page.click("body > div.container > div.login.form > form > input.button")

    await delay(4000);

    await browser.close()
  })();
