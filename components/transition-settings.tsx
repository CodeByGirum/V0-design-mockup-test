"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTransition } from "./transition-provider"
import { ChevronDown, ChevronUp } from "lucide-react"

export function TransitionSettings() {
  const { transitionType, setTransitionType, transitionDuration, setTransitionDuration } = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const transitionOptions = [
    { value: "fade", label: "Fade" },
    { value: "slide", label: "Slide" },
    { value: "scale", label: "Scale" },
    { value: "flip", label: 'Flip"  label: "Slide' },
    { value: "scale", label: "Scale" },
    { value: "flip", label: "Flip" },
    { value: "rotate", label: "Rotate" },
    { value: "perspective", label: "Perspective" },
  ]

  return (
    <div className="mt-6 border-t border-[#2a2a2a] pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs text-gray-400 hover:text-white transition-colors"
      >
        <span className="font-medium">Transition Settings</span>
        {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 space-y-3"
        >
          <div>
            <label className="block text-xs text-gray-400 mb-1">Transition Type</label>
            <select
              value={transitionType}
              onChange={(e) => setTransitionType(e.target.value as any)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
            >
              {transitionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Duration (seconds)</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={transitionDuration}
                onChange={(e) => setTransitionDuration(Number.parseFloat(e.target.value))}
                className="flex-1 h-1 bg-[#2a2a2a] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <span className="text-xs text-gray-400 w-8">{transitionDuration.toFixed(1)}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-gray-400 mb-2">Preview</div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md p-3 h-20 flex items-center justify-center">
              <motion.div
                key={transitionType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-sm font-medium">Transition Preview</div>
                <div className="text-xs text-gray-400 mt-1">
                  Type: {transitionType}, Duration: {transitionDuration.toFixed(1)}s
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
