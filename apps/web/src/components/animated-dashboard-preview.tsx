"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Bot, DollarSign, BarChart3 } from "lucide-react"

export function AnimatedDashboardPreview() {
  const [activeCard, setActiveCard] = useState(0)
  const [profits, setProfits] = useState([2.45, 4.12, -0.85, 1.89])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 4)
      setProfits((prev) => prev.map((profit) => profit + (Math.random() - 0.5) * 0.1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    {
      title: "Pod Treasury",
      value: "$46,763.80",
      change: "+7.61%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Active Orcas",
      value: "5",
      change: "Hunting",
      icon: <Bot className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Hunt Success",
      value: "89.4%",
      change: "+2.1%",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Ocean Depth",
      value: "Deep",
      change: "Analyzing",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="relative w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Live Dashboard Preview</h3>
        <p className="text-slate-600 dark:text-slate-400">Real-time orca pod performance</p>
      </div>

      {/* Animated Cards Grid */}
      <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all duration-500 transform ${
              activeCard === index
                ? "scale-105 shadow-lg border-2 border-blue-400 dark:border-blue-500"
                : "hover:scale-102 border-slate-200 dark:border-slate-700"
            } bg-white dark:bg-slate-800`}
          >
            <CardContent className="p-4">
              <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-5`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${card.color} text-white`}>{card.icon}</div>
                  {activeCard === index && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{card.title}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{card.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Animated Trading Bots */}
      <div className="relative z-10 space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Active Orca Hunters</h4>
        {["ALPHA TRADER", "MOMENTUM HUNTER", "WHALE TRACKER"].map((name, index) => (
          <div
            key={name}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Hunting in deep waters</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                +{profits[index]?.toFixed(2)}%
              </Badge>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Animated Wave at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden rounded-b-2xl">
        <svg className="absolute bottom-0 w-full h-8 animate-pulse" viewBox="0 0 400 40">
          <path d="M0,20 Q100,10 200,20 T400,20 L400,40 L0,40 Z" className="fill-blue-500/20 dark:fill-blue-400/20" />
        </svg>
      </div>
    </div>
  )
}
