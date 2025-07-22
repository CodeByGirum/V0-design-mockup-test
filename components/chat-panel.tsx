"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { ChatInput } from "./chat-input"
import { ContextInput } from "./context-input"
import { EmbeddedSqlPreview } from "@/cleaning-dashboard/components/embedded-sql-preview"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  sql?: string
  queryTitle?: string
}

type ChatPanelProps = {
  onClose: () => void
  onDockChange: (position: "left" | "right" | "bottom") => void
  dockPosition: "left" | "right" | "bottom"
  chatRef: React.RefObject<HTMLDivElement>
  chatHeaderRef: React.RefObject<HTMLDivElement>
  resizeHandleRef: React.RefObject<HTMLDivElement>
  messages: Message[]
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void
  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
}

export function ChatPanel({
  onClose,
  onDockChange,
  dockPosition,
  chatRef,
  chatHeaderRef,
  resizeHandleRef,
  messages,
  setMessages,
  setIsDragging,
  setIsResizing,
}: ChatPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])

    // Simulate assistant response
    setTimeout(() => {
      const lowerCaseContent = content.toLowerCase()
      if (lowerCaseContent.includes("sql")) {
        const assistantSqlMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Here is the SQL query we just ran:", // The intro text
          queryTitle: "Get daily user signups and 7-day trend", // The title for the component
          sql: `SELECT
  date_trunc('day', created_at) AS signup_date,
  COUNT(*) AS daily_signups,
  ROUND(
    AVG(COUNT(*)) OVER (
      ORDER BY
        date_trunc('day', created_at) ROWS BETWEEN 6 PRECEDING
        AND CURRENT ROW
    ),
    2
  ) AS seven_day_avg
FROM
  public.customers
GROUP BY
  signup_date;`,
        }
        setMessages((prev) => [...prev, assistantSqlMessage])
      } else {
        const assistantTextMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I've processed your request. Let me know what else you need!",
        }
        setMessages((prev) => [...prev, assistantTextMessage])
      }
    }, 1000)
  }

  const handleAddContext = (context: string) => {
    console.log("Context added:", context)
  }

  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return
    setIsDragging(true)
  }

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsResizing(true)
  }

  return (
    <>
      <div
        ref={chatHeaderRef}
        className="border-b border-neutral-800 p-3 flex justify-between items-center cursor-move"
        onMouseDown={handleHeaderMouseDown}
      >
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-900 rounded-md mr-1">
            <button
              className={`p-1 rounded-l-md ${
                dockPosition === "left" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
              } transition-colors`}
              onClick={() => onDockChange("left")}
              title="Dock to left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
              </svg>
            </button>
            <button
              className={`p-1 ${
                dockPosition === "bottom" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
              } transition-colors`}
              onClick={() => onDockChange("bottom")}
              title="Dock to bottom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="15" x2="21" y2="15"></line>
              </svg>
            </button>
            <button
              className={`p-1 rounded-r-md ${
                dockPosition === "right" ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
              } transition-colors`}
              onClick={() => onDockChange("right")}
              title="Dock to right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
            </button>
          </div>
          <button className="text-neutral-400 hover:text-white transition-colors" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollAreaRef} className="flex-1 p-3 overflow-y-auto">
        <ContextInput onAddContext={handleAddContext} className="mb-4" />

        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                {message.role === "assistant" && (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {message.content && <p className="text-sm text-neutral-300 mb-1">{message.content}</p>}
                {message.sql && message.queryTitle && (
                  <EmbeddedSqlPreview title={message.queryTitle} sqlContent={message.sql} />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-4 pb-5 pt-2 mb-8 relative z-10">
        <ChatInput onSendMessage={handleSendMessage} className="relative z-20" />
        <div
          className="absolute left-0 right-0 bottom-full h-8 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"
          style={{ zIndex: 10 }}
        ></div>
      </div>

      <div
        ref={resizeHandleRef}
        className={cn(
          "resize-handle absolute bg-neutral-700 hover:bg-blue-500 opacity-0 hover:opacity-100 transition-opacity",
          {
            "top-0 right-0 w-1 h-full cursor-ew-resize": dockPosition === "left",
            "top-0 left-0 w-1 h-full cursor-ew-resize": dockPosition === "right",
            "top-0 left-0 w-full h-1 cursor-ns-resize": dockPosition === "bottom",
          },
        )}
        title="Drag to resize"
        onMouseDown={handleResizeMouseDown}
      ></div>
    </>
  )
}
