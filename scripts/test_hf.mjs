async function test() {
    const url = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
    const prompt = "A photorealistic news image of the Jharkhand High Court building";
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt })
    });
    console.log("Status:", res.status);
    console.log("Content-Type:", res.headers.get('content-type'));
    const buffer = await res.arrayBuffer();
    console.log("Size:", buffer.byteLength);
}
test();
