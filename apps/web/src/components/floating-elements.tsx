"use client"

import { useEffect, useState } from "react"
import { Bot, TrendingUp, DollarSign, BarChart3, Zap, Shield } from "lucide-react"

export function FloatingElements() {
  const [elements, setElements] = useState([])

  useEffect(() => {
    const icons = [Bot, TrendingUp, DollarSign, BarChart3, Zap, Shield]
    const newElements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      Icon: icons[Math.floor(Math.random() * icons.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }))
    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => {
        const Icon = element.Icon
        return (
          <div
            key={element.id}
            className="absolute opacity-10 dark:opacity-5"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            <Icon className="w-8 h-8 text-blue-500 animate-bounce" />
          </div>
        )
      })}
    </div>
  )
}
