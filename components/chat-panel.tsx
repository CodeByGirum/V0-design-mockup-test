"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { ChatInput } from "./chat-input"
import { ContextInput } from "./context-input"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

type ChatPanelProps = {
  onClose: () => void
  onDockChange: (position: "left" | "right" | "bottom") => void
  dockPosition: "left" | "right" | "bottom"
  chatRef: React.RefObject<HTMLDivElement>
  chatHeaderRef: React.RefObject<HTMLDivElement>
  resizeHandleRef: React.RefObject<HTMLDivElement>
}

export function ChatPanel({
  onClose,
  onDockChange,
  dockPosition,
  chatRef,
  chatHeaderRef,
  resizeHandleRef,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! Would you please help me clean my data?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content:
        'The actions taken will significantly clean the dataset by removing rows with null values, invalid formats, and duplicate entries across critical columns such as "Category", "Email", "Join Date", "Rating", "Age", and "Salary". This will enhance the quality and reliability of the data for further analysis.\n\nWould you like me to proceed with the cleaning operations?',
      sender: "assistant",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you clean that data right away. Let me analyze the issues first.",
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleAddContext = (context: string) => {
    console.log("Context added:", context)
    // Handle adding context to the conversation
  }

  return (
    <>
      <div ref={chatHeaderRef} className="border-b border-[#2a2a2a] p-3 flex justify-between items-center cursor-move">
        <h3 className="text-sm font-medium">Chat</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-[#1a1a1a] rounded-md mr-1">
            <button
              className={`p-1 rounded-l-md ${dockPosition === "left" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
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
              className={`p-1 ${dockPosition === "bottom" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
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
              className={`p-1 rounded-r-md ${dockPosition === "right" ? "bg-[#2a2a2a] text-white" : "text-gray-400 hover:text-white"} transition-colors`}
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
          <button className="text-gray-400 hover:text-white transition-colors" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <ContextInput onAddContext={handleAddContext} className="mb-4" />

        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col">
              <div
                className={`${
                  message.sender === "user" ? "bg-[#1a1a1a]" : "bg-[#2a2a2a]"
                } rounded-lg p-3 text-xs scale-in`}
              >
                <p className="text-gray-300 whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-gray-500 text-xs mt-1">
                {message.sender === "user" ? "You" : "Sweepo Assistant"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 pb-5 pt-2 mb-8 relative z-10">
        <ChatInput onSendMessage={handleSendMessage} className="relative z-20" />
        {/* Gradient overlay to create seamless transition */}
        <div
          className="absolute left-0 right-0 bottom-full h-8 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none"
          style={{ zIndex: 10 }}
        ></div>
      </div>

      {/* Resize handle */}
      <div
        className={`resize-handle absolute ${
          dockPosition === "left"
            ? "top-0 right-0 w-1 h-full cursor-ew-resize"
            : dockPosition === "right"
              ? "top-0 left-0 w-1 h-full cursor-ew-resize"
              : "top-0 left-0 w-full h-1 cursor-ns-resize"
        } bg-[#2a2a2a] hover:bg-blue-500 opacity-0 hover:opacity-100 transition-opacity`}
        title="Drag to resize"
        ref={resizeHandleRef}
      ></div>
    </>
  )
}
