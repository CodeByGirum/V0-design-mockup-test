"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { PixelAnimation } from "@/components/pixel-animation"

export default function SignupPage() {
  const { transitionType, transitionDuration } = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
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
    // Handle signup logic here
    console.log({ name, email, password, agreeTerms })
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
        {/* Pixel Animation Background */}
        <PixelAnimation />

        {/* Glowing SWEEPO text with pulsing effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none"
          animate={{
            x: calcParallax(60).x,
            y: calcParallax(60).y,
          }}
          transition={{ type: "spring", damping: 60 }}
        >
          <motion.h1
            className="text-[12rem] sm:text-[15rem] md:text-[20rem] font-bold tracking-tighter"
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 255, 255, 0.05)",
                "0 0 40px rgba(255, 255, 255, 0.1)",
                "0 0 20px rgba(255, 255, 255, 0.05)",
              ],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 4,
              ease: "easeInOut",
            }}
            style={{
              color: "rgba(255, 255, 255, 0.05)",
            }}
          >
            SWEEPO
          </motion.h1>
        </motion.div>

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
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                SWEEPO
              </span>
            </Link>
          </motion.div>

          {/* Glassy signup box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pixel-card w-full max-w-md backdrop-blur-xl bg-[#09090b]/70 border border-[#27272a] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Signup header */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-xl font-medium text-white mb-1">Create an Account</h2>
              <p className="text-sm text-gray-400">Sign up to get started with Sweepo</p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-xs text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#18181b]/80 border border-[#27272a] text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors placeholder:text-gray-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

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
                    className="bg-[#18181b]/80 border border-[#27272a] text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors placeholder:text-gray-500"
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
                    className="bg-[#18181b]/80 border border-[#27272a] text-white text-sm rounded-lg block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors placeholder:text-gray-500"
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
                <p className="text-[10px] text-gray-500 mt-1">
                  Password must be at least 8 characters and include a number and a special character.
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 bg-[#18181b] border-[#27272a] rounded focus:ring-0 focus:ring-offset-0 transition-colors"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-xs text-gray-300">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Create Account</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-600/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
              </motion.button>

              <div className="text-center">
                <span className="text-xs text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Sign in
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
