'use client'

import { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain } from 'lucide-react'

const CITIES = [
    { name: 'गढ़वा', lat: 24.1754, lon: 83.8052 },
    { name: 'पलामू', lat: 24.0321, lon: 84.0700 }
]

export default function WeatherWidget() {
    const [mounted, setMounted] = useState(false)
    const [cityIndex, setCityIndex] = useState(0)
    const [weather, setWeather] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMounted(true)
    }, [])

    const activeCity = CITIES[cityIndex]

    const getMockData = (cityName: string) => {
        if (cityName === 'गढ़वा') return { temp: 34, condition: 'Sunny' }
        return { temp: 32, condition: 'Cloudy' }
    }

    const getWeatherIcon = (condition: string) => {
        if (condition?.toLowerCase().includes('cloud')) return <Cloud size={13} className="text-white/70" />
        if (condition?.toLowerCase().includes('rain')) return <CloudRain size={13} className="text-blue-300" />
        return <Sun size={13} className="text-brand-gold" />
    }

    useEffect(() => {
        if (!mounted) return
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
                    condition: data.weather[0]?.main || 'Clear',
                })
            } catch {
                setWeather(getMockData(activeCity.name))
            } finally {
                setLoading(false)
            }
        }
        fetchWeather()
    }, [activeCity, mounted])

    useEffect(() => {
        const interval = setInterval(() => {
            setCityIndex((prev) => (prev + 1) % CITIES.length)
        }, 8000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted || !activeCity || (!weather && loading)) return null

    return (
        <div className="flex items-center gap-2 text-[11px] font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            {getWeatherIcon(weather?.condition)}
            <span className="text-white/80">{activeCity.name}</span>
            <span className="text-brand-gold font-black">{weather?.temp}°C</span>
        </div>
    )
}
