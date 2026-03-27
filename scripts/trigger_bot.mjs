import fetch from 'node-fetch';

const CRON_SECRET = 'nr_daily_news_secret_2026';
const API_URL = 'https://nrdailynews.vercel.app/api/ai-news-agent';

async function triggerBot() {
  console.log('🚀 NR Daily News AutoBot को स्टार्ट कर रहे हैं...');
  console.log('📡 सर्वर से कनेक्ट हो रहे हैं...');

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ एरर: ${response.status} - ${errorText}`);
      return;
    }

    const data = await response.json();
    console.log('\n✅ AutoBot ने काम पूरा कर लिया है!');
    console.log(`📝 कुल ख़बरें प्रोसेस हुईं: ${data.processed || 0}`);
    
    if (data.results && data.results.length > 0) {
      console.log('\n--- नई प्रकाशित ख़बरें ---');
      data.results.forEach((news, i) => {
        console.log(`${i + 1}. [${news.category}] ${news.title}`);
      });
    } else {
      console.log('ℹ️ कोई नई खबर नहीं मिली या सभी पहले से मौजूद थीं।');
    }

  } catch (error) {
    console.error('❌ कनेक्शन फेल हो गया:', error.message);
  }
}

triggerBot();
