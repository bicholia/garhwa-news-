async function testImage() {
    console.log("Testing pollinations.ai/p/Apple...");
    const url = `https://pollinations.ai/p/Apple?width=1024&height=1024&seed=22421`;
    console.log("Fetching URL:", url);
    try {
        const res = await fetch(url);
        console.log("Result:", res.status, res.statusText);
        console.log("Content-Type:", res.headers.get('content-type'));
        // Try to see if we can get a buffer
        const buffer = await res.arrayBuffer();
        console.log("Buffer size:", buffer.byteLength);
        if (buffer.byteLength > 0) {
            const arr = new Uint8Array(buffer.slice(0, 10));
            console.log("First 10 bytes:", arr);
            // Check for PNG (137 80 78 71) or JPEG (255 216)
        }
    } catch (e) {
        console.error("Fetch Error:", e.message);
    }
}
testImage();
