"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { PixelAnimation } from "@/components/pixel-animation"

export default function ForgotPasswordPage() {
  const { transitionType, transitionDuration } = useTransition()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
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
    // Handle password reset logic here
    console.log({ email })
    setIsSubmitted(true)
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
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                SWEEPO
              </span>
            </Link>
          </motion.div>

          {/* Glassy forgot password box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pixel-card w-full max-w-md backdrop-blur-xl bg-[#09090b]/70 border border-[#27272a] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Back to login link */}
            <div className="px-6 pt-6">
              <Link
                href="/login"
                className="inline-flex items-center text-xs text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                Back to login
              </Link>
            </div>

            {/* Forgot password header */}
            <div className="px-6 pt-4 pb-4">
              <h2 className="text-xl font-medium text-white mb-1">Reset your password</h2>
              <p className="text-sm text-gray-400">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
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
                      className="bg-[#18181b]/80 border border-[#27272a] text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors placeholder:text-gray-500"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium rounded-lg px-5 py-2.5 text-sm transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Send Reset Link</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
                </motion.button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="px-6 pb-6 pt-2 text-center"
              >
                <div className="w-16 h-16 bg-[#27272a] rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <Mail className="h-8 w-8 text-white relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20"></div>
                </div>
                <h2 className="text-xl font-medium text-white mb-2">Check your email</h2>
                <p className="text-sm text-gray-400 mb-6">
                  We&apos;ve sent a password reset link to <span className="text-white">{email}</span>
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Didn&apos;t receive the email? Click to try again
                </button>
              </motion.div>
            )}
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
