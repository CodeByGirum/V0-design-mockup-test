"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage() {
  const { transitionType, transitionDuration } = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle login logic here
    console.log({ email, password, rememberMe })
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        <Header />

        <main className="flex-1 flex">
          {/* Left side - Login Form */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h1 className="text-2xl font-medium mb-2">Welcome to Sweepo</h1>
                <p className="text-gray-400 text-sm">Sign in to continue to your dashboard</p>
              </motion.div>

              <motion.form
                variants={formVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="email" className="block text-sm text-gray-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <label htmlFor="password" className="block text-sm text-gray-400">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm rounded-md block w-full pl-10 pr-10 p-2.5 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 bg-[#1a1a1a] border-[#2a2a2a] rounded focus:ring-0 focus:ring-offset-0 transition-colors"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white font-medium rounded-md px-5 py-2.5 text-sm transition-colors"
                >
                  Sign in
                </motion.button>

                <motion.div variants={itemVariants} className="text-center">
                  <span className="text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-white hover:underline transition-colors">
                      Sign up
                    </Link>
                  </span>
                </motion.div>
              </motion.form>
            </div>
          </div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block lg:w-1/2 bg-[#1a1a1a] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a]/80 to-transparent z-10"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8 z-20">
              <div className="max-w-lg text-center">
                <h2 className="text-2xl font-medium mb-4">Transform Your Data Cleaning Workflow</h2>
                <p className="text-gray-400 mb-6">
                  Sweepo helps you clean, transform, and analyze your data with powerful AI-assisted tools.
                </p>
                <div className="flex justify-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 z-0">
              <Image
                src="/interconnected-network.png"
                alt="Data visualization"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </main>

        <Footer minimal />
      </div>
    </AdvancedPageTransition>
  )
}
