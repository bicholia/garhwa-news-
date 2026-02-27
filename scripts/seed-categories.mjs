import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'cjfr2ckk',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    useCdn: false,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_TOKEN
})

// All categories - newspaper specific + popular content categories
const categories = [
    // === NEWSPAPER CATEGORIES ===
    { _id: 'category-top-story', name: 'टॉप स्टोरी', slug: 'top-story', desc: 'सबसे बड़ी खबर' },
    { _id: 'category-crime', name: 'अपराध समाचार', slug: 'crime', desc: 'अपराध, हत्या, लूट, कोर्ट' },
    { _id: 'category-administration', name: 'प्रशासनिक कार्रवाई', slug: 'administration', desc: 'DC, SP, BDO के आदेश' },
    { _id: 'category-city-facilities', name: 'शहर की सुविधाएं', slug: 'city-facilities', desc: 'बिजली, पानी, सड़क' },
    { _id: 'category-disaster-accident', name: 'आपदा / दुर्घटना', slug: 'disaster-accident', desc: 'आग, दुर्घटना, प्राकृतिक आपदा' },
    { _id: 'category-health-education', name: 'स्वास्थ्य और शिक्षा', slug: 'health-education', desc: 'अस्पताल, स्कूल, परीक्षा' },
    { _id: 'category-public-issues', name: 'जनसमस्या', slug: 'public-issues', desc: 'आम जनता की परेशानी' },
    { _id: 'category-rural-development', name: 'ग्रामीण विकास', slug: 'rural-development', desc: 'मनरेगा, पंचायत, ग्रामीण योजनाएं' },
    { _id: 'category-social-events', name: 'सामाजिक कार्यक्रम', slug: 'social-events', desc: 'शोक सभा, सामाजिक आयोजन' },

    // === POPULAR/CONTENT CATEGORIES ===
    { _id: 'category-politics', name: 'राजनीति', slug: 'politics', desc: 'राजनैतिक समाचार' },
    { _id: 'category-sports', name: 'खेल', slug: 'sports', desc: 'क्रिकेट, फुटबॉल, खेल समाचार' },
    { _id: 'category-entertainment', name: 'मनोरंजन', slug: 'entertainment', desc: 'बॉलीवुड, टीवी, सिनेमा' },
    { _id: 'category-business', name: 'व्यापार / बिज़नेस', slug: 'business', desc: 'व्यापार और आर्थिक समाचार' },
    { _id: 'category-finance', name: 'फाइनेंस', slug: 'finance', desc: 'शेयर बाज़ार, बैंकिंग, निवेश' },
    { _id: 'category-technology', name: 'टेक्नोलॉजी', slug: 'technology', desc: 'मोबाइल, इंटरनेट, गैजेट' },
    { _id: 'category-jobs', name: 'सरकारी नौकरी', slug: 'jobs', desc: 'सरकारी भर्ती, नौकरी समाचार' },
    { _id: 'category-lifestyle', name: 'लाइफस्टाइल', slug: 'lifestyle', desc: 'फैशन, ट्रेंड, जीवनशैली' },
    { _id: 'category-love-relationships', name: 'प्रेम / रिश्ते', slug: 'love-relationships', desc: 'रिश्ते, सामाजिक कहानियाँ' },
    { _id: 'category-astrology', name: 'राशिफल', slug: 'astrology', desc: 'दैनिक राशिफल' },
    { _id: 'category-religion', name: 'धर्म / अध्यात्म', slug: 'religion', desc: 'धर्म, पूजा, त्योहार' },
    { _id: 'category-national', name: 'राष्ट्रीय', slug: 'national', desc: 'भारत की बड़ी खबरें' },
    { _id: 'category-international', name: 'अंतर्राष्ट्रीय', slug: 'international', desc: 'दुनिया की खबरें' },
    { _id: 'category-auto', name: 'ऑटो', slug: 'auto', desc: 'कार, बाइक, वाहन' },
    { _id: 'category-agriculture', name: 'कृषि', slug: 'agriculture', desc: 'किसान, फसल, खेती' },
]

async function seedCategories() {
    console.log(`Seeding ${categories.length} categories...`)
    for (const cat of categories) {
        try {
            await client.createOrReplace({
                _id: cat._id,
                _type: 'category',
                name: cat.name,
                slug: { _type: 'slug', current: cat.slug },
                description: cat.desc
            })
            console.log(`✅ ${cat.name}`)
        } catch (error) {
            console.error(`❌ ${cat.name}:`, error.message)
        }
    }
    console.log(`\nDone! ${categories.length} categories seeded.`)
}

seedCategories()
