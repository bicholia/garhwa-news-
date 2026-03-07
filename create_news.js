const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
});

async function run() {
    try {
        // 1. Upload image
        console.log('Uploading image to Sanity...');
        const imagePath = 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\18563275-77e4-46a1-9367-46d6fcb91885\\holi_girl_1772648433361.png';
        const imageBuffer = fs.readFileSync(imagePath);

        const imageAsset = await client.assets.upload('image', imageBuffer, {
            filename: 'holi_girl.png'
        });
        console.log('Image uploaded. Asset ID:', imageAsset._id);

        // 2. Prepare News 1
        const news1 = {
            _type: 'article',
            title: 'प्रीति विश्वकर्मा ने बताया क्यों मनाया जाता है होली, और क्या है इसका महत्व',
            slug: {
                _type: 'slug',
                current: 'priti-vishwakarma-holi-mahatva-' + Date.now()
            },
            excerpt: 'प्रीति विश्वकर्मा ने होली मनाने के पीछे के पौराणिक और सामाजिक कारणों पर प्रकाश डाला।',
            featureImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                },
                alt: 'Holi celebration'
            },
            body: [
                {
                    _type: 'block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            marks: [],
                            text: 'गढ़वा: होली का त्योहार क्यों मनाया जाता है और इसके पीछे क्या कथाएँ हैं, इस पर प्रीति विश्वकर्मा ने विशेष जानकारी दी। उन्होंने बताया कि होली न केवल रंगों का त्योहार है, बल्कि यह बुराई पर अच्छाई की जीत का भी प्रतीक है। प्रह्लाद और होलिका की कथा का उल्लेख करते हुए उन्होंने कहा कि यह दिन हमें सत्य और भक्ति के मार्ग पर चलने की प्रेरणा देता है।'
                        }
                    ]
                },
                {
                    _type: 'block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            marks: [],
                            text: 'उन्होंने यह भी कहा कि आज के दिन लोग अपने गिले-शिकवे मिटाकर एक-दूसरे को गले लगाते हैं। यह सामाजिक समरसता और भाईचारे का भी सबसे बड़ा उदाहरण है। उन्होंने सभी से प्राकृतिक रंगों से सुरक्षित होली खेलने की अपील की है।'
                        }
                    ]
                }
            ],
            category: {
                _type: 'reference',
                _ref: 'category-social-events' // Fallback category (assuming social events or religion)
            },
            district: 'garhwa',
            publishedAt: new Date().toISOString()
        };

        // 3. Prepare News 2
        const news2 = {
            _type: 'article',
            title: 'विश्वकर्मा परिवार की ओर से सभी देशवासियों को होली की हार्दिक शुभकामनाएं',
            slug: {
                _type: 'slug',
                current: 'vishwakarma-parivar-holi-wishes-' + Date.now()
            },
            excerpt: 'सीआरपीएफ अखिलेश विश्वकर्मा, सविन्द्र, शुभम, सृष्टि और सनी विश्वकर्मा ने दी होली की बधाई।',
            featureImage: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                },
                alt: 'Holi greetings'
            },
            body: [
                {
                    _type: 'block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            marks: [],
                            text: 'गढ़वा: रंगों के पावन पर्व होली के शुभ अवसर पर विश्वकर्मा परिवार की ओर से देशवासियों और क्षेत्रवासियों को हार्दिक शुभकामनाएं दी गई हैं।'
                        }
                    ]
                },
                {
                    _type: 'block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            marks: [],
                            text: 'सीआरपीएफ (CRP) अखिलेश विश्वकर्मा, सविन्द्र विश्वकर्मा, शुभम विश्वकर्मा, सृष्टि विश्वकर्मा और सनी विश्वकर्मा ने संयुक्त रूप से सभी को होली की बधाई देते हुए कामना की है कि यह रंगों का त्योहार सभी के जीवन में सुख, शांति और समृद्धि लेकर आए।'
                        }
                    ]
                },
                {
                    _type: 'block',
                    style: 'normal',
                    children: [
                        {
                            _type: 'span',
                            marks: [],
                            text: 'उन्होंने आपसी प्रेम और सौहार्द के साथ इस त्योहार को सुरक्षित रूप से मनाने का संदेश दिया है।'
                        }
                    ]
                }
            ],
            category: {
                _type: 'reference',
                _ref: 'category-social-events'
            },
            district: 'garhwa',
            publishedAt: new Date().toISOString()
        };

        // 4. Create Documents
        console.log('Creating Article 1...');
        const result1 = await client.create(news1);
        console.log('Article 1 created:', result1._id);

        console.log('Creating Article 2...');
        const result2 = await client.create(news2);
        console.log('Article 2 created:', result2._id);

        console.log('✅ Both news items published successfully!');
    } catch (err) {
        console.error('Error:', err);
    }
}

run();
