const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
    const browser = await puppeteer.launch({ 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    const fileUrl = 'file://' + path.resolve(__dirname, 'android_export/index.html');
    await page.goto(fileUrl);
    
    // Wait for the initialization storm to pass
    await new Promise(r => setTimeout(r, 6000));

    // Wait and execute a simple fetch with FormData
    await page.evaluate(async () => {
        const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";
        const logStr = "Hello from nocors Puppeteer";
        const fd = new FormData();
        fd.append('payload_json', JSON.stringify({ content: logStr }));
        
        try {
            const res = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                body: fd
            });
            console.log("Status after timeout:", res.status, res.type);
        } catch(e) {
            console.log("Fetch failed:", e.message);
        }
    });
    
    await browser.close();
}

run();
