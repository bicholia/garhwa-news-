async function test() {
    const url = "https://image.pollinations.ai/prompt/Apple";
    const res = await fetch(url);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
}
test();
