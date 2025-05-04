"use client"

import { useEffect, useRef } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type ModelMenuProps = {
  isOpen: boolean
  onClose: () => void
  onModelSelect: (model: string) => void
  selectedModel: string
}

const modelGroups = [
  {
    name: "Options",
    models: ["Auto-select", "Thinking"],
  },
  {
    name: "Claude",
    models: ["claude-3.5-sonnet", "claude-3.7-sonnet", "claude-3.5-haiku"],
  },
  {
    name: "GPT",
    models: ["gpt-4.1", "gpt-4o", "o4-mini"],
  },
  {
    name: "Other",
    models: [
      "o3-mini",
      "cursor-small",
      "deepseek-r1",
      "o1-mini",
      "deepseek-v3",
      "gemini-2.0-flash",
      "gemini-2.0-flash-thinking-exp",
      "gpt-4.5-preview",
    ],
  },
]

export function ModelMenu({ isOpen, onClose, onModelSelect, selectedModel }: ModelMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-1 w-56 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <div className="p-1 text-xs text-gray-300">
        <div className="px-2 py-1 text-[10px] text-gray-500">Ctrl+J for model menu</div>

        {modelGroups.map((group, groupIndex) => (
          <div key={group.name} className={cn(groupIndex > 0 && "mt-1")}>
            {group.models.map((model) => (
              <button
                key={model}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-1.5 text-left rounded-sm",
                  selectedModel === model ? "bg-[#2a2a2a]" : "hover:bg-[#2a2a2a]",
                )}
                onClick={() => {
                  onModelSelect(model)
                  onClose()
                }}
              >
                <span>{model}</span>
                {selectedModel === model && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
