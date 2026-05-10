const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'] 
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    const fileUrl = 'file://' + path.resolve(__dirname, 'android_App_export/index.html');
    await page.goto(fileUrl);
    
    await new Promise(r => setTimeout(r, 6000));
    
    await page.evaluate(async () => {
        const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";
        const fd = new FormData();
        fd.append('payload_json', JSON.stringify({ content: "Hello from sendBeacon from locally executed file!" }));
        const success = navigator.sendBeacon(url, fd);
        console.log("sendBeacon success:", success);
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
}

run();
