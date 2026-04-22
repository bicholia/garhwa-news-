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
    const title = "झारखंड के 'टेक-प्रतिभा' का कमाल: किताब दुकान के छोटे से कोने में पलामू के रूपेश ने रचा 'AI' का बड़ा इतिहास";
    const excerpt = "पलामू के युवा डेवलपर रूपेश विश्वकर्मा ने अपनी किताब दुकान में बैठकर, भीषण गर्मी में शटर गिराकर झारखंड का पहला स्वतंत्र AI मॉडल (Maa Garhdevi AI, पूर्व में Rupesh V4 AI) विकसित किया है।";
    
    // Simple slug generator
    const slugValue = title
        .toLowerCase()
        .replace(/[^\u0100-\uFFFF\w\s-]/g, '') // Remove special chars but keep unicode for Hindi if needed (though usually slugs are Latin)
        .replace(/\s+/g, '-') 
        .substring(0, 50);

    const content = `
पलामू, ब्यूरो डेस्क (ThinkIndia.press) | तकनीक की इस दौड़ में जहाँ दुनिया की बड़ी-बड़ी टेक कंपनियाँ अरबों डॉलर की फंडिंग के दम पर आर्टिफिशियल इंटेलिजेंस (AI) विकसित कर रही हैं, वहीं झारखंड के एक छोटे से जिले पलामू के युवा डेवलपर रूपेश विश्वकर्मा ने अपनी प्रतिभा से सबको चौंका दिया है। रूपेश ने दावा किया है कि उन्होंने राज्य का पहला पूरी तरह से स्वतंत्र AI मॉडल विकसित किया है, जो किसी बाहरी मदद के बिना 'शून्य' से तैयार किया गया है।

### ग्राहकों के बीच 'कोडिंग' और शटर के पीछे का 'जुनून'
रूपेश की यह उपलब्धि किसी बड़े ऑफिस या एयर-कंडीशंड रूम में नहीं, बल्कि उनकी एक छोटी सी किताब दुकान में जन्म ली है। दिन भर दुकान संभालते हुए, जब भी ग्राहकों की भीड़ कम होती, रूपेश अपनी कोडिंग और AI मॉडल्स में डूब जाते थे। 

उनके पड़ोसियों और परिचितों का कहना है कि अक्सर रूपेश काम के प्रति इतने समर्पित होते थे कि वे दुकान का शटर गिराकर भीषण गर्मी में भी अंदर घंटों बैठे रहते थे, ताकि बिना किसी रुकावट के अपने जटिल 'AI लॉजिक' पर काम कर सकें। पलामू की चिलचिलाती गर्मी भी उनके इरादों को नहीं डिगा सकी।

### आत्मनिर्भर तकनीक: 'स्क्रैच से शिखर तक'
आमतौर पर AI बनाने के लिए Google, Microsoft या OpenAI जैसे दिग्गजों की API का सहारा लिया जाता है, लेकिन रूपेश की उपलब्धि इसलिए खास है क्योंकि उन्होंने अपना मॉडल "स्क्रैच से" (Zero-Level Coding) तैयार किया है। उनकी कंपनी, विश्वकर्मा टेक्नोलॉजी (Vishwakarma Technology), इस क्रांतिकारी प्रोजेक्ट की धुरी है।

### प्रोजेक्ट "Maa Garhdevi AI" (पूर्व में Rupesh V4 AI) की मुख्य विशेषताएं:
- पूरी तरह स्वतंत्र लॉजिक: यह AI मॉडल किसी तीसरे पक्ष (Third-party) की कोडिंग पर निर्भर नहीं है। इसका पूरा आर्किटेक्चर रूपेश ने खुद डिजाइन किया है।
- झारखंड का गौरव: इसे झारखंड के डिजिटल इतिहास में एक मील का पत्थर माना जा रहा है, क्योंकि यह राज्य का पहला 'इन-हाउस' AI प्रोजेक्ट है।
- व्यवसायों के लिए वरदान: रूपेश का लक्ष्य इस तकनीक को इतना सरल बनाना है कि छोटे स्थानीय व्यवसायों को भी आधुनिक डेटा एनालिटिक्स और डिजिटल समाधानों का लाभ मिल सके।
    `.trim();

    const doc = {
        _type: 'article',
        title: title,
        slug: { _type: 'slug', current: `${slugValue}-${Date.now()}` },
        excerpt: excerpt,
        content: content,
        district: "पलामू",
        category: { _type: 'reference', _ref: 'cat-technology' }, // Assuming this exists or will fall back to general
        author: { _type: 'reference', _ref: 'author-admin' },
        publishedAt: new Date().toISOString(),
        image_url: "https://thinkindia.press/rupesh-ai-hero.png", // Placeholder for visual, user can update in Sanity
        tags: ["AI", "Rupesh Vishwakarma", "Palamu News", "Jharkhand Tech", "Inspiration"]
    };

    console.log('Publishing news to Sanity...');
    try {
        const result = await client.create(doc);
        console.log('✅ News Published Successfully! ID:', result._id);
    } catch (err) {
        console.error('❌ Error publishing news:', err.message);
        console.log('Attempting without references...');
        // Try fallback if references fail
        try {
            delete doc.category;
            delete doc.author;
            const result2 = await client.create(doc);
            console.log('✅ News Published (Fallback) Successfully! ID:', result2._id);
        } catch (err2) {
            console.error('❌ Fallback also failed:', err2.message);
        }
    }
}

publishNews();
