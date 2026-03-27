async function testImage() {
    const prompt = encodeURIComponent("A news photograph of a modern city in Jharkhand");
    const url = `https://pollinations.ai/p/${prompt}?width=1024&height=1024&seed=42&model=flux`;
    console.log("Fetching URL:", url);
    try {
        const res = await fetch(url, {
            headers: {
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log("Result:", res.status, res.statusText);
        console.log("Content-Type:", res.headers.get('content-type'));
        if (res.ok) {
            const buffer = await res.arrayBuffer();
            console.log("Buffer size:", buffer.byteLength);
            if (buffer.byteLength > 0) {
                const arr = new Uint8Array(buffer.slice(0, 10));
                console.log("First 10 bytes:", arr);
            }
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}
testImage();
