const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";

async function testOptionsDetailed() {
    try {
        const res = await fetch(url, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'null',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'content-type'
            }
        });
        console.log("Allow-Origin:", res.headers.get('Access-Control-Allow-Origin'));
        console.log("Allow-Headers:", res.headers.get('Access-Control-Allow-Headers'));
        console.log("Allow-Methods:", res.headers.get('Access-Control-Allow-Methods'));
    } catch(e) {
        console.error("Error:", e);
    }
}
testOptionsDetailed();
