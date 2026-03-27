async function testImage() {
    console.log("Testing gen.pollinations.ai/p/Apple...");
    const url = `https://gen.pollinations.ai/p/Apple?width=1000&height=500`;
    try {
        const res = await fetch(url);
        console.log("Result:", res.status, res.statusText);
        console.log("Content-Type:", res.headers.get('content-type'));
        const buffer = await res.arrayBuffer();
        console.log("Buffer size:", buffer.byteLength);
        if (buffer.byteLength > 0) {
            const arr = new Uint8Array(buffer.slice(0, 10));
            console.log("First 10 bytes:", arr);
        }
    } catch (e) {
        console.log("Error:", e.message);
    }
}
testImage();
