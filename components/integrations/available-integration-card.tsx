/**
 * Purpose: Displays a card for an available integration. Creative and engaging design.
 * Used in: app/integrations/page.tsx
 */
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { IntegrationTemplate } from "@/app/integrations/page"
import { ChevronRight } from "lucide-react"

interface AvailableIntegrationCardProps {
  template: IntegrationTemplate
  onConnectClick: (template: IntegrationTemplate) => void
}

export function AvailableIntegrationCard({ template, onConnectClick }: AvailableIntegrationCardProps) {
  return (
    <Card
      className="bg-[#1c1c1c] border border-[#2f2f2f] rounded-xl shadow-lg hover:border-[#484848] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col group cursor-pointer h-full overflow-hidden"
      onClick={() => onConnectClick(template)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onConnectClick(template)
      }}
      tabIndex={0}
      role="button"
      aria-label={`Connect to ${template.name}`}
    >
      <CardHeader className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 p-0.5 bg-gradient-to-br from-[#333] to-[#222] rounded-lg shadow-md group-hover:from-[#444] group-hover:to-[#333] transition-all">
            {template.icon} {/* Expecting a 40x40px icon element */}
          </div>
          <CardTitle className="text-base font-semibold text-gray-100 group-hover:text-white transition-colors">
            {template.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-5 pb-4">
        <CardDescription className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-2 min-h-[2.5em]">
          {template.description}
        </CardDescription>
        {template.tags && template.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 2).map(
              (
                tag, // Show fewer tags for cleaner look
              ) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] bg-[#2a2a2a] text-gray-500 group-hover:bg-[#333] group-hover:text-gray-400 transition-colors rounded-full"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-0">
        <div className="flex items-center justify-between w-full px-5 py-3 bg-[#222222]/50 group-hover:bg-[#282828]/80 transition-colors border-t border-[#2f2f2f]">
          <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">Connect Source</span>
          <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
        </div>
      </CardFooter>
    </Card>
  )
}
