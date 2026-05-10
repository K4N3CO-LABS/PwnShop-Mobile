const url = "https://discord.com/api/webhooks/1503094377495531666/c6zgHVRHe5e4jzxBdCuX6R5oJbut-bu61XAVScb2YbFdMsQgD6wiSM9yUzaoSNKm6sQe";

async function test() {
    try {
        const fd = new FormData();
        fd.append('payload_json', JSON.stringify({ content: "Test from node!" }));
        const res = await fetch(url, { method: 'POST', body: fd });
        console.log("FormData Response:", res.status, res.statusText);
    } catch(e) {
        console.error("FormData Error:", e);
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: "Test JSON from node!" })
        });
        console.log("JSON Response:", res.status, res.statusText);
    } catch(e) {
        console.error("JSON Error:", e);
    }
}
test();
