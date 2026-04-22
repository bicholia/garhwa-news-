export async function sendToTelegram(article: any) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHANNEL_ID

    if (!token || !chatId) {
        console.error('Telegram credentials missing')
        return
    }

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

    const label = categoryLabel[article.category?.slug?.current] || '[ThinkIndia.press]'
    const districtHashtag = article.district ? `#${article.district}` : '#झारखंड'

    const message = `
${label} *${article.title}*

${article.excerpt || ''}

पूरी खबर पढ़ें: ${process.env.NEXT_PUBLIC_SITE_URL}/news/${article.slug.current || article.slug}

${districtHashtag} #${article.category?.name || 'समाचार'} #गढ़वा #पलामू #ThinkIndia #MaaGarhdeviAI
  `

    // Determine target URL and payload
    let url = `https://api.telegram.org/bot${token}/sendMessage`
    let payload: any = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
    }

    // If there's an image, use sendPhoto
    const imageUrl = article.image_url || article.imageUrl || (article.featureImage?.asset?.url)
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        url = `https://api.telegram.org/bot${token}/sendPhoto`
        payload = {
            chat_id: chatId,
            photo: imageUrl,
            caption: message,
            parse_mode: 'Markdown'
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
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
export async function sendNotificationToTelegram(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHANNEL_ID

    if (!token || !chatId) {
        console.error('Telegram credentials missing')
        return false
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        })

        const data = await response.json()
        return data.ok
    } catch (error) {
        console.error('Telegram notification failed:', error)
        return false
    }
}

export async function verifyTelegramBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) return { ok: false, error: 'Token missing' }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getMe`)
        const data = await response.json()
        return data
    } catch (e) {
        return { ok: false, error: String(e) }
    }
}

export async function detectChannelId() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) return { ok: false, error: 'Token missing' }
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates`)
        const data = await response.json()
        
        if (!data.ok) return data
        
        // Look for the most recent channel post or status change
        const updates = data.result || []
        // We look for updates where the bot was added or a message was sent to a channel
        const channelUpdate = updates.reverse().find((u: any) => 
            u.my_chat_member?.chat?.type === 'channel' || 
            u.channel_post?.chat?.type === 'channel'
        )
        
        if (channelUpdate) {
            const chat = channelUpdate.my_chat_member?.chat || channelUpdate.channel_post?.chat
            return { ok: true, chat_id: chat.id, title: chat.title }
        }
        
        return { ok: false, error: 'No channel interactions found yet. Make sure bot is an admin.' }
    } catch (e) {
        return { ok: false, error: String(e) }
    }
}
