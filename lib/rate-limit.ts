export function rateLimit(options: { interval: number; max: number }) {
    const cache = new Map<string, { count: number; lastRequest: number }>()

    return {
        check: (ip: string) => {
            // BUG-09 FIX: Prevent memory leak by clearing cache if it grows too large
            if (cache.size > 10000) cache.clear()

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
                // BUG-21 FIX: Don't update lastRequest on rejected requests to avoid window reset
                return false
            }

            record.count++
            // record.lastRequest = now // Removed to fix BUG-21
            return true
        }
    }
}
