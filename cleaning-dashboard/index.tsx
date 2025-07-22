/**
 * Purpose: Main entry point for the Cleaning Dashboard
 * Features: Combines all dashboard components into a complete UI
 * Used in: Can be imported and used in any page
 * Notes: This component orchestrates all the cleaning dashboard functionality
 */

"use client"

import { useState, useRef } from "react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardFooter } from "./components/dashboard-footer"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { CleaningActions } from "./components/cleaning-actions"
import { DataTable } from "./components/data-table"
import { ChatPanelContainer } from "./components/chat-panel-container"
import { DockIndicators } from "./components/dock-indicators"
import { sampleData } from "./data/sample-data"
import type { Message, DockPosition } from "./types"

export function CleaningDashboard() {
  // Get transition settings from context
  const { transitionType, transitionDuration } = useTransition()

  // State for UI components
  const [showChat, setShowChat] = useState(true)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(20)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatWidth, setChatWidth] = useState(300)
  const [chatHeight, setChatHeight] = useState(300)
  const [dockPosition, setDockPosition] = useState<DockPosition>("right")

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Resizing state
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 })
  const [resizeStartDimensions, setResizeStartDimensions] = useState({ width: 0, height: 0 })

  // Visual indicators for docking
  const [dockIndicator, setDockIndicator] = useState<DockPosition | null>(null)

  // Refs for DOM elements
  const chatRef = useRef<HTMLDivElement>(null)
  const chatHeaderRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  // Chat messages
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

  // Handle cleaning action click
  const handleCleaningAction = (actionId: string, actionLabel: string) => {
    // Create a message describing the action
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Apply action: ${actionLabel}`,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])

    // Create appropriate response based on action type
    let responseContent = ""

    switch (actionId) {
      case "null-category":
        responseContent = "I've removed all rows with null values in the Category column. 8 rows were affected."
        break
      case "invalid-email":
        responseContent = "I've removed all rows with invalid email formats. 3 rows were affected."
        break
      case "duplicate-email":
        responseContent =
          "I've removed duplicate email entries, keeping only the first occurrence. 2 rows were affected."
        break
      case "invalid-date-separator":
      case "invalid-date-components":
        responseContent = "I've removed rows with invalid date formats in the Join Date column. 2 rows were affected."
        break
      case "negative-ratings":
        responseContent =
          "I've removed rows with negative ratings. No rows were affected as there were no negative ratings."
        break
      case "null-age":
        responseContent = "I've removed all rows with null values in the Age column. 2 rows were affected."
        break
      case "null-salary":
        responseContent = "I've removed all rows with null values in the Salary column. 2 rows were affected."
        break
      case "undo":
        responseContent = "I've undone all cleaning actions. The dataset has been restored to its original state."
        break
      default:
        responseContent = "I've applied the selected cleaning action. The dataset has been updated."
    }

    // Add assistant response after a short delay to simulate processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show chat if it's hidden
      if (!showChat) {
        setShowChat(true)
      }
    }, 500)
  }

  // Function to show dock indicators while dragging
  const showDockIndicator = (e: MouseEvent) => {
    if (!isDragging) return null

    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    const posX = e.clientX - dragOffset.x
    const posY = e.clientY - dragOffset.y

    // Define threshold for edge detection (pixels from edge)
    const threshold = 100

    if (posX < threshold) {
      return "left"
    } else if (windowWidth - (posX + chatWidth) < threshold) {
      return "right"
    } else if (windowHeight - (posY + chatHeight) < threshold) {
      return "bottom"
    }

    return null
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        {/* Header */}
        <DashboardHeader sidebarCollapsed={sidebarCollapsed} />

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar Toggle Button (visible when sidebar is collapsed) */}
          {sidebarCollapsed && <DashboardSidebar.ToggleButton onClick={() => setSidebarCollapsed(false)} />}

          {/* Sidebar */}
          <DashboardSidebar
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            issueCount={{
              null_value: sampleData.filter((row) => row.issues.includes("null_value")).length,
              invalid_format: sampleData.filter((row) => row.issues.includes("invalid_format")).length,
              invalid_date: sampleData.filter((row) => row.issues.includes("invalid_date")).length,
              duplicate_value: sampleData.filter((row) => row.issues.includes("duplicate_value")).length,
              negative_rating: sampleData.filter((row) => row.issues.includes("negative_rating")).length,
            }}
          />

          {/* Main Content Area with dynamic layout based on chat position */}
          <div className="flex-1 flex flex-col">
            {/* Cleaning Actions */}
            <CleaningActions onActionClick={handleCleaningAction} />

            {/* Main Content with dynamic layout based on chat position */}
            <div
              className={`flex-1 ${dockPosition === "bottom" ? "flex flex-col" : "flex flex-row"}`}
              ref={mainContentRef}
            >
              {/* Left Chat Panel (when docked to left) */}
              <ChatPanelContainer
                show={showChat && dockPosition === "left"}
                dockPosition="left"
                width={chatWidth}
                chatRef={chatRef}
                chatHeaderRef={chatHeaderRef}
                resizeHandleRef={resizeHandleRef}
                onClose={() => setShowChat(false)}
                onDockChange={setDockPosition}
                messages={messages}
                setMessages={setMessages}
              />

              {/* Data Table Section */}
              <DataTable
                data={sampleData}
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
                entriesPerPage={entriesPerPage}
                setEntriesPerPage={setEntriesPerPage}
                showChat={showChat}
                setShowChat={setShowChat}
                setSidebarCollapsed={setSidebarCollapsed}
                sidebarCollapsed={sidebarCollapsed}
              />

              {/* Right Chat Panel (when docked to right) */}
              <ChatPanelContainer
                show={showChat && dockPosition === "right"}
                dockPosition="right"
                width={chatWidth}
                chatRef={chatRef}
                chatHeaderRef={chatHeaderRef}
                resizeHandleRef={resizeHandleRef}
                onClose={() => setShowChat(false)}
                onDockChange={setDockPosition}
                messages={messages}
                setMessages={setMessages}
              />
            </div>

            {/* Bottom Chat Panel (when docked to bottom) */}
            <ChatPanelContainer
              show={showChat && dockPosition === "bottom"}
              dockPosition="bottom"
              height={chatHeight}
              chatRef={chatRef}
              chatHeaderRef={chatHeaderRef}
              resizeHandleRef={resizeHandleRef}
              onClose={() => setShowChat(false)}
              onDockChange={setDockPosition}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>

        {/* Dock indicators */}
        <DockIndicators isDragging={isDragging} dockIndicator={dockIndicator} />

        {/* Footer */}
        <DashboardFooter />
      </div>
    </AdvancedPageTransition>
  )
}
