"use client"

import { useEffect, useState } from "react"

export function OrcaLogo({ className = "w-8 h-8", animated = false }: { className?: string; animated?: boolean }) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (animated) {
      const interval = setInterval(() => {
        setPulse(true)
        setTimeout(() => setPulse(false), 1000)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [animated])

  return (
    <div className={`${className} relative`}>
      <svg viewBox="0 0 120 120" className="w-full h-full">
        {/* AI Neural Network Background */}
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-blue-500" />
            <stop offset="50%" className="stop-color-cyan-400" />
            <stop offset="100%" className="stop-color-blue-600" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Neural Network Connections */}
        <g className={`${animated ? "animate-pulse" : ""} opacity-30`}>
          <line x1="20" y1="30" x2="40" y2="50" stroke="url(#aiGradient)" strokeWidth="1" />
          <line x1="80" y1="30" x2="100" y2="50" stroke="url(#aiGradient)" strokeWidth="1" />
          <line x1="30" y1="70" x2="50" y2="90" stroke="url(#aiGradient)" strokeWidth="1" />
          <line x1="70" y1="70" x2="90" y2="90" stroke="url(#aiGradient)" strokeWidth="1" />
          <line x1="40" y1="50" x2="80" y2="50" stroke="url(#aiGradient)" strokeWidth="1" />
        </g>

        {/* AI Nodes */}
        <g className={`${animated ? "animate-bounce" : ""}`}>
          <circle cx="20" cy="30" r="2" fill="url(#aiGradient)" className={pulse ? "animate-ping" : ""} />
          <circle cx="100" cy="30" r="2" fill="url(#aiGradient)" className={pulse ? "animate-ping" : ""} />
          <circle cx="30" cy="90" r="2" fill="url(#aiGradient)" className={pulse ? "animate-ping" : ""} />
          <circle cx="90" cy="90" r="2" fill="url(#aiGradient)" className={pulse ? "animate-ping" : ""} />
        </g>

        {/* Main Orca Body with AI Enhancement */}
        <g className={`${animated ? "animate-pulse" : ""}`} filter="url(#glow)">
          {/* Orca body */}
          <ellipse cx="60" cy="65" rx="40" ry="28" fill="url(#aiGradient)" />
          {/* Orca belly with circuit pattern */}
          <ellipse cx="60" cy="75" rx="28" ry="18" className="fill-white dark:fill-slate-900" />

          {/* Circuit lines on belly */}
          <g className="opacity-40">
            <line x1="45" y1="70" x2="75" y2="70" stroke="url(#aiGradient)" strokeWidth="0.5" />
            <line x1="45" y1="75" x2="75" y2="75" stroke="url(#aiGradient)" strokeWidth="0.5" />
            <line x1="45" y1="80" x2="75" y2="80" stroke="url(#aiGradient)" strokeWidth="0.5" />
            <circle cx="50" cy="70" r="1" fill="url(#aiGradient)" />
            <circle cx="70" cy="75" r="1" fill="url(#aiGradient)" />
            <circle cx="55" cy="80" r="1" fill="url(#aiGradient)" />
          </g>
        </g>

        {/* Orca head with AI brain pattern */}
        <g className={`${animated ? "animate-pulse" : ""}`}>
          <ellipse cx="60" cy="40" rx="22" ry="20" fill="url(#aiGradient)" />

          {/* AI Brain Pattern */}
          <g className="opacity-60">
            <path
              d="M50 35 Q60 30 70 35 Q65 40 60 35 Q55 40 50 35"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.8"
            />
            <path d="M52 42 Q60 38 68 42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
            <circle cx="55" cy="38" r="0.8" fill="rgba(255,255,255,0.4)" />
            <circle cx="65" cy="38" r="0.8" fill="rgba(255,255,255,0.4)" />
          </g>

          {/* Eye patch with tech design */}
          <ellipse cx="55" cy="38" rx="9" ry="7" className="fill-white dark:fill-slate-900" />
          {/* Digital eye */}
          <circle cx="55" cy="38" r="4" fill="url(#aiGradient)" className={pulse ? "animate-ping" : ""} />
          <circle cx="55" cy="38" r="2" className="fill-white dark:fill-slate-900" />
        </g>

        {/* Enhanced Dorsal fin with tech lines */}
        <g className={`${animated ? "animate-bounce" : ""}`}>
          <path d="M60 15 L68 8 L72 18 L60 25 Z" fill="url(#aiGradient)" />
          <line x1="62" y1="20" x2="68" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <line x1="64" y1="22" x2="70" y2="17" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </g>

        {/* Enhanced tail fins */}
        <g className={`${animated ? "animate-pulse" : ""}`}>
          <path d="M20 65 L8 55 L8 75 L20 70 Z" fill="url(#aiGradient)" />
          <path d="M100 65 L112 55 L112 75 L100 70 Z" fill="url(#aiGradient)" />
          {/* Tech lines on fins */}
          <line x1="12" y1="60" x2="18" y2="67" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <line x1="102" y1="60" x2="108" y2="67" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </g>

        {/* AI Data Flow Animation */}
        {animated && (
          <g className="animate-pulse">
            <circle cx="30" cy="40" r="1" fill="cyan" className="animate-ping" />
            <circle cx="90" cy="40" r="1" fill="cyan" className="animate-ping" style={{ animationDelay: "0.5s" }} />
            <circle cx="60" cy="20" r="1" fill="cyan" className="animate-ping" style={{ animationDelay: "1s" }} />
          </g>
        )}
      </svg>
    </div>
  )
}
