async function testImage() {
    console.log("Testing with User-Agent...");
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent("Apple")}?width=1200&height=630`;
    console.log("Fetching URL:", url);
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log("Result:", res.status, res.statusText);
        const ct = res.headers.get('content-type');
        console.log("Content-Type:", ct);
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}
testImage();
