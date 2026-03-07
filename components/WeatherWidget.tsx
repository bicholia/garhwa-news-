'use client'

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, Wind, Thermometer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CITIES = [
    { name: 'गढ़वा', lat: 24.1754, lon: 83.8052 },
    { name: 'पलामू', lat: 24.0321, lon: 84.0700 }
]

export default function WeatherWidget() {
    const [cityIndex, setCityIndex] = useState(0)
    const [weather, setWeather] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const activeCity = CITIES[cityIndex]

    // Mock data function (as requested for fallback)
    const getMockData = (cityName: string) => {
        if (cityName === 'गढ़वा') return { temp: 24, condition: 'Sunny', icon: <Sun size={16} color="#f59e0b" /> }
        return { temp: 22, condition: 'Cloudy', icon: <Cloud size={16} color="#94a3b8" /> }
    }

    useEffect(() => {
        const fetchWeather = async () => {
            if (!activeCity) return
            setLoading(true)
            try {
                const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
                if (!apiKey) throw new Error('No API Key')

                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${activeCity.lat}&lon=${activeCity.lon}&appid=${apiKey}&units=metric`)
                const data = await res.json()

                setWeather({
                    temp: Math.round(data.main.temp),
                    condition: data.weather[0].main,
                    icon: data.weather[0].main.includes('Cloud') ? <Cloud size={16} /> : data.weather[0].main.includes('Rain') ? <CloudRain size={16} /> : <Sun size={16} />
                })
            } catch (err) {
                // Fallback to mock data
                setWeather(getMockData(activeCity.name))
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [activeCity])

    // Auto-rotation logic (every 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            setCityIndex((prev) => (prev + 1) % CITIES.length)
        }, 10000)
        return () => clearInterval(interval)
    }, [])

    if (!activeCity || (!weather && loading)) return null

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#f8fafc',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            fontSize: '0.75rem',
            fontWeight: 700,
            overflow: 'hidden',
            minWidth: '140px',
            height: '32px'
        }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCity.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'space-between' }}
                >
                    <span style={{ color: '#64748b' }}>{activeCity.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1e293b' }}>
                        {weather?.icon}
                        <span>{weather?.temp}°C</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
