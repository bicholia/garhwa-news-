export async function sendToTelegram(article: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHANNEL_ID

    if (!token || !chatId) {
        console.error('Telegram credentials missing')
        return
    }

    // Category identification for message header (Text-based symbols for a clean look)
    const categoryLabel: Record<string, string> = {
        'top-story': '[TOP STORY]',
        'crime': '[APRADH]',
        'administration': '[PRASHASAN]',
        'city-facilities': '[SAHRI SUVIDHA]',
        'disaster-accident': '[AAPDA]',
        'health-education': '[SWASTHYA]',
        'public-issues': '[JAN SAMASYA]',
        'rural-development': '[GRAMIN VIKAS]',
        'social-events': '[SAMAJIK]',
        'default': '[NEWS]'
    }

    const label = categoryLabel[article.category?.slug?.current] || '[NEWS]'

    // District hashtag
    const districtHashtag = article.district ? `#${article.district}` : '#झारखंड'

    const message = `
${label} *${article.title}*

${article.excerpt || ''}

पूरी खबर पढ़ें: ${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug.current}

${districtHashtag} #${article.category?.name || 'समाचार'} #गढ़वा #पलामू
  `

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            })
        })

        const data = await response.json()
        if (data.ok) {
            console.log('Telegram post successful:', article.title)
            return true
        } else {
            console.error('Telegram error:', data)
            return false
        }
    } catch (error) {
        console.error('Telegram send failed:', error)
        return false
    }
}

export async function getTelegramStats() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHANNEL_ID

    if (!token || !chatId) return { subscribers: 0, lastPost: 'N/A' }

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getChatMemberCount?chat_id=${chatId}`)
        const data = await response.json()
        return {
            subscribers: data.result || 0,
            lastPost: new Date().toLocaleTimeString()
        }
    } catch (e) {
        return { subscribers: 0, lastPost: 'N/A' }
    }
}
