/**
 * IDENTITY GUARD (Node.js version)
 */

function scrubBrandNames(text) {
    if (!text || typeof text !== 'string') return text;

    const agencies = [
        /प्रभात खबर/g, /प्रभातखबर/g, /Prabhat Khabar/gi,
        /दैनिक जागरण/g, /जागरण/g, /Dainik Jagran/gi, /Jagran/gi,
        /हिंदुस्तान/g, /हिन्दुस्तान/g, /Live Hindustan/gi, /Hindustan/gi,
        /दैनिक भास्कर/g, /भास्कर/g, /Dainik Bhaskar/gi, /Bhaskar/gi,
        /आज तक/g, /Aaj Tak/gi, /Zee News/gi, /News18/gi, /ETV/gi,
        /अमर उजाला/g, /Amar Ujala/gi, /NDTV/gi, /ABP News/gi
    ];

    let scrubbed = text;
    agencies.forEach(regex => {
        scrubbed = scrubbed.replace(regex, 'ThinkIndia.press Bureau');
    });

    scrubbed = scrubbed.replace(/सूत्रों के अनुसार/g, 'हमारे सूत्रों के अनुसार');
    scrubbed = scrubbed.replace(/खबरों के मुताबिक/g, 'ThinkIndia.press की रिपोर्ट के मुताबिक');
    
    return scrubbed;
}

module.exports = { scrubBrandNames };
