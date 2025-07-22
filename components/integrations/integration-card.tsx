/**
 * Purpose: Displays a single integration option as a card.
 * Features: Shows integration icon, name, description, and a connect button.
 * Used in: IntegrationCategorySection
 * Notes: Adheres to the application's dark theme and card styling.
 */
"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface IntegrationCardProps {
  name: string
  icon: ReactNode
  description?: string
  initialStatus: "Connect" | "Connected" | "Configure"
  onConnect: () => void // Placeholder for actual connection logic
}

export function IntegrationCard({ name, icon, description, initialStatus, onConnect }: IntegrationCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  // Function: handleConnectClick
  // Purpose: Simulates connection attempt and updates button status.
  // Inputs: None
  // Outputs: None (updates component state)
  const handleConnectClick = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      onConnect() // Call the passed onConnect prop
      setStatus((currentStatus) => (currentStatus === "Connect" ? "Connected" : "Connect"))
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 flex flex-col items-start hover:shadow-lg transition-shadow duration-300 min-h-[220px]">
      <div className="flex items-center mb-3 w-full">
        <div className="mr-4 shrink-0">{icon}</div>
        <h3 className="text-lg font-semibold text-white flex-grow">{name}</h3>
      </div>
      {description && <p className="text-xs text-gray-400 mb-4 flex-grow">{description}</p>}
      <Button
        onClick={handleConnectClick}
        variant={status === "Connected" ? "outline" : "default"}
        size="sm"
        className={`w-full mt-auto text-xs ${
          status === "Connected"
            ? "bg-transparent border-[#3a3a3a] text-green-400 hover:bg-[#2a2a2a] hover:text-green-300"
            : "bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white"
        } transition-colors duration-200`}
        disabled={isLoading}
      >
        {isLoading ? "Connecting..." : status === "Connected" ? "Disconnect" : status}
      </Button>
    </div>
  )
}
