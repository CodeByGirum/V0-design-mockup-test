/**
 * Purpose: Sidebar for the cleaning dashboard
 * Features: Collapsible sidebar with accordions for datasets and schema browser.
 * Used in: Main dashboard component
 */
"use client"

import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { motion } from "framer-motion"
import { SchemaBrowser } from "./schema-browser"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface DashboardSidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

function ToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1a1a1a] border-r border-t border-b border-[#2a2a2a] p-1 rounded-r-md z-20 transition-all hover:bg-[#2a2a2a]"
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </motion.button>
  )
}

export function DashboardSidebar({ sidebarCollapsed, setSidebarCollapsed }: DashboardSidebarProps) {
  return (
    <motion.div
      initial={{ width: sidebarCollapsed ? 0 : 240 }}
      animate={{ width: sidebarCollapsed ? 0 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`${sidebarCollapsed ? "w-0 overflow-hidden" : "w-60"} border-r border-[#2a2a2a] flex flex-col transition-all duration-300 ease-in-out fade-in flex-shrink-0`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="p-3 border-b border-[#2a2a2a] flex justify-between items-center flex-shrink-0">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
          />
          <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-400" />
        </div>
        <button
          className="ml-2 text-gray-400 hover:text-white transition-colors"
          onClick={() => setSidebarCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <Accordion type="multiple" defaultValue={["datasets", "schema-browser"]} className="w-full">
          <AccordionItem value="datasets" className="border-b border-[#2a2a2a]">
            <AccordionTrigger className="text-xs font-medium px-3 py-2 hover:bg-[#1a1a1a]">Datasets</AccordionTrigger>
            <AccordionContent className="p-3 pt-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs bg-[#2a2a2a] rounded-md px-2 py-1.5 transition-colors hover:bg-[#3a3a3a]">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-white">random_kdd_dataset.csv</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>50x50_table.csv</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1.5 transition-colors">
                  <FileText className="h-3.5 w-3.5" />
                  <span>bad_data.csv</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="schema-browser" className="border-b-0">
            <AccordionTrigger className="text-xs font-medium px-3 py-2 hover:bg-[#1a1a1a]">
              Schema Browser
            </AccordionTrigger>
            <AccordionContent>
              <SchemaBrowser />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  )
}

DashboardSidebar.ToggleButton = ToggleButton
