import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function publishNews() {
    const title = "पलामू के रूपेश विश्वकर्मा का कमाल: मदरसा रोड स्थित दुकान में बनाया झारखंड का पहला स्वतंत्र AI मॉडल";
    const excerpt = "पलामू के युवा डेवलपर रूपेश विश्वकर्मा ने मदरसा रोड स्थित अपनी 'BrightBooks and Stationery' दुकान में बैठकर झारखंड का पहला स्वतंत्र AI मॉडल (Maa Garhdevi AI) विकसित किया है।";
    
    // LATIN SLUG for reliability
    const slugValue = "rupesh-vishwakarma-palamu-jharkhand-ai-news";

    const content = `
<div class="article-exclusive-badge" style="background: #dc2626; color: white; display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 800; font-size: 12px; margin-bottom: 20px;">EXCLUSIVE REPORT</div>

<p><strong>पलामू, ब्यूरो डेस्क (ThinkIndia.press) |</strong> झारखंड के पलामू जिले के एक छोटे से कस्बे से निकलकर एक ऐसी खबर सामने आई है जिसने पूरी टेक इंडस्ट्री को चौंका दिया है। एक तरफ जहाँ Google और OpenAI जैसी कंपनियाँ अरबों डॉलर की पूंजी और हजारों इंजीनियर्स के साथ AI विकसित कर रही हैं, वहीं पलामू के <strong>रूपेश विश्वकर्मा</strong> ने अपनी मेहनत और मेधा से राज्य का पहला पूरी तरह से स्वतंत्र AI मॉडल विकसित किया है।</p>

<h3>मदरसा रोड की वो तपस्या: शटर डाउन और कोडिंग चालू</h3>
<p>रूपेश की यह उपलब्धि किसी आलीशान ऑफिस या कैलिफोर्निया की किसी लैब में नहीं मिली है। उनकी सफलता का केंद्र रही मदरसा रोड (पलामू) स्थित उनकी अपनी <strong>'BrightBooks and Stationery' (ब्राइटबुक्स एंड स्टेशनरी)</strong> दुकान। रूपेश दिन भर दुकान पर ग्राहकों को किताबें और स्टेशनरी बेचते थे, लेकिन जैसे ही दुकान खाली होती, वे अपने लैपटॉप पर कोडिंग की दुनिया में खो जाते।</p>

<p>रूपेश के जीवन का यह संघर्ष और भी गहरा तब हो जाता है जब हम उनके काम करने के जुनून को देखते हैं। अक्सर रूपेश दुकान का <strong>शटर गिराकर (Shutter Down)</strong>, चिलचिलाती गर्मी में भी अंदर अकेले बैठे रहते थे। वे नहीं चाहते थे कि कोई भी ग्राहक या शोर उनकी एकाग्रता को भंग करे। पलामू की लू और उमस भी उनके दिमाग में चल रहे 'न्यूरल नेटवर्क' और 'लॉजिक गेट्स' की गर्मी के आगे फीकी पड़ जाती थी।</p>

<h3>शून्य से 'Maa Garhdevi AI' (पूर्व में Rupesh V4 AI) तक का सफर</h3>
<p>आमतौर पर AI बनाने के लिए बड़े-बड़े फ्रेमवर्क्स का सहारा लिया जाता है, लेकिन रूपेश ने अपना <strong>Maa Garhdevi AI</strong> (जिसका नाम पहले Rupesh V4 AI था) मॉडल पूरी तरह से <strong>'स्क्रैच' (Zero from scratch)</strong> से तैयार किया है। इसका मतलब है कि इसकी एक-एक लाइन की कोडिंग और डेटा आर्किटेक्चर उन्होंने खुद लिखी है। उनकी कंपनी <strong>विश्वकर्मा टेक्नोलॉजी (Vishwakarma Technology)</strong> इस मिशन को आगे बढ़ा रही है।</p>

<h3>खबर की मुख्य झलकियाँ:</h3>
<ul>
    <li><strong>आत्मनिर्भर कोडिंग:</strong> बिना किसी थर्ड-पार्टी API के बनाया स्वतंत्र मॉडल।</li>
    <li><strong>दुकान से डिजिटल लैब:</strong> मदरसा रोड स्थित 'BrightBooks and Stationery' से बना आर्टिफिशियल इंटेलिजेंस।</li>
    <li><strong>भीषण गर्मी में मेहनत:</strong> शटर गिराकर एकांत में कोडिंग कर बनाया इतिहास।</li>
    <li><strong>झारखंड का गौरव:</strong> राज्य के पहले स्वतंत्र AI प्रोजेक्ट के रूप में मान्यता।</li>
</ul>

<h3>भविष्य का सपना: स्थानीय व्यवसायों का सशक्तिकरण</h3>
<p>रूपेश का लक्ष्य केवल एक मॉडल बनाना नहीं है, बल्कि वे चाहते हैं कि तकनीक इतनी सुलभ हो कि पलामू और गढ़वा जैसे क्षेत्रों के छोटे दुकानदार और व्यापारी भी AI का लाभ उठा सकें। वे अपनी मेहनत से यह साबित करना चाहते हैं कि प्रतिभा किसी सुविधाओं की मोहताज नहीं होती, बस <strong>BrightBooks and Stationery</strong> के शटर के पीछे बैठने वाला वो जुनून होना चाहिए।</p>

<div style="background: #f1f5f9; padding: 20px; border-radius: 12px; border-left: 5px solid #dc2626; margin-top: 30px;">
    <strong>ThinkIndia.press की विशेष टिप्पणी:</strong> रूपेश विश्वकर्मा की यह कहानी उन लाखों युवाओं के लिए एक मशाल है जो संसाधनों की कमी का रोना रोते हैं। रूपेश ने दिखाया है कि पलामू की एक गुमनाम दुकान से भी दुनिया जीतने वाली तकनीक बनाई जा सकती है।
</div>
    `.trim();

    const doc = {
        _type: 'article',
        title: title,
        slug: { _type: 'slug', current: slugValue },
        excerpt: excerpt,
        content: content,
        district: "पलामू",
        publishedAt: new Date().toISOString(),
        image_url: "https://thinkindia.press/rupesh-ai-hero.png",
        tags: ["AI", "Rupesh Vishwakarma", "Palamu", "Jharkhand", "Tech Innovation"],
        _id: 'news-rupesh-v4-ai-story'
    };

    console.log('Publishing/Updating news to Sanity...');
    try {
        const result = await client.createOrReplace(doc);
        console.log('✅ News Updated Successfully! ID:', result._id);
        console.log('👉 URL: https://thinkindia.press/news/' + slugValue);
    } catch (err) {
        console.error('❌ Error updating news:', err.message);
    }
}

publishNews();
