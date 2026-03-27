async function test() {
    console.log("Testing Airforce API...");
    const url = "https://api.airforce/v1/image/generations";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: "A professional news photograph of a rally in Jharkhand",
                model: "flux"
            })
        });
        console.log("Status:", res.status);
        if (res.ok) {
            const data = await res.json();
            console.log("Data:", JSON.stringify(data, null, 2));
        } else {
            const err = await res.text();
            console.log("Error body:", err);
        }
    } catch (e) {
        console.log("Fetch Error:", e.message);
    }
}
test();
