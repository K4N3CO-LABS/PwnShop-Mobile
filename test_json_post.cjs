const puppeteer = require('puppeteer');
const path = require('path');
async function run() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    const fileUrl = 'file://' + path.resolve(__dirname, 'android_export/index.html');
    await page.goto(fileUrl);
    await new Promise(r => setTimeout(r, 6000));
    await page.evaluate(async () => {
        const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: "Hello from application/json fetch!" })
            });
            console.log("JSON FETCH SUCCESS!");
        } catch(e) { console.log("JSON FETCH FAILED:", e.message); }
    });
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
}
run();
