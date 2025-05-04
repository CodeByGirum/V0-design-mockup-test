"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

type ModelCategory = {
  name: string
  models: string[]
}

type ModelSelectorProps = {
  onModelSelect: (model: string) => void
  selectedModel: string
  className?: string
}

const modelCategories: ModelCategory[] = [
  {
    name: "Claude",
    models: ["claude-3.5-sonnet", "claude-3.7-sonnet", "claude-3.5-haiku"],
  },
  {
    name: "GPT",
    models: ["gpt-4.1", "gpt-4o", "gpt-4.5-preview"],
  },
  {
    name: "Other",
    models: [
      "o4-mini",
      "o3-mini",
      "o1-mini",
      "cursor-small",
      "deepseek-r1",
      "deepseek-v3",
      "gemini-2.0-flash",
      "gemini-2.0-flash-thinking-exp",
    ],
  },
]

export function AIModelSelector({ onModelSelect, selectedModel, className }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors", className)}
      >
        <span className="opacity-70">Agent</span>
        <span className="text-[10px] opacity-50 ml-1">Ctrl+J</span>
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-1">
            <div className="flex flex-col">
              <button
                className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a2a] rounded-sm"
                onClick={() => {
                  onModelSelect("Agent")
                  setIsOpen(false)
                }}
              >
                Agent
                {selectedModel === "Agent" && <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a2a] rounded-sm"
                onClick={() => {
                  onModelSelect("Ask")
                  setIsOpen(false)
                }}
              >
                Ask
                {selectedModel === "Ask" && <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-300 hover:bg-[#2a2a2a] rounded-sm"
                onClick={() => {
                  onModelSelect("Manual")
                  setIsOpen(false)
                }}
              >
                Manual
                {selectedModel === "Manual" && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
