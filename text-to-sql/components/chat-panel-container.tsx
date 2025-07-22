/**
 * Purpose: Container for the chat panel with positioning and resizing
 * Features: Draggable, resizable, and dockable chat panel
 * Used in: Main workstation component
 */

"use client"

import type React from "react"

import { useState } from "react"
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatPanel } from "./chat-panel"
import type { Message, DockPosition } from "../types"

interface ChatPanelContainerProps {
  show: boolean
  dockPosition: DockPosition
  width?: number
  height?: number
  chatRef: React.RefObject<HTMLDivElement>
  chatHeaderRef: React.RefObject<HTMLDivElement>
  resizeHandleRef: React.RefObject<HTMLDivElement>
  onClose: () => void
  onDockChange: (position: DockPosition) => void
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export function ChatPanelContainer({
  show,
  dockPosition,
  width = 300,
  height = 300,
  chatRef,
  chatHeaderRef,
  resizeHandleRef,
  onClose,
  onDockChange,
  messages,
  setMessages,
}: ChatPanelContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [prevDimensions, setPrevDimensions] = useState({ width, height })

  // Determine style based on dock position
  const getPanelStyle = () => {
    if (isExpanded) {
      return {
        width: dockPosition === "bottom" ? "100%" : "50%",
        height: dockPosition === "bottom" ? "50%" : "100%",
      }
    }

    if (dockPosition === "left" || dockPosition === "right") {
      return { width: `${width}px`, height: "100%" }
    } else {
      return { width: "100%", height: `${height}px` }
    }
  }

  // Get resize handle position
  const getResizeHandlePosition = () => {
    if (dockPosition === "left") return "right"
    if (dockPosition === "right") return "left"
    return "top"
  }

  // Toggle expanded state
  const toggleExpand = () => {
    if (!isExpanded) {
      setPrevDimensions({ width, height })
    }
    setIsExpanded(!isExpanded)
  }

  // Get dock position icons
  const getDockIcons = () => {
    return (
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 text-gray-400 hover:text-white ${dockPosition === "left" ? "text-white bg-[#2a2a2a]" : ""}`}
          onClick={() => onDockChange("left")}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 text-gray-400 hover:text-white ${dockPosition === "right" ? "text-white bg-[#2a2a2a]" : ""}`}
          onClick={() => onDockChange("right")}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 text-gray-400 hover:text-white ${dockPosition === "bottom" ? "text-white bg-[#2a2a2a]" : ""}`}
          onClick={() => onDockChange("bottom")}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  if (!show) return null

  return (
    <div
      ref={chatRef}
      className={`flex flex-col bg-[#121212] border-[#2a2a2a] ${
        dockPosition === "left" ? "border-r" : dockPosition === "right" ? "border-l" : "border-t"
      }`}
      style={getPanelStyle()}
    >
      {/* Chat Header */}
      <div
        ref={chatHeaderRef}
        className="flex items-center justify-between p-2 border-b border-[#2a2a2a] bg-[#1a1a1a] cursor-move"
      >
        <div className="flex items-center">
          <span className="text-xs font-medium text-white">AI Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          {getDockIcons()}
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={toggleExpand}>
            {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel messages={messages} setMessages={setMessages} />
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeHandleRef}
        className={`absolute ${
          getResizeHandlePosition() === "left"
            ? "left-0 top-0 w-1 h-full cursor-ew-resize"
            : getResizeHandlePosition() === "right"
              ? "right-0 top-0 w-1 h-full cursor-ew-resize"
              : "left-0 top-0 w-full h-1 cursor-ns-resize"
        } bg-transparent hover:bg-blue-500 transition-colors z-10`}
      />
    </div>
  )
}
