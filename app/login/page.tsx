"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
// import { PixelAnimation } from "@/components/pixel-animation"

export default function LoginPage() {
  const { transitionType, transitionDuration } = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  // Calculate parallax effect based on mouse position
  const calcParallax = (strength = 20) => {
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 0
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0

    const moveX = (mousePosition.x - windowWidth / 2) / strength
    const moveY = (mousePosition.y - windowHeight / 2) / strength

    return {
      x: moveX,
      y: moveY,
    }
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="relative flex flex-col min-h-screen bg-[#121212] text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[#121212] opacity-80 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212]"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-5"></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12 z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/" className="flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SWEEPO</span>
            </Link>
          </motion.div>

          {/* Login box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-lg overflow-hidden"
          >
            {/* Login header */}
            <div className="px-6 pt-6 pb-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium text-white mb-1">Welcome back</h2>
              <p className="text-sm text-gray-400">Sign in to continue to your dashboard</p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs text-gray-300">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#121212] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder:text-gray-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#121212] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors placeholder:text-gray-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-[#121212] border-[#2a2a2a] rounded focus:ring-0 focus:ring-offset-0 transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-xs text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium rounded-md px-5 py-2.5 text-sm transition-colors"
              >
                Sign in
              </motion.button>

              <div className="text-center">
                <span className="text-xs text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-gray-300 hover:text-white transition-colors">
                    Sign up
                  </Link>
                </span>
              </div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} Sweepo. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </AdvancedPageTransition>
  )
}
