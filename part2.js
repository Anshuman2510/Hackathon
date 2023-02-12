let minimist=require("minimist");
let fs=require("fs");
//let args=minimist(process.argv);
let puppeteer = require('puppeteer');
async function launcher(){
    let browser = await puppeteer.launch({headless: false,
        args: [
            '--start-maximized'
        ],
        defaultViewport: null});
        
    let pages = await browser.pages();
    let page=pages[0]
    await page.goto("https://www.chartgo.com/index.jsp");
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click("span.button.fileinput-button>span"),
      ]);
    await fileChooser.accept(['D:/Visual studio/PepWeb/Hackathon/CoronaCases.xlsx']);
    await page.waitFor(3000)
    await page.click("div.submit_form>button.button.submitform")
    await page.waitFor(2000)
    await page.waitForSelector("a[href='downloadImage.do']")
    await page.click("a[href='downloadImage.do']")
    
    
    }
    launcher();