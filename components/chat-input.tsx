"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { Paperclip } from "lucide-react"
import { ModelMenu } from "./model-menu"

type ChatInputProps = {
  onSendMessage: (message: string) => void
  className?: string
}

export function ChatInput({ onSendMessage, className }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("claude-3.5-sonnet")
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false)
  const [isAutoMode, setIsAutoMode] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // Ctrl+J to open model menu
    if (e.key === "j" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setIsModelMenuOpen(!isModelMenuOpen)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-[#121212] rounded-lg border border-[#2a2a2a] transition-all hover:border-gray-500">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask, search, build anything"
          className="w-full bg-transparent py-3 pl-4 pr-24 text-xs text-gray-300 focus:outline-none transition-colors resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
          rows={1}
        />

        <div className="absolute left-3 top-[calc(100%+8px)] flex items-center gap-2">
          <div className="flex items-center">
            <button
              onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <span className="opacity-70">∞ Agent</span>
              <span className="text-[10px] opacity-50 ml-1">Ctrl+J</span>
            </button>

            <ModelMenu
              isOpen={isModelMenuOpen}
              onClose={() => setIsModelMenuOpen(false)}
              onModelSelect={setSelectedModel}
              selectedModel={selectedModel}
            />

            <span className="mx-1 text-gray-600">•</span>

            <button
              onClick={() => setIsAutoMode(!isAutoMode)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Auto
            </button>
          </div>
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-300 transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            className={`${message.trim() ? "text-white" : "text-gray-500"} hover:text-white bg-[#1e1e1e] rounded-md p-1.5 transition-colors`}
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform rotate-270"
            >
              <path
                d="M2 8H12M12 8L8 4M12 8L8 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeLinejoin="bevel"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
