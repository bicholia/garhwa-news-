async function test() {
    console.log("Testing Hercai API...");
    const prompt = encodeURIComponent("A professional news photo of a court building in India");
    const url = `https://hercai.onrender.com/v3/text2image?prompt=${prompt}`;
    try {
        const res = await fetch(url);
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
