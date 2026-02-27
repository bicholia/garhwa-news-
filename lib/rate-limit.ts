export function rateLimit(options: { interval: number; max: number }) {
    const cache = new Map<string, { count: number; lastRequest: number }>()

    return {
        check: (ip: string) => {
            const now = Date.now()
            const record = cache.get(ip)

            if (!record) {
                cache.set(ip, { count: 1, lastRequest: now })
                return true
            }

            if (now - record.lastRequest > options.interval) {
                cache.set(ip, { count: 1, lastRequest: now })
                return true
            }

            if (record.count >= options.max) {
                return false
            }

            record.count++
            record.lastRequest = now
            return true
        }
    }
}
