"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, TrendingUp, Play, Pause, Settings } from "lucide-react"
import Link from "next/link"

export function TabletBotView({ bots, onBotSelect }) {
  const [selectedBotId, setSelectedBotId] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
      case "paused":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
      case "maintenance":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800"
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
    }
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Tablet Frame */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-slate-700">
        {/* Tablet Screen */}
        <div className="bg-slate-900 rounded-2xl p-1 shadow-inner">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl overflow-hidden min-h-[500px]">
            {/* Screen Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-sm font-mono">Project Orca - Pod Command Center</span>
              </div>
              <div className="text-xs text-slate-400">Live Trading Dashboard</div>
            </div>

            {/* Bot Grid Display */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900">
              {bots.map((bot) => (
                <Card
                  key={bot.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 ${
                    selectedBotId === bot.id
                      ? "border-blue-500 shadow-lg shadow-blue-500/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                  } bg-white dark:bg-slate-800`}
                  onClick={() => {
                    setSelectedBotId(bot.id)
                    onBotSelect(bot)
                  }}
                >
                  <CardContent className="p-4">
                    {/* Bot Avatar */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            bot.status === "active"
                              ? "bg-green-500"
                              : bot.status === "paused"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{bot.name}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {bot.strategy} • {bot.pair}
                        </p>
                      </div>
                    </div>

                    {/* Bot Stats */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 dark:text-slate-400">24h Profit</span>
                        <span
                          className={`text-sm font-bold ${
                            bot.profit24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {bot.profit24h >= 0 ? "+" : ""}
                          {bot.profit24h.toFixed(2)}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Win Rate</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{bot.winRate}%</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Balance</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          ${bot.balance.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-4 flex items-center justify-between">
                      <Badge className={getStatusColor(bot.status)}>{bot.status.toUpperCase()}</Badge>

                      {/* Action Buttons */}
                      <div className="flex gap-1">
                        <Link href="/dashboard">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            {bot.status === "active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                        </Link>
                        <Link href="/dashboard">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Performance Indicator */}
                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${bot.winRate}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-slate-100 dark:bg-slate-800 p-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {bots.filter((bot) => bot.status === "active").length} Active Orcas
                  </span>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Total Portfolio: ${bots.reduce((sum, bot) => sum + bot.balance, 0).toLocaleString()}
                </div>
              </div>

              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Full Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet Physical Details */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full"></div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-slate-700 rounded-full border-2 border-slate-600"></div>
      </div>

      {/* Tablet Stand */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl shadow-lg"></div>
    </div>
  )
}
