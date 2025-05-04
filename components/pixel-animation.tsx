"use client"

import { useEffect, useRef } from "react"

interface PixelAnimationProps {
  className?: string
}

export function PixelAnimation({ className = "" }: PixelAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initial resize
    resizeCanvas()

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Pixel properties
    const pixelSize = 8
    const columns = Math.ceil(canvas.width / pixelSize)
    const rows = Math.ceil(canvas.height / pixelSize)

    // Create pixel grid
    const pixels: { x: number; y: number; color: string; alpha: number; speed: number }[] = []

    // Initialize pixels
    for (let i = 0; i < columns * rows * 0.1; i++) {
      pixels.push({
        x: Math.floor(Math.random() * columns) * pixelSize,
        y: Math.floor(Math.random() * rows) * pixelSize,
        color: `rgb(${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 60)})`,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.5 + 0.1,
      })
    }

    // Animation loop
    let animationFrameId: number

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#121212"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw pixels
      pixels.forEach((pixel) => {
        ctx.globalAlpha = pixel.alpha
        ctx.fillStyle = pixel.color
        ctx.fillRect(pixel.x, pixel.y, pixelSize, pixelSize)

        // Move pixels
        pixel.y += pixel.speed

        // Reset position if off screen
        if (pixel.y > canvas.height) {
          pixel.y = -pixelSize
          pixel.x = Math.floor(Math.random() * columns) * pixelSize
        }
      })

      // Reset global alpha
      ctx.globalAlpha = 1

      // Continue animation loop
      animationFrameId = requestAnimationFrame(render)
    }

    // Start animation
    render()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className={`pixel-canvas absolute inset-0 z-0 ${className}`} />
}
