/**
 * Purpose: Displays a card for an already connected integration instance. Creative design.
 * Used in: app/integrations/page.tsx
 */
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit3, Trash2, RefreshCw, AlertTriangle, CheckCircle2, PowerOff, Link2 } from "lucide-react"
import type { ConnectedIntegrationInstance, IntegrationTemplate, IntegrationStatus } from "@/app/integrations/page"

interface ConnectedIntegrationCardProps {
  instance: ConnectedIntegrationInstance
  template?: IntegrationTemplate
  onEdit: (instance: ConnectedIntegrationInstance) => void
  onDelete: (instanceId: string) => void
  onReconnect: (instance: ConnectedIntegrationInstance) => void
}

const StatusIndicator: React.FC<{ status: IntegrationStatus }> = ({ status }) => {
  let IconComponent = Link2
  let iconColor = "text-gray-500"
  let dotColor = "bg-gray-500"

  switch (status) {
    case "Connected":
      IconComponent = CheckCircle2
      iconColor = "text-green-400"
      dotColor = "bg-green-400"
      break
    case "Error":
      IconComponent = AlertTriangle
      iconColor = "text-red-400"
      dotColor = "bg-red-400"
      break
    case "Pending":
      IconComponent = RefreshCw
      iconColor = "text-yellow-400"
      dotColor = "bg-yellow-400"
      break
    default:
      IconComponent = PowerOff
      break
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${dotColor} ${status === "Pending" ? "animate-ping" : ""}`}></div>
      <IconComponent className={`h-4 w-4 ${iconColor} ${status === "Pending" ? "animate-spin" : ""}`} />
      <span className={`text-xs font-medium ${textColorFromStatus(status)}`}>{status}</span>
    </div>
  )
}

const textColorFromStatus = (status: IntegrationStatus) => {
  switch (status) {
    case "Connected":
      return "text-green-400"
    case "Error":
      return "text-red-400"
    case "Pending":
      return "text-yellow-400"
    default:
      return "text-gray-400"
  }
}

export function ConnectedIntegrationCard({
  instance,
  template,
  onEdit,
  onDelete,
  onReconnect,
}: ConnectedIntegrationCardProps) {
  const iconToDisplay = template?.icon || (
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#282828]`}>
      <Link2 className={`w-5 h-5 text-gray-500`} />
    </div>
  )

  return (
    <Card className="bg-[#1c1c1c] border border-[#2f2f2f] rounded-xl shadow-lg hover:border-[#484848] hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full group">
      <CardHeader className="p-5 flex flex-row items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-0.5 bg-gradient-to-br from-[#333] to-[#222] rounded-lg shadow-md group-hover:from-[#444] group-hover:to-[#333] transition-all">
            {iconToDisplay}
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-gray-100 group-hover:text-white transition-colors">
              {instance.displayName}
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">
              {template?.name || "Unknown Type"}
            </CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#222222] border-[#383838] text-gray-300 shadow-xl w-56">
            <DropdownMenuItem
              onClick={() => onEdit(instance)}
              className="hover:!bg-[#2a2a2a] focus:!bg-[#2a2a2a] text-sm py-2 px-3"
            >
              <Edit3 className="mr-2.5 h-4 w-4" /> Edit Configuration
            </DropdownMenuItem>
            {instance.status === "Error" && (
              <DropdownMenuItem
                onClick={() => onReconnect(instance)}
                className="hover:!bg-[#2a2a2a] focus:!bg-[#2a2a2a] text-sm py-2 px-3"
              >
                <RefreshCw className="mr-2.5 h-4 w-4" /> Attempt Reconnect
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-[#383838]" />
            <DropdownMenuItem
              onClick={() => onDelete(instance.instanceId)}
              className="text-red-400 hover:!bg-red-700/20 focus:!bg-red-700/20 hover:!text-red-300 text-sm py-2 px-3"
            >
              <Trash2 className="mr-2.5 h-4 w-4" /> Delete Integration
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow px-5 pb-5 text-xs text-gray-400 space-y-3">
        <div className="flex items-center justify-between pt-2 border-t border-[#2f2f2f]">
          <span className="text-gray-500">Status</span>
          <StatusIndicator status={instance.status} />
        </div>
        {instance.lastSync && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Last Synced</span>
            <span className="text-gray-300">
              {new Date(instance.lastSync).toLocaleDateString()}{" "}
              {new Date(instance.lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}
        {instance.status === "Error" && instance.error && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-700/30 rounded-md">
            <p className="text-red-400 text-[11px] leading-relaxed line-clamp-2" title={instance.error}>
              <span className="font-semibold">Error:</span> {instance.error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
