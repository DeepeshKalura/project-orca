"use client"

import { useEffect, useState } from "react"

export function AudioManager() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)

  // Complete the audio generation with proper ocean sounds and whale calls
  useEffect(() => {
    // Create audio context for better sound generation
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // Generate ocean ambient sound
    const generateOceanSound = () => {
      const bufferSize = audioContext.sampleRate * 10 // 10 seconds
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        // Create ocean wave sound with multiple frequencies
        const time = i / audioContext.sampleRate
        data[i] =
          (Math.sin(2 * Math.PI * 0.5 * time) * 0.3 + // Low frequency waves
            Math.sin(2 * Math.PI * 1.2 * time) * 0.2 + // Medium waves
            (Math.random() - 0.5) * 0.1) * // White noise for foam
          0.3
      }

      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.loop = true
      const gainNode = audioContext.createGain()
      gainNode.gain.value = volume
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)

      return { source, gainNode }
    }

    // Generate whale call sound
    const generateWhaleCall = () => {
      const bufferSize = audioContext.sampleRate * 3 // 3 seconds
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        const time = i / audioContext.sampleRate
        // Create whale-like call with frequency modulation
        const frequency = 80 + Math.sin(time * 2) * 40 // Varying frequency
        data[i] = Math.sin(2 * Math.PI * frequency * time) * Math.exp(-time * 0.5) * 0.4
      }

      const source = audioContext.createBufferSource()
      source.buffer = buffer
      const gainNode = audioContext.createGain()
      gainNode.gain.value = volume * 0.7
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)

      return { source, gainNode }
    }

    let oceanAudio = null
    let whaleTimer = null

    const startAudio = () => {
      if (isPlaying && audioContext.state === "suspended") {
        audioContext.resume()
      }

      if (isPlaying && !oceanAudio) {
        oceanAudio = generateOceanSound()
        oceanAudio.source.start()

        // Play whale calls every 15-30 seconds
        const scheduleWhaleCall = () => {
          const delay = 15000 + Math.random() * 15000 // 15-30 seconds
          whaleTimer = setTimeout(() => {
            if (isPlaying) {
              const whale = generateWhaleCall()
              whale.source.start()
              scheduleWhaleCall()
            }
          }, delay)
        }
        scheduleWhaleCall()
      }
    }

    const stopAudio = () => {
      if (oceanAudio) {
        oceanAudio.source.stop()
        oceanAudio = null
      }
      if (whaleTimer) {
        clearTimeout(whaleTimer)
        whaleTimer = null
      }
    }

    if (isPlaying) {
      startAudio()
    } else {
      stopAudio()
    }

    return () => {
      stopAudio()
      if (audioContext.state !== "closed") {
        audioContext.close()
      }
    }
  }, [isPlaying, volume])

  // Add audio controls UI
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          {isPlaying ? "🔇" : "🌊"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
          className="w-20"
        />
        <span className="text-xs text-slate-600 dark:text-slate-400">{isPlaying ? "Ocean Active" : "Ocean Quiet"}</span>
      </div>
    </div>
  )
}
