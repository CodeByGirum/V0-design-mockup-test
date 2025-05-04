"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  FileText,
  Filter,
  MessageSquare,
  PanelLeft,
  Search,
  Settings,
  Undo2,
  X,
} from "lucide-react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { motion } from "framer-motion"
import { ChatPanel } from "@/components/chat-panel"

type DockPosition = "right" | "left" | "bottom" | "none"

export default function CleaningWorkstation({ params }: { params: { id: string } }) {
  // Get transition settings from context
  const { transitionType, transitionDuration } = useTransition()

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

  const chatRef = useRef<HTMLDivElement>(null)
  const chatHeaderRef = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

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

  // Handle chat header dragging
  useEffect(() => {
    const chatHeader = chatHeaderRef.current
    if (!chatHeader) return

    const handleMouseDown = (e: MouseEvent) => {
      // Only start dragging if clicking on the header (not buttons)
      if ((e.target as HTMLElement).closest("button")) return

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })

      // Calculate offset from the edges of the screen
      const rect = chatRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }

      document.body.style.cursor = "move"
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      // Calculate distance moved
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      // Determine if we're dragging significantly in a direction
      const dragDistance = Math.max(Math.abs(deltaX), Math.abs(deltaY))

      // Show dock indicators while dragging
      setDockIndicator(showDockIndicator(e))

      if (dragDistance > 50) {
        // Determine which edge we're closest to
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        const posX = e.clientX - dragOffset.x
        const posY = e.clientY - dragOffset.y

        const distToRight = windowWidth - (posX + chatWidth)
        const distToLeft = posX
        const distToBottom = windowHeight - (posY + chatHeight)

        // Find the minimum distance
        const minDist = Math.min(distToRight, distToLeft, distToBottom)

        // Set dock position based on closest edge
        if (minDist === distToRight) {
          setDockPosition("right")
        } else if (minDist === distToLeft) {
          setDockPosition("left")
        } else if (minDist === distToBottom) {
          setDockPosition("bottom")
        }

        // End dragging once we've determined a dock position
        setIsDragging(false)
        setDockIndicator(null)
        document.body.style.removeProperty("cursor")
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        setDockIndicator(null)
        document.body.style.removeProperty("cursor")
      }
    }

    chatHeader.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      chatHeader.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart, chatWidth, chatHeight, dragOffset])

  // Handle resize functionality
  useEffect(() => {
    const handleResizeMouseDown = (e: MouseEvent) => {
      // Check if the click is on a resize handle
      const target = e.target as HTMLElement
      if (!target.classList.contains("resize-handle")) return

      e.preventDefault()
      e.stopPropagation()

      setIsResizing(true)
      setResizeStart({ x: e.clientX, y: e.clientY })
      setResizeStartDimensions({ width: chatWidth, height: chatHeight })

      document.body.style.cursor = dockPosition === "left" || dockPosition === "right" ? "ew-resize" : "ns-resize"
    }

    const handleResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      if (dockPosition === "left") {
        // When docked left, dragging right increases width
        const newWidth = Math.max(200, Math.min(600, resizeStartDimensions.width + deltaX))
        setChatWidth(newWidth)
      } else if (dockPosition === "right") {
        // When docked right, dragging left increases width
        const newWidth = Math.max(200, Math.min(600, resizeStartDimensions.width - deltaX))
        setChatWidth(newWidth)
      } else if (dockPosition === "bottom") {
        // When docked bottom, dragging up increases height
        const newHeight = Math.max(150, Math.min(500, resizeStartDimensions.height - deltaY))
        setChatHeight(newHeight)
      }
    }

    const handleResizeMouseUp = () => {
      if (isResizing) {
        setIsResizing(false)
        document.body.style.removeProperty("cursor")
      }
    }

    document.addEventListener("mousedown", handleResizeMouseDown)
    document.addEventListener("mousemove", handleResizeMouseMove)
    document.addEventListener("mouseup", handleResizeMouseUp)

    return () => {
      document.removeEventListener("mousedown", handleResizeMouseDown)
      document.removeEventListener("mousemove", handleResizeMouseMove)
      document.removeEventListener("mouseup", handleResizeMouseUp)
    }
  }, [isResizing, resizeStart, resizeStartDimensions, dockPosition, chatWidth, chatHeight])

  // Sample data with various issues
  const data = [
    {
      id: 1,
      name: "User_1",
      age: 58,
      salary: 51319,
      email: "user1@example.com",
      joinDate: "2021-09-13",
      category: "C",
      score: 88,
      rating: 1.1,
      originalRowIndex: 0,
      issues: [],
    },
    {
      id: 2,
      name: "User_2",
      age: 25,
      salary: 78520,
      email: "user2@example.com",
      joinDate: "2022-09-16",
      category: null,
      score: 19,
      rating: 3.2,
      originalRowIndex: 1,
      issues: ["null_value"],
    },
    {
      id: 3,
      name: "User_3",
      age: 19,
      salary: 76566,
      email: "user3@example.com",
      joinDate: "2021-06-15",
      category: "A",
      score: 90,
      rating: 5,
      originalRowIndex: 2,
      issues: [],
    },
    {
      id: 4,
      name: "User_4",
      age: 45,
      salary: 57460,
      email: "user4@example.com",
      joinDate: "2020-06-25",
      category: null,
      score: 27,
      rating: 2.4,
      originalRowIndex: 3,
      issues: ["null_value"],
    },
    {
      id: 5,
      name: "User_5",
      age: 35,
      salary: 117841,
      email: "user5@example.com",
      joinDate: "2020-02-21",
      category: "B",
      score: 999,
      rating: 3.6,
      originalRowIndex: 4,
      issues: [],
    },
    {
      id: 6,
      name: "User_6",
      age: 33,
      salary: 64993,
      email: "invalid_email",
      joinDate: "2022-04-11",
      category: "C",
      score: 8,
      rating: 4.1,
      originalRowIndex: 5,
      issues: ["invalid_format"],
    },
    {
      id: 7,
      name: "User_7",
      age: null,
      salary: 115093,
      email: "user7@example.com",
      joinDate: "2021-02-12",
      category: "A",
      score: 53,
      rating: 3.6,
      originalRowIndex: 6,
      issues: ["null_value"],
    },
    {
      id: 8,
      name: "User_8",
      age: 32,
      salary: null,
      email: "user8@example.com",
      joinDate: "2023-02-27",
      category: null,
      score: 52,
      rating: 4,
      originalRowIndex: 7,
      issues: ["null_value"],
    },
    {
      id: 9,
      name: "User_9",
      age: 26,
      salary: 114939,
      email: "user9@example.com",
      joinDate: "invalid_date",
      category: "A",
      score: 42,
      rating: 4.8,
      originalRowIndex: 8,
      issues: ["invalid_date"],
    },
    {
      id: 10,
      name: "User_10",
      age: 55,
      salary: 39258,
      email: "user10@example.com",
      joinDate: "2021-03-25",
      category: "B",
      score: 999,
      rating: 2.7,
      originalRowIndex: 9,
      issues: [],
    },
    {
      id: 11,
      name: "User_11",
      age: 24,
      salary: 109840,
      email: "user11@example.com",
      joinDate: "2021-05-26",
      category: "C",
      score: 69,
      rating: 1.1,
      originalRowIndex: 10,
      issues: [],
    },
    {
      id: 12,
      name: "User_12",
      age: 61,
      salary: 113227,
      email: "invalid_email",
      joinDate: "2023-04-27",
      category: null,
      score: 59,
      rating: 1.1,
      originalRowIndex: 11,
      issues: ["invalid_format", "null_value"],
    },
    {
      id: 13,
      name: "User_13",
      age: 65,
      salary: 52431,
      email: "user13@example.com",
      joinDate: "2021-05-22",
      category: "A",
      score: 53,
      rating: 1.6,
      originalRowIndex: 12,
      issues: [],
    },
    {
      id: 14,
      name: "User_14",
      age: null,
      salary: 100010,
      email: "user14@example.com",
      joinDate: "2022-08-26",
      category: "C",
      score: 7,
      rating: 1.5,
      originalRowIndex: 13,
      issues: ["null_value"],
    },
    {
      id: 15,
      name: "User_15",
      age: 52,
      salary: 62087,
      email: "user15@example.com",
      joinDate: "2023-02-17",
      category: "C",
      score: 999,
      rating: 3.7,
      originalRowIndex: 14,
      issues: [],
    },
    {
      id: 16,
      name: "User_16",
      age: 23,
      salary: null,
      email: "user16@example.com",
      joinDate: "2021-02-20",
      category: "A",
      score: 26,
      rating: 3.8,
      originalRowIndex: 15,
      issues: ["null_value"],
    },
    {
      id: 17,
      name: "User_17",
      age: 55,
      salary: 51417,
      email: "user17@example.com",
      joinDate: "2020-09-17",
      category: "C",
      score: 53,
      rating: 1.9,
      originalRowIndex: 16,
      issues: [],
    },
    {
      id: 18,
      name: "User_18",
      age: 45,
      salary: 90589,
      email: "invalid_email",
      joinDate: "invalid_date",
      category: "C",
      score: 49,
      rating: 3.8,
      originalRowIndex: 17,
      issues: ["invalid_format", "invalid_date"],
    },
    {
      id: 19,
      name: "User_19",
      age: 20,
      salary: 79735,
      email: "user19@example.com",
      joinDate: "2021-01-12",
      category: null,
      score: 98,
      rating: 4.1,
      originalRowIndex: 18,
      issues: ["null_value"],
    },
    {
      id: 20,
      name: "User_20",
      age: 19,
      salary: 65382,
      email: "user20@example.com",
      joinDate: "2020-04-12",
      category: "C",
      score: 999,
      rating: 1.7,
      originalRowIndex: 19,
      issues: [],
    },
  ]

  // Count issues by type
  const issueCount = {
    null_value: data.filter((row) => row.issues.includes("null_value")).length,
    invalid_format: data.filter((row) => row.issues.includes("invalid_format")).length,
    invalid_date: data.filter((row) => row.issues.includes("invalid_date")).length,
    duplicate_value: data.filter((row) => row.issues.includes("duplicate_value")).length,
    negative_rating: data.filter((row) => row.issues.includes("negative_rating")).length,
  }

  // Get cell class based on issue type
  const getCellClass = (value: any, issueType: string | null) => {
    if (value === null || value === undefined) return "bg-blue-500/20 text-blue-300"
    if (issueType === "invalid_format") return "bg-purple-500/20 text-purple-300"
    if (issueType === "invalid_date") return "bg-orange-500/20 text-orange-300"
    if (issueType === "duplicate_value") return "bg-green-500/20 text-green-300"
    if (issueType === "negative_rating") return "bg-red-500/20 text-red-300"
    return ""
  }

  // Get row class based on issues
  const getRowClass = (row: any) => {
    if (row.issues.length > 0) {
      return "hover:bg-[#1a1a1a]"
    }
    return "hover:bg-[#1a1a1a]"
  }

  // Clean data actions
  const cleaningActions = [
    { id: "undo", label: "Undo All", icon: <Undo2 className="h-3.5 w-3.5" /> },
    { id: "null-category", label: "Remove Rows with Null Values in Category", icon: <X className="h-3.5 w-3.5" /> },
    { id: "invalid-email", label: "Remove Rows with Invalid Email Format", icon: <X className="h-3.5 w-3.5" /> },
    { id: "duplicate-email", label: "Remove Duplicate Email Entries", icon: <X className="h-3.5 w-3.5" /> },
    {
      id: "invalid-date-separator",
      label: "Remove Rows with Invalid Date Separator in Join Date",
      icon: <X className="h-3.5 w-3.5" />,
    },
    {
      id: "invalid-date-components",
      label: "Remove Rows with Invalid Date Components in Join Date",
      icon: <X className="h-3.5 w-3.5" />,
    },
    { id: "negative-ratings", label: "Remove Rows with Negative Ratings", icon: <X className="h-3.5 w-3.5" /> },
    { id: "null-age", label: "Remove Rows with Null Values in Age", icon: <X className="h-3.5 w-3.5" /> },
    { id: "null-salary", label: "Remove Rows with Null Values in Salary", icon: <X className="h-3.5 w-3.5" /> },
  ]

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

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        {/* Header */}
        <header className="border-b border-[#2a2a2a] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-medium">Sweepo</h1>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              How it works
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              About Us
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              Contact Us
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
                Signout
              </Link>
              <div className="bg-[#2a2a2a] rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs">👤</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Sidebar Toggle Button (visible when sidebar is collapsed) */}
          {sidebarCollapsed && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] border-r border-t border-b border-[#2a2a2a] p-1 rounded-r-md z-10 transition-all hover:bg-[#2a2a2a]"
              onClick={() => setSidebarCollapsed(false)}
            >
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </motion.button>
          )}

          {/* Sidebar */}
          <motion.div
            initial={{ width: sidebarCollapsed ? 0 : 224 }}
            animate={{ width: sidebarCollapsed ? 0 : 224 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${sidebarCollapsed ? "w-0 overflow-hidden" : "w-56"} border-r border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out fade-in`}
          >
            {/* Sidebar Header with Collapse Button */}
            <div className="p-3 border-b border-[#2a2a2a] flex justify-between items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                />
                <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-400" />
              </div>
              <button
                className="ml-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setSidebarCollapsed(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            {/* Datasets */}
            <div className="p-3 border-b border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium flex items-center">
                  Datasets <span className="text-gray-500 ml-1">(3)</span>
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs bg-[#2a2a2a] rounded-md px-2 py-1.5 transition-colors hover:bg-[#3a3a3a]">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-white">random_kdd_dataset.csv</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>50x50_table.csv</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>bad_data.csv</span>
                </div>
              </div>
            </div>

            {/* Issues */}
            <div className="p-3 border-b border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-medium flex items-center">
                  Issues <span className="text-gray-500 ml-1">(130)</span>
                </h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <ChevronsUpDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <span>Column Issues</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <span>Row Issues</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="p-3 mt-auto border-t border-[#2a2a2a]">
              <h3 className="text-xs font-medium mb-2">Legend</h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-blue-500/20"></div>
                  <span className="text-blue-300">Null Value</span>
                  <span className="ml-auto text-gray-500">{issueCount.null_value}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-purple-500/20"></div>
                  <span className="text-purple-300">Invalid Format</span>
                  <span className="ml-auto text-gray-500">{issueCount.invalid_format}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-orange-500/20"></div>
                  <span className="text-orange-300">Invalid Date</span>
                  <span className="ml-auto text-gray-500">{issueCount.invalid_date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-green-500/20"></div>
                  <span className="text-green-300">Duplicate Value</span>
                  <span className="ml-auto text-gray-500">{issueCount.duplicate_value}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-red-500/20"></div>
                  <span className="text-red-300">Invalid Value</span>
                  <span className="ml-auto text-gray-500">{issueCount.negative_rating}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area with dynamic layout based on chat position */}
          <div className="flex-1 flex flex-col">
            {/* Cleaning Actions */}
            <div className="border-b border-[#2a2a2a] p-2 flex items-center gap-1 overflow-x-auto slide-in-bottom">
              {cleaningActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-md py-1 px-2 text-xs whitespace-nowrap flex items-center gap-1 transition-colors"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Main Content with dynamic layout based on chat position */}
            <div
              className={`flex-1 ${dockPosition === "bottom" ? "flex flex-col" : "flex flex-row"}`}
              ref={mainContentRef}
            >
              {/* Left Chat Panel (when docked to left) */}
              {showChat && dockPosition === "left" && (
                <motion.div
                  ref={chatRef}
                  variants={chatVariants.left}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="border-r border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out relative resize-transition slide-in-left"
                  style={{ width: `${chatWidth}px` }}
                >
                  <ChatPanel
                    onClose={() => setShowChat(false)}
                    onDockChange={setDockPosition}
                    dockPosition={dockPosition}
                    chatRef={chatRef}
                    chatHeaderRef={chatHeaderRef}
                    resizeHandleRef={resizeHandleRef}
                  />
                </motion.div>
              )}

              {/* Data Table Section */}
              <div className="flex-1 flex flex-col slide-in-bottom">
                {/* Table Header */}
                <div className="flex justify-between items-center p-3 border-b border-[#2a2a2a]">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${params.id}`}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back to Project
                    </Link>
                    <span className="text-gray-600">|</span>
                    <h2 className="text-sm font-medium">Data Cleaning Workstation</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>Show:</span>
                      <select
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1 px-2 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <button
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
                      onClick={() => setShowChat(!showChat)}
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors"
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                      <PanelLeft className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                      <Filter className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                      <Settings className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                      <Download className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#1a1a1a]">
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a] w-10">
                          <input
                            type="checkbox"
                            className="rounded bg-[#2a2a2a] border-none focus:ring-0 transition-colors"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows(data.map((row) => row.id))
                              } else {
                                setSelectedRows([])
                              }
                            }}
                          />
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            ID
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Name
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Age
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Salary
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Email
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Join Date
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Category
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Score
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            Rating
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                        <th className="sticky top-0 bg-[#1a1a1a] px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                          <div className="flex items-center gap-1">
                            originalRowIndex
                            <ChevronsUpDown className="h-3 w-3 text-gray-500" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr
                          key={row.id}
                          className={`border-b border-[#2a2a2a] ${getRowClass(row)} ${row.id % 2 === 0 ? "bg-[#1a1a1a]" : ""} transition-colors`}
                          style={{ animationDelay: `${0.03 * index}s` }}
                        >
                          <td className="px-4 py-2">
                            <input
                              type="checkbox"
                              className="rounded bg-[#2a2a2a] border-none focus:ring-0 transition-colors"
                              checked={selectedRows.includes(row.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRows([...selectedRows, row.id])
                                } else {
                                  setSelectedRows(selectedRows.filter((id) => id !== row.id))
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-2 text-gray-300">{row.id}</td>
                          <td className="px-4 py-2 text-gray-300">{row.name}</td>
                          <td className={`px-4 py-2 ${getCellClass(row.age, row.age === null ? "null_value" : null)}`}>
                            {row.age === null ? "null" : row.age}
                          </td>
                          <td
                            className={`px-4 py-2 ${getCellClass(row.salary, row.salary === null ? "null_value" : null)}`}
                          >
                            {row.salary === null ? "null" : row.salary}
                          </td>
                          <td
                            className={`px-4 py-2 ${getCellClass(row.email, row.email === "invalid_email" ? "invalid_format" : null)}`}
                          >
                            {row.email}
                          </td>
                          <td
                            className={`px-4 py-2 ${getCellClass(row.joinDate, row.joinDate === "invalid_date" ? "invalid_date" : null)}`}
                          >
                            {row.joinDate}
                          </td>
                          <td
                            className={`px-4 py-2 ${getCellClass(row.category, row.category === null ? "null_value" : null)}`}
                          >
                            {row.category === null ? "null" : row.category}
                          </td>
                          <td className="px-4 py-2 text-gray-300">{row.score}</td>
                          <td className="px-4 py-2 text-gray-300">{row.rating}</td>
                          <td className="px-4 py-2 text-gray-300">{row.originalRowIndex}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-3 border-t border-[#2a2a2a] flex justify-between items-center">
                  <div className="text-xs text-gray-400">Showing 1-20 of {data.length} rows</div>
                  <div className="flex items-center gap-1">
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                      Previous
                    </button>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Chat Panel (when docked to right) */}
              {showChat && dockPosition === "right" && (
                <motion.div
                  ref={chatRef}
                  variants={chatVariants.right}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="border-l border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out relative resize-transition slide-in-right"
                  style={{ width: `${chatWidth}px` }}
                >
                  <ChatPanel
                    onClose={() => setShowChat(false)}
                    onDockChange={setDockPosition}
                    dockPosition={dockPosition}
                    chatRef={chatRef}
                    chatHeaderRef={chatHeaderRef}
                    resizeHandleRef={resizeHandleRef}
                  />
                </motion.div>
              )}
            </div>

            {/* Bottom Chat Panel (when docked to bottom) */}
            {showChat && dockPosition === "bottom" && (
              <motion.div
                ref={chatRef}
                variants={chatVariants.bottom}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="border-t border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out relative resize-transition slide-in-bottom"
                style={{ height: `${chatHeight}px` }}
              >
                <ChatPanel
                  onClose={() => setShowChat(false)}
                  onDockChange={setDockPosition}
                  dockPosition={dockPosition}
                  chatRef={chatRef}
                  chatHeaderRef={chatHeaderRef}
                  resizeHandleRef={resizeHandleRef}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Dock indicators */}
        {isDragging && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dockIndicator === "left" ? 1 : 0 }}
              className="fixed top-0 left-0 w-[100px] h-full bg-blue-500/20 pointer-events-none transition-opacity duration-200"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dockIndicator === "right" ? 1 : 0 }}
              className="fixed top-0 right-0 w-[100px] h-full bg-blue-500/20 pointer-events-none transition-opacity duration-200"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: dockIndicator === "bottom" ? 1 : 0 }}
              className="fixed bottom-0 left-0 w-full h-[100px] bg-blue-500/20 pointer-events-none transition-opacity duration-200"
            />
          </>
        )}

        {/* Footer */}
        <footer className="border-t border-[#2a2a2a] py-3 px-8">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">© 2025 Sweepo. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Terms
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Privacy
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </AdvancedPageTransition>
  )
}
