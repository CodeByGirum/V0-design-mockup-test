"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, PanelLeft } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { ChatPanel, type Message } from "@/components/chat-panel"
import { DashboardSidebar } from "@/cleaning-dashboard/components/dashboard-sidebar"
import { CleaningActions } from "@/cleaning-dashboard/components/cleaning-actions"
import { DataTable } from "@/cleaning-dashboard/components/data-table"
import { DockIndicators } from "@/cleaning-dashboard/components/dock-indicators"
import { QueryHistory } from "@/cleaning-dashboard/components/query-history"
import { sampleData } from "@/cleaning-dashboard/data/sample-data"
import { cn } from "@/lib/utils"

type DockPosition = "right" | "left" | "bottom"

export default function CleaningWorkstation({ params }: { params: { id: string } }) {
  const { transitionType, transitionDuration } = useTransition()

  const [showChat, setShowChat] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [dockPosition, setDockPosition] = useState<DockPosition>("right")
  const [chatWidth, setChatWidth] = useState(400)
  const [chatHeight, setChatHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dockIndicator, setDockIndicator] = useState<DockPosition | null>(null)

  const chatRef = useRef<HTMLDivElement>(null)
  const chatHeaderRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(20)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! Would you please help me clean my data?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000),
      type: "text",
    },
    {
      id: "2",
      content: "I've identified some issues. You can use the cleaning actions above or ask me to execute a query.",
      sender: "assistant",
      timestamp: new Date(Date.now() - 30000),
      type: "text",
    },
  ])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        if (dockPosition === "right") setChatWidth(window.innerWidth - e.clientX)
        if (dockPosition === "left") setChatWidth(e.clientX)
        if (dockPosition === "bottom") setChatHeight(window.innerHeight - e.clientY)
      }
      if (isDragging) {
        const { clientX, clientY } = e
        const threshold = 100
        if (clientX < threshold) setDockIndicator("left")
        else if (window.innerWidth - clientX < threshold) setDockIndicator("right")
        else if (window.innerHeight - clientY < threshold) setDockIndicator("bottom")
        else setDockIndicator(null)
      }
    }

    const handleMouseUp = () => {
      if (isDragging && dockIndicator) {
        setDockPosition(dockIndicator)
      }
      setIsDragging(false)
      setIsResizing(false)
      setDockIndicator(null)
      document.body.style.cursor = ""
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dockIndicator, dockPosition])

  const handleCleaningAction = (actionId: string, actionLabel: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Apply action: ${actionLabel}`,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }
    setMessages((prev) => [...prev, userMessage])
  }

  const chatPanel = (
    <AnimatePresence>
      {showChat && (
        <motion.div
          ref={chatRef}
          layout
          initial={{ opacity: 0, x: dockPosition === "right" ? 100 : 0, y: dockPosition === "bottom" ? 100 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: dockPosition === "right" ? 100 : 0, y: dockPosition === "bottom" ? 100 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("flex flex-col relative bg-[#121212]", {
            "border-l border-[#2a2a2a]": dockPosition === "right",
            "border-r border-[#2a2a2a]": dockPosition === "left",
            "border-t border-[#2a2a2a]": dockPosition === "bottom",
          })}
          style={dockPosition === "bottom" ? { height: chatHeight } : { width: chatWidth }}
        >
          <ChatPanel
            onClose={() => setShowChat(false)}
            onDockChange={setDockPosition}
            dockPosition={dockPosition}
            chatRef={chatRef}
            chatHeaderRef={chatHeaderRef}
            resizeHandleRef={resizeHandleRef}
            messages={messages}
            setMessages={setMessages}
            setIsDragging={setIsDragging}
            setIsResizing={setIsResizing}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
        <header className="border-b border-[#2a2a2a] px-6 py-3 flex-shrink-0 flex justify-between items-center z-20">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${params.id}`}
              className="text-gray-400 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Project
            </Link>
            <span className="text-gray-600">|</span>
            <h1 className="text-sm font-medium">Data Cleaning Workstation</h1>
          </div>
          <div className="flex items-center gap-2">
            <QueryHistory />
            <button
              onClick={() => setShowChat(!showChat)}
              title={showChat ? "Hide Chat" : "Show Chat"}
              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
            >
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Show Sidebar" : "Collapse Sidebar"}
              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
            >
              <PanelLeft className="h-4 w-4 text-gray-400" />
            </button>
            <div className="bg-[#2a2a2a] rounded-full w-8 h-8 flex items-center justify-center ml-2">
              <span className="text-white text-sm">👤</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {sidebarCollapsed && <DashboardSidebar.ToggleButton onClick={() => setSidebarCollapsed(false)} />}
          <DashboardSidebar sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

          <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
            <CleaningActions onActionClick={handleCleaningAction} />
            <div className={`flex-1 flex ${dockPosition === "bottom" ? "flex-col" : "flex-row"}`}>
              {dockPosition === "left" && chatPanel}
              <div className="flex-1 flex flex-col bg-[#1a1a1a]">
                <DataTable
                  data={sampleData}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  entriesPerPage={entriesPerPage}
                  setEntriesPerPage={setEntriesPerPage}
                />
              </div>
              {dockPosition === "right" && chatPanel}
            </div>
            {dockPosition === "bottom" && chatPanel}
          </main>
        </div>
        <DockIndicators isDragging={isDragging} dockIndicator={dockIndicator} />
      </div>
    </AdvancedPageTransition>
  )
}
