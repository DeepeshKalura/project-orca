"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { OrcaLogo } from "@/components/orca-logo"
import {
  Bot,
  TrendingUp,
  DollarSign,
  Settings,
  Play,
  Pause,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Waves,
  Fish,
  Navigation,
} from "lucide-react"
import botsData from "../../../data/bots.json"

interface Bot {
  id: string
  name: string
  status: string
  strategy: string
  pair: string
  profit24h: number
  totalProfit: number
  winRate: number
  trades24h: number
  balance: number
  lastTrade: string
  riskLevel: string
}

export default function Dashboard() {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [data] = useState(botsData)

  const getStatusColor = (status: string) => {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400"
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-400"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
  }

  const orcaStrategies: { [key: string]: { icon: React.ReactElement; name: string } } = {
    "Grid Trading": { icon: <Navigation className="w-5 h-5" />, name: "Navigator Orca" },
    Momentum: { icon: <Fish className="w-5 h-5" />, name: "Hunter Orca" },
    Scalping: { icon: <Waves className="w-5 h-5" />, name: "Swift Orca" },
    "Volume Analysis": { icon: <BarChart3 className="w-5 h-5" />, name: "Sonar Orca" },
    Arbitrage: { icon: <TrendingUp className="w-5 h-5" />, name: "Apex Orca" },
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <OrcaLogo className="w-10 h-10" />
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wider">PROJECT ORCA</span>
                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800 ml-2 text-xs">
                  DEMO POD
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 dark:text-slate-300">Welcome to the pod, John Doe 🐋</span>
              <ThemeToggle />
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Pod Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ocean Overview */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Ocean Command Center</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Monitor your pod&apos;s hunting performance across the crypto ocean
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Pod Treasury</CardTitle>
              <Wallet className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(data.portfolio.totalBalance)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {formatPercentage(data.portfolio.totalProfit24h)} from yesterday&apos;s hunt
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Hunt Success</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPercentage(data.portfolio.totalProfit24h)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {data.portfolio.totalTrades24h} successful strikes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Orcas</CardTitle>
              <Fish className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.portfolio.activeBots}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{data.bots.length} total pod members</p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Hunt Precision</CardTitle>
              <Navigation className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.portfolio.avgWinRate}%</div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Average pod accuracy</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orca Pod */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <Fish className="w-5 h-5" />
                  Your Orca Pod
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Intelligent hunters working in coordination
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.bots.map((bot) => (
                    <div
                      key={bot.id}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50"
                      onClick={() => setSelectedBot(bot)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            {orcaStrategies[bot.strategy]?.icon || <Bot className="w-5 h-5 text-white" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">{bot.name}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {orcaStrategies[bot.strategy]?.name || bot.strategy} • {bot.pair}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(bot.status)}>{bot.status.toUpperCase()}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            {bot.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Hunt Profit</p>
                          <p
                            className={`font-semibold ${bot.profit24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                          >
                            {formatPercentage(bot.profit24h)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Total Catch</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {formatCurrency(bot.totalProfit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Strike Rate</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{bot.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Hunt Risk</p>
                          <Badge className={getRiskColor(bot.riskLevel)}>{bot.riskLevel.toUpperCase()}</Badge>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span>Hunting Efficiency</span>
                          <span>{bot.winRate}%</span>
                        </div>
                        <Progress value={bot.winRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ocean Conditions & Recent Catches */}
          <div className="space-y-6">
            {/* Ocean Conditions */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <Waves className="w-5 h-5" />
                  Ocean Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.markets.map((market) => (
                    <div key={market.symbol} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{market.symbol}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{formatCurrency(market.price)}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`flex items-center gap-1 ${market.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {market.change24h >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span className="font-semibold">{formatPercentage(market.change24h)}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{market.volume24h}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Catches */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Recent Catches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.recentTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="border-l-2 border-blue-500 pl-3 bg-blue-50 dark:bg-blue-900/20 rounded-r p-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{trade.botName}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {trade.type} {trade.amount} {trade.pair.split("/")[0]} @ {formatCurrency(trade.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                            +{formatCurrency(trade.profit)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(trade.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Orca Detail Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  {orcaStrategies[selectedBot.strategy]?.icon || <Bot className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">{selectedBot.name}</CardTitle>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedBot.id} • {orcaStrategies[selectedBot.strategy]?.name || selectedBot.strategy}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedBot(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Hunt Status</p>
                  <Badge className={getStatusColor(selectedBot.status)}>{selectedBot.status.toUpperCase()}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ocean Territory</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{selectedBot.pair}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Pod Treasury</p>
                  <p className="text-slate-900 dark:text-white font-semibold">{formatCurrency(selectedBot.balance)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Hunt Risk</p>
                  <Badge className={getRiskColor(selectedBot.riskLevel)}>{selectedBot.riskLevel.toUpperCase()}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Today&apos;s Hunt</p>
                  <p
                    className={`text-lg font-bold ${selectedBot.profit24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {formatPercentage(selectedBot.profit24h)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Catch</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedBot.totalProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Strike Precision</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedBot.winRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Hunt Strikes</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{selectedBot.trades24h}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900">
                  {selectedBot.status === "active" ? "Rest Orca" : "Wake Orca"}
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 bg-transparent"
                >
                  Configure Hunt
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 bg-transparent"
                >
                  Hunt History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
