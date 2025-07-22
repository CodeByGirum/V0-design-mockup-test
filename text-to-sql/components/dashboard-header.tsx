/**
 * Purpose: Header component for the Text-to-SQL workstation
 * Features: Title, navigation, and action buttons
 * Used in: Main workstation component
 */

"use client"
import { Settings, HelpCircle, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  sidebarCollapsed: boolean
}

export function DashboardHeader({ sidebarCollapsed }: DashboardHeaderProps) {
  return (
    <header className="border-b border-[#2a2a2a] bg-[#121212] p-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-sm font-medium text-white">Text-to-SQL Workstation</h1>
        <div className="h-4 w-px bg-[#2a2a2a] mx-3"></div>
        <span className="text-xs text-gray-400">Database: sample_db</span>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
              <Download className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
            <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            <DropdownMenuItem>Export as SQL</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  )
}
