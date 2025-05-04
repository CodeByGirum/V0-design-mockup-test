"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showBackLink?: boolean
  backLinkText?: string
  backLinkHref?: string
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showBackLink = false,
  backLinkText = "Back",
  backLinkHref = "/",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        {showBackLink && (
          <Link
            href={backLinkHref}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backLinkText}
          </Link>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-medium mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">{subtitle}</p>
        </motion.div>

        {children}
      </div>
    </div>
  )
}
