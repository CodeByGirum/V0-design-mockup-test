/**
 * Purpose: Component for selecting and customizing pre-built query templates
 * Features: Template browsing, parameter customization, and template application
 * Used in: Main workstation component
 */

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getTemplatesByCategory, applyTemplateParameters, type QueryTemplate } from "../data/query-templates"
import { BookTemplate, ArrowRight } from "lucide-react"

interface QueryTemplateSelectorProps {
  onTemplateSelect: (sql: string, naturalLanguage: string) => void
}

export function QueryTemplateSelector({ onTemplateSelect }: QueryTemplateSelectorProps) {
  const [activeTab, setActiveTab] = useState<QueryTemplate["category"]>("basic")
  const [selectedTemplate, setSelectedTemplate] = useState<QueryTemplate | null>(null)
  const [parameters, setParameters] = useState<Record<string, string | number>>({})
  const [isOpen, setIsOpen] = useState(false)

  // Get templates for the active category
  const templates = getTemplatesByCategory(activeTab)

  // Handle template selection
  const handleTemplateSelect = (template: QueryTemplate) => {
    setSelectedTemplate(template)

    // Initialize parameters with default values
    const initialParams: Record<string, string | number> = {}
    template.parameters?.forEach((param) => {
      initialParams[param.name] = param.default !== undefined ? param.default : ""
    })
    setParameters(initialParams)
  }

  // Handle parameter change
  const handleParameterChange = (name: string, value: string | number) => {
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Apply the template with parameters
  const applyTemplate = () => {
    if (!selectedTemplate) return

    // Generate SQL with parameters
    const sql = applyTemplateParameters(selectedTemplate, parameters)

    // Generate natural language with parameters
    let naturalLanguage = selectedTemplate.naturalLanguage
    Object.entries(parameters).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, "g")
      naturalLanguage = naturalLanguage.replace(regex, String(value))
    })

    // Pass to parent component
    onTemplateSelect(sql, naturalLanguage)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a] hover:bg-[#2a2a2a] text-gray-300">
          <BookTemplate className="mr-2 h-4 w-4" />
          Query Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#121212] border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>Query Templates</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[250px_1fr] gap-4 h-[400px]">
          {/* Template Categories and List */}
          <div className="border-r border-[#2a2a2a] pr-4">
            <Tabs
              defaultValue="basic"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as QueryTemplate["category"])}
            >
              <TabsList className="grid grid-cols-5 bg-[#1a1a1a]">
                <TabsTrigger value="basic" className="text-xs">
                  Basic
                </TabsTrigger>
                <TabsTrigger value="aggregation" className="text-xs">
                  Aggregate
                </TabsTrigger>
                <TabsTrigger value="join" className="text-xs">
                  Joins
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="modification" className="text-xs">
                  Modify
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[340px] mt-4 pr-2">
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? "bg-blue-900/30 border border-blue-500/50"
                          : "bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-transparent"
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{template.description}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Tabs>
          </div>

          {/* Template Parameters */}
          <div className="pl-4">
            {selectedTemplate ? (
              <div className="h-full flex flex-col">
                <h3 className="font-medium mb-2">{selectedTemplate.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{selectedTemplate.description}</p>

                <div className="text-xs text-gray-300 mb-4">
                  <span className="font-medium">Natural Language: </span>
                  {selectedTemplate.naturalLanguage}
                </div>

                <ScrollArea className="flex-grow mb-4">
                  <div className="space-y-4">
                    {selectedTemplate.parameters?.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <Label htmlFor={param.name} className="text-xs">
                          {param.description}
                        </Label>

                        {param.type === "select" ? (
                          <Select
                            value={parameters[param.name]?.toString() || ""}
                            onValueChange={(value) => handleParameterChange(param.name, value)}
                          >
                            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-xs">
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                              {param.options?.map((option) => (
                                <SelectItem key={option} value={option} className="text-xs">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : param.type === "number" ? (
                          <Input
                            id={param.name}
                            type="number"
                            value={parameters[param.name]?.toString() || ""}
                            onChange={(e) => handleParameterChange(param.name, e.target.valueAsNumber || 0)}
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-xs"
                          />
                        ) : (
                          <Input
                            id={param.name}
                            value={parameters[param.name]?.toString() || ""}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            className="bg-[#1a1a1a] border-[#2a2a2a] text-xs"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <Button onClick={applyTemplate} className="self-end bg-blue-600 hover:bg-blue-700">
                  Use Template
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Select a template from the list to customize
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
