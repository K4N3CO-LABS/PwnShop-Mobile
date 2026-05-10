const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    const fileUrl = 'file://' + path.resolve(__dirname, 'android_App_export/index.html');
    await page.goto(fileUrl);
    
    // Wait for the initialization storm to pass and form to submit
    await new Promise(r => setTimeout(r, 6000));
    
    await browser.close();
}

run();
