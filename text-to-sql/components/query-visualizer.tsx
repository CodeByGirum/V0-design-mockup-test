/**
 * Purpose: Visualize query results with charts
 * Features: Multiple chart types and automatic configuration
 * Used in: Main workstation component
 */

"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { BarChart2, LineChartIcon, PieChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryResult } from "../types"

interface QueryVisualizerProps {
  results: QueryResult | null
  query: string
}

type ChartType = "bar" | "line" | "pie"

export function QueryVisualizer({ results, query }: QueryVisualizerProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")

  // If no results, show empty state
  if (!results || !results.rows.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-gray-400">No data to visualize</p>
          <p className="text-xs text-gray-500 mt-1">Run a query to see visualizations here</p>
        </div>
      </div>
    )
  }

  // Determine if data is suitable for visualization
  const columns = results.columns
  const hasNumericColumn = columns.some((column) => results.rows.some((row) => typeof row[column] === "number"))

  if (!hasNumericColumn || columns.length < 2) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-sm text-gray-400">This data cannot be visualized</p>
          <p className="text-xs text-gray-500 mt-1">
            Visualization requires at least one numeric column and one category column
          </p>
        </div>
      </div>
    )
  }

  // Find suitable columns for visualization
  const numericColumns = columns.filter((column) => results.rows.some((row) => typeof row[column] === "number"))

  const categoryColumns = columns.filter(
    (column) =>
      !numericColumns.includes(column) &&
      results.rows.every((row) => row[column] !== null && row[column] !== undefined),
  )

  // Default to first columns if available
  const defaultCategoryColumn = categoryColumns[0] || columns[0]
  const defaultNumericColumn = numericColumns[0] || columns[1]

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  // Format data for charts
  const chartData = results.rows.map((row) => ({
    name: String(row[defaultCategoryColumn]),
    value: Number(row[defaultNumericColumn]),
    ...row,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Chart type selector */}
      <div className="flex items-center p-2 border-b border-[#2a2a2a]">
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === "bar" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setChartType("bar")}
          >
            <BarChart2 className="h-3.5 w-3.5 mr-1" />
            Bar
          </Button>
          <Button
            variant={chartType === "line" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setChartType("line")}
          >
            <LineChartIcon className="h-3.5 w-3.5 mr-1" />
            Line
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setChartType("pie")}
          >
            <PieChartIcon className="h-3.5 w-3.5 mr-1" />
            Pie
          </Button>
        </div>
      </div>

      {/* Chart display */}
      <div className="flex-1 p-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#2a2a2a" }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#2a2a2a" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px" }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "#9ca3af" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
              <Bar dataKey="value" name={defaultNumericColumn} fill="#0088FE" />
            </BarChart>
          ) : chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#2a2a2a" }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={{ stroke: "#2a2a2a" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px" }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "#9ca3af" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
              <Line
                type="monotone"
                dataKey="value"
                name={defaultNumericColumn}
                stroke="#0088FE"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "6px" }}
                labelStyle={{ color: "white" }}
                itemStyle={{ color: "#9ca3af" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
