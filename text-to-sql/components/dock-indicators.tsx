/**
 * Purpose: Visual indicators for docking positions
 * Features: Shows where the chat panel will dock when dragged
 * Used in: Main workstation component
 */

"use client"

import type { DockPosition } from "../types"

interface DockIndicatorsProps {
  isDragging: boolean
  dockIndicator: DockPosition | null
}

export function DockIndicators({ isDragging, dockIndicator }: DockIndicatorsProps) {
  if (!isDragging) return null

  return (
    <>
      {/* Left dock indicator */}
      <div
        className={`fixed left-0 top-0 w-[100px] h-full bg-blue-500 bg-opacity-${
          dockIndicator === "left" ? "20" : "5"
        } transition-all duration-200 pointer-events-none z-50`}
      />

      {/* Right dock indicator */}
      <div
        className={`fixed right-0 top-0 w-[100px] h-full bg-blue-500 bg-opacity-${
          dockIndicator === "right" ? "20" : "5"
        } transition-all duration-200 pointer-events-none z-50`}
      />

      {/* Bottom dock indicator */}
      <div
        className={`fixed left-0 bottom-0 w-full h-[100px] bg-blue-500 bg-opacity-${
          dockIndicator === "bottom" ? "20" : "5"
        } transition-all duration-200 pointer-events-none z-50`}
      />
    </>
  )
}
