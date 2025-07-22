/**
 * Purpose: Displays visual indicators for docking the chat panel.
 * Features: Shows semi-transparent overlays on the edges of the screen.
 * Used in: Cleaning Workstation page, visible only during drag operations.
 */
"use client"

import { motion } from "framer-motion"
import type { DockPosition } from "../types"

interface DockIndicatorsProps {
  isDragging: boolean
  dockIndicator: DockPosition | null
}

export function DockIndicators({ isDragging, dockIndicator }: DockIndicatorsProps) {
  if (!isDragging) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: dockIndicator === "left" ? 1 : 0 }}
        className="fixed top-0 left-0 w-[100px] h-full bg-blue-500/20 pointer-events-none transition-opacity duration-200 z-50"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: dockIndicator === "right" ? 1 : 0 }}
        className="fixed top-0 right-0 w-[100px] h-full bg-blue-500/20 pointer-events-none transition-opacity duration-200 z-50"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: dockIndicator === "bottom" ? 1 : 0 }}
        className="fixed bottom-0 left-0 w-full h-[100px] bg-blue-500/20 pointer-events-none transition-opacity duration-200 z-50"
      />
    </>
  )
}
