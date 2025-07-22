/**
 * Purpose: Footer for the cleaning dashboard
 * Features: Displays copyright info and links
 * Used in: Main dashboard component
 */

import Link from "next/link"

export function DashboardFooter() {
  return (
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
  )
}
