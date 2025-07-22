/**
 * Purpose: Display query results in a table format
 * Features: Sortable columns, pagination, and empty states
 * Used in: Main workstation component
 */

"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MessageSquare, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryResult } from "../types"

interface QueryResultsProps {
  results: QueryResult | null
  isExecuting: boolean
  showChat: boolean
  setShowChat: (show: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export function QueryResults({
  results,
  isExecuting,
  showChat,
  setShowChat,
  sidebarCollapsed,
  setSidebarCollapsed,
}: QueryResultsProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Sort data if needed
  const sortedData = results?.rows
    ? [...results.rows].sort((a, b) => {
        if (!sortColumn) return 0

        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        const aString = String(aValue || "")
        const bString = String(bValue || "")

        return sortDirection === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
      })
    : []

  // Pagination
  const totalPages = Math.ceil((sortedData?.length || 0) / rowsPerPage)
  const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Results toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-2">
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white"
              onClick={() => setSidebarCollapsed(true)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <span className="text-xs text-gray-400">
            {results?.rows.length ? `${results.rows.length} rows returned` : "No results"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-gray-400 hover:text-white"
          onClick={() => setShowChat(!showChat)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          {showChat ? "Hide Chat" : "Show Chat"}
        </Button>
      </div>

      {/* Results table */}
      <div className="flex-1 overflow-auto">
        {isExecuting ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-blue-500"></div>
              <span className="mt-2 text-xs text-gray-400">Executing query...</span>
            </div>
          </div>
        ) : results?.rows.length ? (
          <table className="w-full border-collapse">
            <thead className="bg-[#1a1a1a] sticky top-0">
              <tr>
                {results.columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-[#2a2a2a] p-2 text-left text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center">
                      <span>{column}</span>
                      {sortColumn === column && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                  {results.columns.map((column) => (
                    <td key={column} className="p-2 text-xs text-gray-300">
                      {row[column] !== undefined && row[column] !== null
                        ? typeof row[column] === "number"
                          ? Number.isInteger(row[column])
                            ? row[column].toLocaleString()
                            : row[column].toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                          : String(row[column])
                        : "NULL"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-gray-400">No results to display</p>
              <p className="text-xs text-gray-500 mt-1">Try running a query to see results here</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {results?.rows.length > rowsPerPage && (
        <div className="flex items-center justify-between p-2 border-t border-[#2a2a2a]">
          <span className="text-xs text-gray-400">
            Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, results.rows.length)}{" "}
            of {results.rows.length} rows
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-white"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
