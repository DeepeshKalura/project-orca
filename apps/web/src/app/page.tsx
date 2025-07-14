"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { OrcaLogo } from "@/components/orca-logo"
import { FloatingElements } from "@/components/floating-elements"
import { HeroAnimation } from "@/components/hero-animation"
import { StatsAnimation } from "@/components/stats-animation"
import { ArrowRight, Shield, Zap, Users, Star, Waves, Fish, Navigation, Sparkles } from "lucide-react"
import Link from "next/link"

// Import the new components and update the dashboard preview section
import { TabletBotView } from "@/components/tablet-bot-view"
import { AudioManager } from "@/components/audio-manager"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: <Fish className="w-8 h-8" />,
      title: "Intelligent Pod Trading",
      description: "Like orcas hunting in coordinated pods, our bots work together using advanced AI algorithms",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: "Deep Market Analysis",
      description:
        "Dive deep into market currents with multi-strategy trading: Grid, Momentum, Scalping, and Arbitrage",
      gradient: "from-cyan-500 to-teal-500",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Apex Predator Protection",
      description: "Advanced risk management keeps your portfolio safe in the volatile crypto ocean",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning-Fast Execution",
      description: "Strike with the speed and precision of an orca, executing trades in milliseconds",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: "Sonar Analytics",
      description: "Navigate the crypto waters with comprehensive performance tracking and insights",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Pod Community",
      description: "Join our pod of successful traders sharing strategies and market intelligence",
      gradient: "from-pink-500 to-rose-500",
    },
  ]

  const stats = [
    { label: "Pod Members", value: "50K+" },
    { label: "Ocean Volume", value: "$2.5B+" },
    { label: "Hunt Success", value: "89%" },
    { label: "Trading Pairs", value: "500+" },
  ]

  // Add sample bot data for the tablet view
  const sampleBots = [
    {
      id: "BOT-001",
      name: "ALPHA TRADER",
      status: "active",
      strategy: "Grid Trading",
      pair: "BTC/USDT",
      profit24h: 2.45,
      totalProfit: 1247.89,
      winRate: 78.5,
      trades24h: 23,
      balance: 15420.5,
    },
    {
      id: "BOT-002",
      name: "MOMENTUM HUNTER",
      status: "active",
      strategy: "Momentum",
      pair: "ETH/USDT",
      profit24h: 4.12,
      totalProfit: 2156.34,
      winRate: 82.3,
      trades24h: 18,
      balance: 8750.25,
    },
    {
      id: "BOT-003",
      name: "SCALP MASTER",
      status: "paused",
      strategy: "Scalping",
      pair: "ADA/USDT",
      profit24h: -0.85,
      totalProfit: 567.12,
      winRate: 65.8,
      trades24h: 45,
      balance: 3200.75,
    },
    {
      id: "BOT-004",
      name: "WHALE TRACKER",
      status: "active",
      strategy: "Volume Analysis",
      pair: "SOL/USDT",
      profit24h: 1.89,
      totalProfit: 892.45,
      winRate: 71.2,
      trades24h: 12,
      balance: 6890.3,
    },
    {
      id: "BOT-005",
      name: "ARBITRAGE PRO",
      status: "maintenance",
      strategy: "Arbitrage",
      pair: "MULTI",
      profit24h: 0.0,
      totalProfit: 3421.67,
      winRate: 89.4,
      trades24h: 0,
      balance: 12500.0,
    },
    {
      id: "BOT-006",
      name: "DEEP SEA HUNTER",
      status: "active",
      strategy: "AI Neural",
      pair: "BNB/USDT",
      profit24h: 3.21,
      totalProfit: 1876.23,
      winRate: 85.7,
      trades24h: 31,
      balance: 9340.8,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      <FloatingElements />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group">
              <div className="transform transition-transform group-hover:scale-110">
                <OrcaLogo className="w-10 h-10" animated />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wider">PROJECT ORCA</span>
                <p className="text-xs text-slate-600 dark:text-slate-400">Apex Trading Intelligence</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-105"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </a>
              <a
                href="#about"
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-105"
              >
                About
              </a>
              <ThemeToggle />
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join the Pod
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800 mb-4 animate-pulse">
              🐋 Now Live - Intelligent Pod Trading
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight animate-fade-in">
              Rule the Crypto Ocean with
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                {" "}
                Orca Intelligence
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
              Join the apex predators of crypto trading. Our AI-powered orcas hunt in coordinated pods, maximizing
              profits while navigating the deepest market currents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Dive Into Trading
                <ArrowRight className="w-5 h-5 ml-2 animate-bounce" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-transparent transform transition-all duration-300 hover:scale-105"
            >
              Watch the Hunt
            </Button>
          </div>

          {/* Hero Animation */}
          <div className="mb-12">
            <HeroAnimation />
          </div>

          {/* Animated Stats */}
          <StatsAnimation stats={stats} />
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section id="dashboard" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in">
              Command Your Orca Pod
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto animate-fade-in-delay">
              Experience the power of coordinated AI trading with our intuitive command center
            </p>
          </div>

          <div className="animate-fade-in-delay-2">
            <TabletBotView bots={sampleBots} onBotSelect={(bot) => console.log("Selected bot:", bot)} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Apex Predator Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Like orcas dominating the ocean, our platform combines intelligence, coordination, and precision to
              deliver unmatched trading performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 transform hover:scale-105 hover:shadow-xl group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />
                <CardHeader className="relative z-10">
                  <div
                    className={`text-white mb-4 p-3 rounded-lg bg-gradient-to-r ${feature.gradient} w-fit transform transition-transform group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ocean Wave Divider with Animation */}
      <div className="relative h-32 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-32 animate-pulse" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" className="fill-white dark:fill-slate-900" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Waves className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-bounce" />
        </div>
        {/* Floating bubbles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-bounce mb-6">
            <OrcaLogo className="w-16 h-16 mx-auto" animated />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Ready to Join the Pod?</h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Swim with the apex predators of crypto trading. Experience the power of coordinated intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="Enter your email to join the pod"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 w-full sm:w-80 transform transition-all duration-300 focus:scale-105 focus:shadow-lg"
            />
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 w-full sm:w-auto transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Dive In
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
            <span>Trusted by 50,000+ pod members worldwide</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4 group">
                <div className="transform transition-transform group-hover:scale-110">
                  <OrcaLogo className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">PROJECT ORCA</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Apex Trading Intelligence</p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Intelligent crypto trading platform where apex predators hunt together in coordinated pods.
              </p>
            </div>

            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">The Hunt</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Trading Pods
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Sonar Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Ocean API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Mobile Pod
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">The Pod</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    About Orcas
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Join the Crew
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Ocean Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Contact Pod
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Navigation Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Ocean Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Pod Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                  >
                    Ocean Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 text-center text-slate-500 dark:text-slate-400">
            <p>&copy; 2025 Project Orca. All rights reserved. Swimming in digital oceans since 2025.</p>
          </div>
        </div>
      </footer>

      {/* Audio Manager */}
      <AudioManager />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 1s ease-out 0.6s both;
        }
      `}</style>
    </div>
  )
}
