import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
})

const imagePath = 'C:\\Users\\LAPPY PLUS\\.gemini\\antigravity\\brain\\d9423ee2-632b-4fe3-830e-4a4d3b6b05e9\\investigative_school_scene_1775402296655.png'
const reportTitle = "एक्सक्लूसिव: गढ़वा के Bright Future School में छात्रों की सुरक्षा और नियमों के साथ खिलवाड़? ग्राउंड रिपोर्ट"
const reportExcerpt = "हमारी टीम की 3 महीने की जांच में सामने आया स्कूल के भीतर का खौफ। गार्ड राज कुमार पाण्डेय द्वारा बच्चों का शोषण और अवैध बुक्स बिक्री का मामला।"

// The content drafted by the AI
const reportContentRaw = `शिक्षा के मंदिर कहे जाने वाले स्कूलों में जब बच्चों की सुरक्षा और उनके सम्मान के साथ खिलवाड़ होने लगे, तो यह समाज और प्रशासन के लिए गहरी चिंता का विषय बन जाता है। ‘एनआर डेली न्यूज’ (NR Daily News) की तीन महीने की लंबी और गोपनीय जांच में गढ़वा के मदरसा रोड स्थित ब्राइट फ्यूचर स्कूल (Bright Future School) का एक ऐसा चेहरा सामने आया है, जो न केवल विचलित करने वाला है, बल्कि स्कूल प्रबंधन की कार्यशैली पर भी गंभीर सवाल खड़े करता है।

तीन महीने की गोपनीय जांच: डराने वाली सच्चाई
हमारी टीम ने पिछले तीन महीनों से इस स्कूल की गतिविधियों और यहां कार्यरत एक गार्ड, राज कुमार पाण्डेय, के व्यवहार पर नजर रखी। इस दौरान जो तथ्य सामने आए, वे किसी भी अभिभावक की नींद उड़ाने के लिए काफी हैं। जांच में पाया गया कि सुरक्षा के लिए तैनात यह गार्ड बच्चों के साथ न केवल दुर्व्यवहार करता है, बल्कि उनके मानसिक और शारीरिक स्वास्थ्य को भी गंभीर नुकसान पहुंचा रहा है।

जातिसूचक शब्द और मनोवैज्ञानिक प्रताड़ना
किसी भी शैक्षणिक संस्थान में भेदभाव का कोई स्थान नहीं होना चाहिए, लेकिन ब्राइट फ्यूचर स्कूल का नजारा कुछ अलग ही है। गार्ड राज कुमार पाण्डेय द्वारा बच्चों के लिए जातिसूचक अपशब्दों का इस्तेमाल करना एक आम बात हो गई है। हमारी टीम ने रिकॉर्ड किया कि बच्चों को ‘ये मेहता…’ जैसे संकुचित और अपमानजनक शब्दों से संबोधित किया जाता है। ऐसे शब्दों का प्रयोग न केवल अवैध है, बल्कि बच्चों के कोमल मन पर हीन भावना का गहरा घाव छोड़ता है।

शारीरिक हिंसा का खौफ: ‘देह फाड़ देंगे’
स्कूलों में शारीरिक दंड (Physical Punishment) पूरी तरह से प्रतिबंधित है, लेकिन यहां नियमों की धज्जियाँ उड़ाई जा रही हैं। गार्ड द्वारा बच्चों को दी जाने वाली धमकियां रोंगटे खड़े कर देने वाली हैं। ‘मार के चमड़ी उखाड़ देंगे’, ‘मार के बामे-बाम कर देंगे’ और ‘मारेंगे तो देह फट जाएगा’ जैसी धमकियां बच्चों के लिए खौफ का सबब बन गई हैं। इतना ही नहीं, जहां स्कूल परिसर में डंडा पूरी तरह बंद होना चाहिए, वहां यह गार्ड खुलेआम बांस की छड़ी से बच्चों की पिटाई करता है।

नशे की हालत में ड्यूटी और गंभीर लापरवाही
जांच के दौरान एक और बेहद आपत्तिजनक बात सामने आई। राज कुमार पाण्डेय को ड्यूटी के दौरान कम से कम दो मौकों पर शराब के नशे में पाया गया। बच्चों की सुरक्षा की जिम्मेदारी जिस व्यक्ति पर है, अगर वही नशे की हालत में स्कूल परिसर में घूम रहा हो, तो बच्चों की सुरक्षा का भगवान ही मालिक है।

सरकारी आदेशों की अवहेलना: अवैध किताबों की बिक्री
सिर्फ सुरक्षा ही नहीं, बल्कि व्यावसायिक नैतिकता के मामले में भी स्कूल का रिकॉर्ड दागदार नजर आता है। गढ़वा जिले के उपायुक्त (DC) के स्पष्ट आदेशों के बावजूद, स्कूल परिसर के भीतर ही किताबों की बिक्री जारी है। 31 मार्च को हमारी टीम ने साक्ष्यों के साथ देखा कि डीसी के सख्त निर्देशों को ताक पर रखकर धड़ल्ले से बुक्स सेल की जा रही हैं। स्थानीय नियमों के अनुसार, स्कूल परिसर में ऐसी व्यापारिक गतिविधियां पूरी तरह गैर-कानूनी हैं।

प्रबंधन की चुप्पी और जवाबदेही
इन सभी शिकायतों और गंभीर आरोपों के बीच स्कूल की वाइस प्रिंसिपल, सुनीता पटेल, और समग्र प्रबंधन की चुप्पी कई सवाल पैदा करती है। क्या प्रबंधन इन गतिविधियों से अनजान है, या जानबूझकर आंखें मूंदे बैठा है? अभिभावकों ने अपनी मेहनत की कमाई और बच्चों का भविष्य इस उम्मीद में स्कूल को सौंपा है कि वहां उन्हें सुरक्षित और सम्मानजनक माहौल मिलेगा, लेकिन जमीनी हकीकत इसके उलट है।

निष्कर्ष और आगे की कार्रवाई
यह रिपोर्ट महज एक खबर नहीं, बल्कि प्रशासन के लिए एक अलार्म है। बच्चों के साथ होने वाला यह अमानवीय व्यवहार और नियमों का उल्लंघन किसी भी सूरत में स्वीकार्य नहीं हो सकता। ‘एनआर डेली न्यूज’ इस मामले को लेकर शिक्षा विभाग और जिला प्रशासन के संपर्क में है और जल्द ही इस पर सख्त कानूनी कार्रवाई की उम्मीद जताई जा रही है।`

