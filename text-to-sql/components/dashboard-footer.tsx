/**
 * Purpose: Footer component for the Text-to-SQL workstation
 * Features: Status information and additional actions
 * Used in: Main workstation component
 */

"use client"

export function DashboardFooter() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#121212] p-2 flex items-center justify-between text-[10px] text-gray-400">
      <div className="flex items-center space-x-4">
        <span>Connected to: sample_db</span>
        <span>Tables: 8</span>
        <span>Last query: 0.24s</span>
      </div>
      <div>
        <span>Sweepo Text-to-SQL v1.0</span>
      </div>
    </footer>
  )
}
