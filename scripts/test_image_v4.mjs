async function testImage() {
    console.log("Testing pollinations.ai/p/Apple (no params)...");
    const url = `https://pollinations.ai/p/Apple`;
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
