/**
 * Purpose: Type definitions for the Text-to-SQL workstation
 * Features: Defines interfaces and types used throughout the application
 * Used in: All components
 */

export type DockPosition = "left" | "right" | "bottom"

export interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export interface SchemaColumn {
  name: string
  type: string
  isPrimary?: boolean
  isForeign?: boolean
  foreignTable?: string
  foreignColumn?: string
}

export interface SchemaTable {
  name: string
  columns: SchemaColumn[]
}

export interface QueryResult {
  columns: string[]
  rows: Record<string, any>[]
}

export interface QueryHistoryItem {
  naturalLanguage: string
  sql: string
  timestamp: Date
  results?: QueryResult
}