async function publishReport() {
  try {
    console.log('🚀 Starting Publication...')

    // 1. Upload Image
    console.log('📸 Uploading image asset...')
    const imageData = fs.readFileSync(imagePath)
    const asset = await client.assets.upload('image', imageData, {
      filename: `investigative-report-${Date.now()}.png`
    })
    console.log('✅ Image uploaded:', asset._id)

    // 2. Find Category (Search for 'अपराध' or first category)
    const categories = await client.fetch('*[_type == "category"]')
    const crimeCategory = categories.find(c => c.title.includes('अपराध') || c.title.toLowerCase().includes('crime')) || categories[0]
    
    // 3. Create Document
    const slug = `exclusive-bright-future-school-investigation-${Date.now()}`
    const doc = {
      _type: 'article',
      title: reportTitle,
      slug: { _type: 'slug', current: slug },
      excerpt: reportExcerpt,
      body: reportContentRaw.split('\n\n').map(para => ({
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', text: para.trim(), marks: [] }]
      })),
      featureImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      },
      category: { _type: 'reference', _ref: crimeCategory._id },
      district: 'garhwa',
      publishedAt: new Date().toISOString(),
      featured: true,
      isBreaking: true
    }

    const result = await client.create(doc)
    console.log('✅ Sanity Document Live:', result._id)
    console.log('🔗 URL:', `http://localhost:3000/article/${slug}`)

  } catch (error) {
    console.error('❌ Publication Failed:', error)
  }
}

publishReport()
