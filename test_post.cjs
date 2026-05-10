const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";

async function testPost() {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Origin': 'null',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: "Test JSON from Origin null!" })
        });
        console.log("POST Response:", res.status, res.statusText);
        console.log("Allow-Origin:", res.headers.get('Access-Control-Allow-Origin'));
    } catch(e) {
        console.error("Error:", e);
    }
}
testPost();
