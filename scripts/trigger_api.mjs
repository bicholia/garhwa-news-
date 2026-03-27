
// Using global fetch


async function trigger() {
    console.log('Triggering AI News Agent (30 articles)...');
    try {
        const response = await fetch('http://127.0.0.1:3000/api/ai-news-agent?limit=30', {
            headers: {
                'Authorization': 'Bearer nr_daily_news_secret_2026'
            }
        });
        const data = await response.json();
        console.log('Success:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

trigger();
