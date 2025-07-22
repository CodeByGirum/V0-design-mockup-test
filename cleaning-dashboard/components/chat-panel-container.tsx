/**
 * Purpose: Container for the chat panel with positioning and animation
 * Features: Handles positioning, animations, and rendering of the chat panel
 * Used in: Main dashboard component
 */

"use client"

import type React from "react"

import { motion } from "framer-motion"
import { ChatPanel } from "./chat-panel"
import type { DockPosition, Message } from "../types"

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
  if (!show) return null

  // Animation variants for chat panels
  const chatVariants = {
    left: {
      initial: { x: -300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 },
    },
    right: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 300, opacity: 0 },
    },
    bottom: {
      initial: { y: 300, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 300, opacity: 0 },
    },
  }

  const positionClasses = {
    left: "border-r border-[#2a2a2a] slide-in-left",
    right: "border-l border-[#2a2a2a] slide-in-right",
    bottom: "border-t border-[#2a2a2a] slide-in-bottom",
  }

  return (
    <motion.div
      ref={chatRef}
      variants={chatVariants[dockPosition]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className={`flex flex-col transition-all duration-300 ease-in-out relative resize-transition ${positionClasses[dockPosition]}`}
      style={dockPosition === "bottom" ? { height: `${height}px` } : { width: `${width}px` }}
    >
      <ChatPanel
        onClose={onClose}
        onDockChange={onDockChange}
        dockPosition={dockPosition}
        chatRef={chatRef}
        chatHeaderRef={chatHeaderRef}
        resizeHandleRef={resizeHandleRef}
        messages={messages}
        setMessages={setMessages}
      />
    </motion.div>
  )
}
