"use client"

import { useEffect, useState } from "react"

export function StatsAnimation({ stats }: { stats: Array<{ label: string; value: string }> }) {
  const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0))
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isVisible) {
      stats.forEach((stat, index) => {
        const numericValue = Number.parseInt(stat.value.replace(/[^\d]/g, ""))
        if (numericValue) {
          let current = 0
          const increment = numericValue / 50
          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              current = numericValue
              clearInterval(timer)
            }
            setAnimatedStats((prev) => {
              const newStats = [...prev]
              newStats[index] = Math.floor(current)
              return newStats
            })
          }, 50)
        }
      })
    }
  }, [isVisible, stats])

  return (
    <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`text-center transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: `${index * 200}ms` }}
        >
          <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2 relative">
            <span className="inline-block animate-pulse">
              {stat.value.includes("K") || stat.value.includes("B")
                ? `${animatedStats[index]}${stat.value.slice(-2)}`
                : stat.value.includes("%")
                  ? `${animatedStats[index]}%`
                  : stat.value}
            </span>
            {isVisible && <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-ping" />}
          </div>
          <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
