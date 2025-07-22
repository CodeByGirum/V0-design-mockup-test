/**
 * Purpose: Input field for adding context to the chat
 * Features: Expandable input field, keyboard shortcuts
 * Used in: ChatPanel component
 */

"use client"

import { useState } from "react"

interface ContextInputProps {
  onAddContext: (context: string) => void
  className?: string
}

export function ContextInput({ onAddContext, className }: ContextInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [context, setContext] = useState("")

  const handleAddContext = () => {
    if (context.trim()) {
      onAddContext(context)
      setContext("")
      setIsExpanded(false)
    }
  }

  return (
    <div className={`${className}`}>
      {isExpanded ? (
        <div className="relative bg-[#121212] rounded-lg border border-[#2a2a2a] transition-all hover:border-gray-500 mb-2">
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context"
            className="w-full bg-transparent py-2 px-3 text-xs text-gray-300 focus:outline-none transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddContext()
              } else if (e.key === "Escape") {
                setIsExpanded(false)
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400 mb-2"
        >
          <span>+ Add context</span>
        </button>
      )}
    </div>
  )
}
