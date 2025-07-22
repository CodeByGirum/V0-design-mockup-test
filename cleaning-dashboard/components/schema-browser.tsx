/**
 * Purpose: Displays the database schema in a collapsible tree view.
 * Features: Collapsible sections for tables and lists columns with their types.
 * Used in: DashboardSidebar
 * Notes: Clicking a column name can trigger a callback to insert it into an editor.
 */
"use client"

import { Table, Columns } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const schemaData = {
  users: [
    { name: "id", type: "integer" },
    { name: "name", type: "varchar" },
    { name: "age", type: "integer" },
    { name: "email", type: "varchar" },
    { name: "joinDate", type: "date" },
  ],
  other_table: [
    { name: "product_id", type: "integer" },
    { name: "product_name", type: "varchar" },
    { name: "price", type: "decimal" },
  ],
}

interface SchemaBrowserProps {
  onColumnSelect?: (columnName: string) => void
}

export function SchemaBrowser({ onColumnSelect = () => {} }: SchemaBrowserProps) {
  return (
    <div className="p-3">
      <h3 className="text-xs font-medium text-gray-400 mb-2">Schema Browser</h3>
      <Accordion type="single" collapsible className="w-full" defaultValue="users">
        {Object.entries(schemaData).map(([tableName, columns]) => (
          <AccordionItem key={tableName} value={tableName} className="border-b-0">
            <AccordionTrigger className="py-1.5 text-xs text-gray-300 hover:no-underline hover:text-white [&[data-state=open]>svg]:text-white">
              <div className="flex items-center gap-2">
                <Table className="h-3.5 w-3.5 text-gray-500" />
                <span>{tableName}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-4 pt-1 pb-0">
              <div className="space-y-1">
                {columns.map((col) => (
                  <div
                    key={col.name}
                    onClick={() => onColumnSelect(col.name)}
                    className="flex items-center gap-2 text-xs text-gray-400 hover:bg-[#1a1a1a] rounded-md px-2 py-1 cursor-pointer transition-colors"
                  >
                    <Columns className="h-3.5 w-3.5 text-gray-600" />
                    <span className="flex-grow">{col.name}</span>
                    <span className="text-gray-500">{col.type}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
