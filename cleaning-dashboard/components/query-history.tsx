/**
 * Purpose: Displays a popover with a list of previously executed queries in an accordion.
 * Features: Each item expands to show the full query, with copy and rerun actions.
 * Used in: Data Cleaning Workstation page header.
 */
"use client"

import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { sweepoTheme, sweepoSyntaxHighlighting } from "./codemirror-theme"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { History, Play, Copy, Check } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const history = [
  {
    summary: "Get daily user signups and 7-day trend",
    query:
      "SELECT\n  date_trunc('day', created_at) AS signup_date,\n  COUNT(*) AS daily_signups,\n  ROUND(\n    AVG(COUNT(*)) OVER (\n      ORDER BY\n        date_trunc('day', created_at) ROWS BETWEEN 6 PRECEDING\n        AND CURRENT ROW\n    ),\n    2\n  ) AS seven_day_avg\nFROM\n  public.customers\nGROUP BY\n  signup_date;",
    timestamp: "2 minutes ago",
  },
  {
    summary: "Find users with null values in 'age' or 'salary'",
    query: "SELECT * FROM random_kdd_dataset WHERE age IS NULL OR salary IS NULL;",
    timestamp: "15 minutes ago",
  },
  {
    summary: "Count entries by category",
    query: "SELECT category, COUNT(*) FROM 'random_kdd_dataset.csv' GROUP BY category;",
    timestamp: "1 hour ago",
  },
  {
    summary: "Filter users with '@example.com' email",
    query: "SELECT * FROM users WHERE email LIKE '%@example.com';",
    timestamp: "3 hours ago",
  },
]

export function QueryHistory() {
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null)

  const handleCopy = (query: string) => {
    navigator.clipboard.writeText(query)
    setCopiedQuery(query)
    setTimeout(() => setCopiedQuery(null), 2000)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button title="Query History" className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
          <History className="h-4 w-4 text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[500px] p-0 bg-[#1c1c1c] border-[#2a2a2a] shadow-2xl">
        <div className="p-4 border-b border-[#2a2a2a]">
          <h4 className="font-medium text-sm text-gray-300">Query History</h4>
        </div>
        <div className="max-h-[450px] overflow-y-auto">
          <TooltipProvider delayDuration={100}>
            <Accordion type="multiple" className="p-2">
              {history.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-b-[#2a2a2a] last:border-b-0"
                >
                  <AccordionTrigger className="p-3 text-left hover:no-underline hover:bg-white/5 rounded-md transition-colors [&[data-state=open]]:bg-white/10">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex-grow">
                        <p className="text-xs text-gray-300 font-medium truncate">{item.summary}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-1 pl-4" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-white"
                              onClick={() => handleCopy(item.query)}
                            >
                              {copiedQuery === item.query ? (
                                <Check className="h-3.5 w-3.5 text-green-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#121212] text-gray-300 border-[#2a2a2a]">
                            <p>{copiedQuery === item.query ? "Copied!" : "Copy SQL"}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-white"
                              onClick={() => alert("Re-running query...")}
                            >
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#121212] text-gray-300 border-[#2a2a2a]">
                            <p>Rerun Query</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-0 pt-2 pb-3">
                    <div className="bg-[#121212] rounded-md overflow-hidden text-xs">
                      <CodeMirror
                        value={item.query}
                        extensions={[sql(), sweepoSyntaxHighlighting]}
                        theme={sweepoTheme}
                        readOnly={true}
                        basicSetup={{
                          lineNumbers: false,
                          foldGutter: false,
                          highlightActiveLine: false,
                          autocompletion: false,
                          searchKeymap: false,
                          lintKeymap: false,
                          completionKeymap: false,
                          commentKeymap: false,
                          foldKeymap: false,
                          dropCursor: false,
                          allowMultipleSelections: false,
                          indentOnInput: false,
                          bracketMatching: false,
                          closeBrackets: false,
                          highlightSelectionMatches: false,
                          closeBracketsKeymap: false,
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TooltipProvider>
        </div>
      </PopoverContent>
    </Popover>
  )
}
