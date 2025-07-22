/**
 * Purpose: Input area for natural language queries and SQL display
 * Features: Text input, SQL code display, execution controls, template selection
 * Used in: Main workstation component
 */

"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface QueryInputProps {
  onQuerySubmit: (query: string) => void
  isExecuting: boolean
  generatedSQL: string
}

export function QueryInput({ onQuerySubmit, isExecuting, generatedSQL }: QueryInputProps) {
  const [query, setQuery] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (query.trim()) {
        onQuerySubmit(query.trim())
        setQuery("")
      }
    }
  }

  const handleSubmit = () => {
    if (query.trim()) {
      onQuerySubmit(query.trim())
      setQuery("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSQL)
  }

  // Handle template selection
  const handleTemplateSelect = (sql: string, naturalLanguage: string) => {
    // Set the natural language query
    setQuery(naturalLanguage)

    // Auto-submit the query
    onQuerySubmit(naturalLanguage)
  }

  return null
}
