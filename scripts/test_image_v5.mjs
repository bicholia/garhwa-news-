async function testImage() {
    const prompt = "Realistic news photo, high-quality photojournalism: road construction, 16:9 aspect ratio";
    const seed = 12345;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=450&nologo=true&seed=${seed}`;
    console.log("Testing Pollinations Image URL:", url);
    try {
        const res = await fetch(url);
        console.log("Result:", res.status, res.statusText);
        console.log("Content-Type:", res.headers.get('content-type'));
        const buffer = await res.arrayBuffer();
        console.log("Buffer size:", buffer.byteLength);
    } catch (e) {
        console.log("Error:", e.message);
    }
}
testImage();
