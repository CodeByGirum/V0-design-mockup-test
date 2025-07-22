/**
 * Purpose: Main entry point for the Text-to-SQL Workstation
 * Features: Combines all workstation components into a complete UI
 * Used in: Can be imported and used in any page
 * Notes: This component orchestrates all the text-to-SQL functionality
 */

"use client"

import { useState, useRef } from "react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardFooter } from "./components/dashboard-footer"
import { DashboardSidebar } from "./components/dashboard-sidebar"
import { QueryInput } from "./components/query-input"
import { QueryResults } from "./components/query-results"
import { ChatPanelContainer } from "./components/chat-panel-container"
import { DockIndicators } from "./components/dock-indicators"
import { QueryVisualizer } from "./components/query-visualizer"
import { sampleData, sampleSchema } from "./data/sample-data"
import type { Message, DockPosition, QueryResult, SchemaTable } from "./types"

export function TextToSQLWorkstation() {
  // Get transition settings from context
  const { transitionType, transitionDuration } = useTransition()

  // State for UI components
  const [showChat, setShowChat] = useState(true)
  const [chatWidth, setChatWidth] = useState(300)
  const [chatHeight, setChatHeight] = useState(300)
  const [dockPosition, setDockPosition] = useState<DockPosition>("right")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<"results" | "visualization">("results")
  const [currentQuery, setCurrentQuery] = useState<string>("")
  const [generatedSQL, setGeneratedSQL] = useState<string>("")
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null)
  const [queryHistory, setQueryHistory] = useState<
    Array<{
      naturalLanguage: string
      sql: string
      timestamp: Date
      results?: QueryResult
    }>
  >([])
  const [schema, setSchema] = useState<SchemaTable[]>(sampleSchema)
  const [isExecuting, setIsExecuting] = useState(false)

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
      content: "I'd like to analyze the sales data. Can you help me write some queries?",
      sender: "user",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      content:
        "I'd be happy to help you analyze the sales data! You can ask me questions in natural language, and I'll generate SQL queries for you. For example, you could ask 'Show me the top 5 products by revenue' or 'What were the total sales by region last quarter?'",
      sender: "assistant",
      timestamp: new Date(Date.now() - 30000),
    },
  ])

  // Function to generate SQL from natural language
  const generateSQL = async (text: string) => {
    setIsExecuting(true)

    // In a real implementation, this would call an API
    // For now, we'll simulate the generation with a timeout
    setTimeout(() => {
      let sql = ""

      // Simple pattern matching for demo purposes
      if (text.toLowerCase().includes("top 5") && text.toLowerCase().includes("product")) {
        sql = `SELECT p.product_name, SUM(o.quantity * o.unit_price) as revenue
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY p.product_name
ORDER BY revenue DESC
LIMIT 5;`
      } else if (text.toLowerCase().includes("sales") && text.toLowerCase().includes("region")) {
        sql = `SELECT r.region_name, SUM(o.quantity * o.unit_price) as total_sales
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN regions r ON c.region_id = r.id
WHERE o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH)
GROUP BY r.region_name
ORDER BY total_sales DESC;`
      } else if (text.toLowerCase().includes("average") && text.toLowerCase().includes("order")) {
        sql = `SELECT AVG(order_total) as average_order_value
FROM (
  SELECT o.order_id, SUM(o.quantity * o.unit_price) as order_total
  FROM orders o
  GROUP BY o.order_id
) as order_totals;`
      } else {
        sql = `-- Generated SQL based on: "${text}"
SELECT * FROM products LIMIT 10;`
      }

      setGeneratedSQL(sql)
      executeQuery(sql)

      // Add to history
      setQueryHistory((prev) => [
        {
          naturalLanguage: text,
          sql: sql,
          timestamp: new Date(),
        },
        ...prev,
      ])

      setIsExecuting(false)
    }, 1500)
  }

  // Function to execute SQL query
  const executeQuery = (sql: string) => {
    // In a real implementation, this would call an API
    // For now, we'll return sample data

    // Simple pattern matching for demo purposes
    let results: QueryResult = {
      columns: [],
      rows: [],
    }

    if (sql.toLowerCase().includes("top 5") && sql.toLowerCase().includes("product")) {
      results = {
        columns: ["product_name", "revenue"],
        rows: [
          { product_name: "iPhone 13 Pro", revenue: 1250000 },
          { product_name: 'MacBook Pro 16"', revenue: 980000 },
          { product_name: "AirPods Pro", revenue: 720000 },
          { product_name: "iPad Air", revenue: 650000 },
          { product_name: "Apple Watch Series 7", revenue: 520000 },
        ],
      }
    } else if (sql.toLowerCase().includes("sales") && sql.toLowerCase().includes("region")) {
      results = {
        columns: ["region_name", "total_sales"],
        rows: [
          { region_name: "North America", total_sales: 2450000 },
          { region_name: "Europe", total_sales: 1850000 },
          { region_name: "Asia Pacific", total_sales: 1620000 },
          { region_name: "Latin America", total_sales: 750000 },
          { region_name: "Middle East", total_sales: 580000 },
        ],
      }
    } else if (sql.toLowerCase().includes("average") && sql.toLowerCase().includes("order")) {
      results = {
        columns: ["average_order_value"],
        rows: [{ average_order_value: 285.75 }],
      }
    } else {
      results = {
        columns: ["id", "product_name", "category", "price", "stock"],
        rows: sampleData.products.slice(0, 10),
      }
    }

    setQueryResults(results)

    // Update history with results
    setQueryHistory((prev) => {
      const updated = [...prev]
      if (updated.length > 0) {
        updated[0].results = results
      }
      return updated
    })
  }

  // Function to handle template selection
  const handleTemplateSelect = (sql: string, naturalLanguage: string) => {
    // Set the current query
    setCurrentQuery(naturalLanguage)

    // Create a user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: naturalLanguage,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])

    // Set the generated SQL directly
    setGeneratedSQL(sql)

    // Execute the query
    executeQuery(sql)

    // Add to history
    setQueryHistory((prev) => [
      {
        naturalLanguage: naturalLanguage,
        sql: sql,
        timestamp: new Date(),
      },
      ...prev,
    ])

    // Add assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've applied the template with your parameters. You can see the results in the table.`,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show chat if it's hidden
      if (!showChat) {
        setShowChat(true)
      }
    }, 1000)
  }

  // Handle natural language query submission
  const handleQuerySubmit = (query: string) => {
    setCurrentQuery(query)

    // Create a message describing the query
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])

    // Generate SQL
    generateSQL(query)

    // Add assistant response after a short delay to simulate processing
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've generated a SQL query based on your request. You can see the results in the table.`,
        sender: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Show chat if it's hidden
      if (!showChat) {
        setShowChat(true)
      }
    }, 2000)
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
            schema={schema}
            queryHistory={queryHistory}
          />

          {/* Main Content Area with dynamic layout based on chat position */}
          <div className="flex-1 flex flex-col">
            {/* Query Input */}
            <QueryInput onQuerySubmit={handleQuerySubmit} isExecuting={isExecuting} generatedSQL={generatedSQL} />

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

              {/* Query Results Section */}
              <div className="flex-1 flex flex-col">
                {/* Tabs */}
                <div className="flex border-b border-[#2a2a2a]">
                  <button
                    className={`px-4 py-2 text-xs font-medium ${
                      activeTab === "results" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("results")}
                  >
                    Results
                  </button>
                  <button
                    className={`px-4 py-2 text-xs font-medium ${
                      activeTab === "visualization" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
                    }`}
                    onClick={() => setActiveTab("visualization")}
                  >
                    Visualization
                  </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === "results" ? (
                  <QueryResults
                    results={queryResults}
                    isExecuting={isExecuting}
                    showChat={showChat}
                    setShowChat={setShowChat}
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                  />
                ) : (
                  <QueryVisualizer results={queryResults} query={generatedSQL} />
                )}
              </div>

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
