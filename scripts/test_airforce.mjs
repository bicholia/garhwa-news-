async function test() {
    console.log("Testing Airforce API...");
    // A known pattern for airforce free image API
    const url = "https://api.airforce/v1/image/generations";
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: "A professional cinematic news photograph of a rally in Jharkhand",
            model: "flux"
        })
    });
    console.log("Status:", res.status);
    try {
        const json = await res.json();
        console.log("Response:", JSON.stringify(json, null, 2));
    } catch (e) {
        console.log("Not JSON, body length:", (await res.text()).length);
    }
}
test();
