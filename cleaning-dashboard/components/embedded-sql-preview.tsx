/**
 * Purpose: Displays a self-contained, collapsible SQL query panel within a chat message.
 * Features: Modern title bar, copy-to-clipboard, expand/collapse, and IDE-like syntax highlighting on a black background.
 * Used in: components/chat-panel.tsx
 * Notes: Uses Framer Motion for animations and CodeMirror for syntax highlighting.
 */
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown, Copy } from "lucide-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { sweepoTheme, sweepoSyntaxHighlighting } from "./codemirror-theme"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface EmbeddedSqlPreviewProps {
  title: string
  sqlContent: string
}

export function EmbeddedSqlPreview({ title, sqlContent }: EmbeddedSqlPreviewProps) {
  const [isOpen, setIsOpen] = useState(true) // Default to open
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const onCopy = () => {
    navigator.clipboard.writeText(sqlContent)
    setHasCopied(true)
    toast({
      title: "SQL Copied!",
      description: "The query has been copied to your clipboard.",
    })
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="bg-[#121212] border border-neutral-800 rounded-lg overflow-hidden my-2 text-sm">
      {/* Sleek Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800">
        <p className="font-mono text-neutral-400 truncate">{title}</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-neutral-400 hover:bg-neutral-700 hover:text-white"
            onClick={onCopy}
            aria-label="Copy SQL"
          >
            {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-neutral-400 hover:bg-neutral-700 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Collapse SQL" : "Expand SQL"}
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Collapsible Code Block */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-[#121212]"
          >
            <CodeMirror
              value={sqlContent}
              extensions={[sql(), sweepoTheme, sweepoSyntaxHighlighting]}
              readOnly={true}
              basicSetup={{
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: false,
                lineNumbers: false,
                highlightActiveLine: false,
                highlightActiveLineGutter: false,
              }}
              className="text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
