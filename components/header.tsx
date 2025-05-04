"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  transparent?: boolean
}

export function Header({ transparent = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-between items-center ${
        transparent ? "bg-transparent" : "border-b border-[#2a2a2a] bg-[#121212]"
      }`}
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <Link href="/" className="text-base sm:text-lg font-medium">
          Sweepo
        </Link>
        <nav className="hidden md:flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-gray-400 hover:text-white text-xs px-2 sm:px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/projects"
            className="text-gray-400 hover:text-white text-xs px-2 sm:px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/analytics"
            className="text-gray-400 hover:text-white text-xs px-2 sm:px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
          >
            Analytics
          </Link>
        </nav>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 sm:gap-6">
        <Link href="/how-it-works" className="text-gray-400 hover:text-white text-xs transition-colors">
          How it works
        </Link>
        <Link href="/about" className="text-gray-400 hover:text-white text-xs transition-colors">
          About Us
        </Link>
        <Link href="/contact" className="text-gray-400 hover:text-white text-xs transition-colors">
          Contact Us
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-gray-400 hover:text-white text-xs transition-colors">
            Sign In
          </Link>
          <div className="bg-[#2a2a2a] rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
            <span className="text-white text-xs">👤</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 sm:top-16 left-0 right-0 bg-[#121212] border-b border-[#2a2a2a] py-3 sm:py-4 px-4 sm:px-8 z-50 md:hidden"
          >
            <nav className="flex flex-col space-y-3 sm:space-y-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/projects"
                className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/analytics"
                className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <div className="border-t border-[#2a2a2a] my-1 sm:my-2 pt-1 sm:pt-2">
                <Link
                  href="/how-it-works"
                  className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 block transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it works
                </Link>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 block transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white text-sm py-1.5 sm:py-2 block transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
              <div className="border-t border-[#2a2a2a] pt-1 sm:pt-2">
                <Link
                  href="/login"
                  className="text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] py-1.5 sm:py-2 px-3 sm:px-4 rounded text-sm block text-center transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
