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

// Load final V5 content from the markdown file
const reportContentRaw = fs.readFileSync(path.join(__dirname, '../content/investigative_report_v5.md'), 'utf8')

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
    const crimeCategory = categories.find(c => 
      (c.title && (c.title.includes('अपराध') || c.title.toLowerCase().includes('crime'))) ||
      (c.name && (c.name.includes('अपराध') || c.name.toLowerCase().includes('crime')))
    ) || categories[0]
    
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
