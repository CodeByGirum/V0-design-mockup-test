/**
 * Purpose: Main header for the cleaning dashboard
 * Features: Displays logo, navigation links, and user info
 * Used in: Main dashboard component
 */

import Link from "next/link"

interface DashboardHeaderProps {
  sidebarCollapsed?: boolean
}

export function DashboardHeader({ sidebarCollapsed }: DashboardHeaderProps) {
  return (
    <header className="border-b border-[#2a2a2a] px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-medium">Sweepo</h1>
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
  )
}
