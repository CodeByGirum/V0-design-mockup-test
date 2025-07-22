/**
 * Purpose: Sidebar for the Text-to-SQL workstation
 * Features: Database schema display, query history
 * Used in: Main workstation component
 */

"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Database, Clock, Table, Key } from "lucide-react"
import { motion } from "framer-motion"
import type { SchemaTable, QueryHistoryItem } from "../types"

interface DashboardSidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  schema: SchemaTable[]
  queryHistory: QueryHistoryItem[]
}

function ToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] border-r border-t border-b border-[#2a2a2a] p-1 rounded-r-md z-10 transition-all hover:bg-[#2a2a2a]"
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </motion.button>
  )
}

export function DashboardSidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  schema,
  queryHistory,
}: DashboardSidebarProps) {
  const [expandedTables, setExpandedTables] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"schema" | "history">("schema")

  const toggleTableExpansion = (tableName: string) => {
    setExpandedTables((prev) =>
      prev.includes(tableName) ? prev.filter((name) => name !== tableName) : [...prev, tableName],
    )
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <motion.div
      initial={{ width: sidebarCollapsed ? 0 : 280 }}
      animate={{ width: sidebarCollapsed ? 0 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${sidebarCollapsed ? "w-0 overflow-hidden" : "w-70"} border-r border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out fade-in`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="p-3 border-b border-[#2a2a2a] flex justify-between items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search tables, columns..."
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

      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a]">
        <button
          className={`flex-1 py-2 text-xs font-medium ${
            activeTab === "schema" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("schema")}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>Schema</span>
          </div>
        </button>
        <button
          className={`flex-1 py-2 text-xs font-medium ${
            activeTab === "history" ? "text-white border-b-2 border-blue-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>History</span>
          </div>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "schema" ? (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {schema.map((table) => (
              <div key={table.name} className="rounded-md overflow-hidden">
                <button
                  className="w-full flex items-center justify-between bg-[#1a1a1a] hover:bg-[#2a2a2a] px-3 py-2 text-xs text-left transition-colors"
                  onClick={() => toggleTableExpansion(table.name)}
                >
                  <div className="flex items-center gap-2">
                    <Table className="h-3.5 w-3.5 text-gray-400" />
                    <span className="font-medium">{table.name}</span>
                  </div>
                  <ChevronRight
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                      expandedTables.includes(table.name) ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedTables.includes(table.name) && (
                  <div className="bg-[#121212] border-l border-[#2a2a2a] ml-3 pl-3">
                    {table.columns.map((column) => (
                      <div
                        key={column.name}
                        className="flex items-center gap-2 py-1.5 px-2 text-xs text-gray-300 hover:bg-[#1a1a1a] rounded-md"
                      >
                        {column.isPrimary ? (
                          <Key className="h-3 w-3 text-yellow-500" />
                        ) : column.isForeign ? (
                          <Key className="h-3 w-3 text-blue-500" />
                        ) : (
                          <div className="w-3" />
                        )}
                        <span>{column.name}</span>
                        <span className="text-gray-500 text-[10px]">{column.type}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-1 p-2">
            {queryHistory.length > 0 ? (
              queryHistory.map((item, index) => (
                <div key={index} className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-md p-2 text-xs transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-[10px]">{formatTimestamp(item.timestamp)}</span>
                  </div>
                  <p className="text-gray-300 mb-1 line-clamp-2">{item.naturalLanguage}</p>
                  <p className="text-gray-500 text-[10px] line-clamp-1 font-mono">{item.sql}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-xs">No query history yet</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Export the ToggleButton as a named export on the DashboardSidebar object
DashboardSidebar.ToggleButton = ToggleButton
