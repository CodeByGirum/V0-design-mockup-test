/**
 * Purpose: Main page for browsing, connecting, and managing data source integrations.
 * Features: Search, filtering, categorized display, local file upload, modal-based connection flow.
 * Notes: Integration data and types are defined directly in this file. Design aims for creativity and engagement.
 */
"use client"

import type React from "react"
import { useState, useMemo, type ReactNode, useRef } from "react"
import { PageLayout } from "@/components/page-layout"
import { IntegrationSearchFilter } from "@/components/integrations/integration-search-filter"
import { AvailableIntegrationCard } from "@/components/integrations/available-integration-card"
import { ConnectedIntegrationCard } from "@/components/integrations/connected-integration-card"
import { IntegrationConnectModal } from "@/components/integrations/integration-connect-modal"
import { Database, FileText, Cloud, Briefcase, Zap, UploadCloud, Search, FilterIcon } from "lucide-react" // Added Search, FilterIcon

// --- Data and Types (assuming these are defined as in previous versions) ---
export type IntegrationStatus = "Connect" | "Connected" | "Error" | "Pending"

export interface IntegrationTemplate {
  id: string
  name: string
  category: IntegrationCategory
  icon: ReactNode // Expecting a 40x40px element
  description: string
  connectionType: "oauth" | "credentials" | "apikey" | "s3" | "custom_api" | "local_upload"
  tags?: string[]
}

export interface ConnectedIntegrationInstance {
  instanceId: string
  templateId: string
  displayName: string
  status: IntegrationStatus
  lastSync?: Date
  config?: Record<string, any>
  error?: string
}

export const integrationCategories = [
  "Spreadsheets & Files",
  "Cloud Storage",
  "Databases",
  "Data Warehouses",
  "Business Apps",
  "APIs & Automation",
] as const

export type IntegrationCategory = (typeof integrationCategories)[number]

const categoryIcons: Record<IntegrationCategory, ReactNode> = {
  "Spreadsheets & Files": <FileText className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
  "Cloud Storage": <Cloud className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
  Databases: <Database className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
  "Data Warehouses": <Database className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
  "Business Apps": <Briefcase className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
  "APIs & Automation": <Zap className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />,
}

const createMonochromeIcon = (
  IconComponent: React.ElementType,
  iconColor = "text-gray-400 group-hover:text-gray-200 transition-colors",
) => (
  <div
    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-[#282828] group-hover:bg-[#303030] transition-colors`}
  >
    <IconComponent className={`w-5 h-5 ${iconColor}`} />
  </div>
)

export const availableIntegrationTemplates: IntegrationTemplate[] = [
  {
    id: "local-file-upload",
    name: "Upload Local File",
    category: "Spreadsheets & Files",
    icon: createMonochromeIcon(UploadCloud, "text-gray-300 group-hover:text-gray-100 transition-colors"),
    description: "CSV, JSON, Excel files from your computer.",
    connectionType: "local_upload",
    tags: ["local", "csv", "json", "import"],
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    category: "Spreadsheets & Files",
    icon: createMonochromeIcon(FileText),
    description: "Sync data from your Google Sheets.",
    connectionType: "oauth",
    tags: ["spreadsheet", "google"],
  },
  {
    id: "aws-s3",
    name: "AWS S3",
    category: "Cloud Storage",
    icon: createMonochromeIcon(Cloud),
    description: "Access data from Amazon S3 buckets.",
    connectionType: "s3",
    tags: ["cloud", "storage", "aws"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    icon: createMonochromeIcon(Database),
    description: "Connect to PostgreSQL databases.",
    connectionType: "credentials",
    tags: ["database", "sql"],
  },
  // ... add more templates if needed, following the new icon style
]
// --- End of embedded data and types ---

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [connectedIntegrations, setConnectedIntegrations] = useState<ConnectedIntegrationInstance[]>([
    {
      instanceId: "ci_123xyz",
      templateId: "postgresql",
      displayName: "Production DB (Postgres)",
      status: "Connected",
      lastSync: new Date(Date.now() - 3600000 * 2),
      config: { host: "prod.db.example.com" },
    },
    {
      instanceId: "ci_local_sample",
      templateId: "local-file-upload",
      displayName: "Quarterly_Sales.csv",
      status: "Connected",
      lastSync: new Date(Date.now() - 3600000 * 5),
      config: { fileName: "Quarterly_Sales.csv", size: "1.2MB" },
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTemplate, setModalTemplate] = useState<IntegrationTemplate | null>(null)
  const [instanceToEdit, setInstanceToEdit] = useState<ConnectedIntegrationInstance | null>(null)

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newInstance: ConnectedIntegrationInstance = {
        instanceId: `local_${Date.now()}`,
        templateId: "local-file-upload",
        displayName: file.name,
        status: "Connected",
        lastSync: new Date(),
        config: { fileName: file.name, size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, type: file.type },
      }
      setConnectedIntegrations((prev) => [newInstance, ...prev]) // Add to top
      if (fileInputRef.current) fileInputRef.current.value = ""
      // Consider a toast notification here
    }
  }

  const handleOpenConnectModal = (template: IntegrationTemplate) => {
    if (template.connectionType === "local_upload") {
      fileInputRef.current?.click()
    } else {
      setModalTemplate(template)
      setInstanceToEdit(null)
      setIsModalOpen(true)
    }
  }

  const handleOpenEditModal = (instance: ConnectedIntegrationInstance) => {
    const template = availableIntegrationTemplates.find((t) => t.id === instance.templateId)
    if (template) {
      if (template.connectionType === "local_upload") {
        alert(`Local file source: ${instance.displayName}. Edit actions for local files are not yet fully implemented.`)
        return
      }
      setModalTemplate(template)
      setInstanceToEdit(instance)
      setIsModalOpen(true)
    }
  }

  const handleConnectOrUpdateIntegration = async (
    details: Omit<ConnectedIntegrationInstance, "instanceId" | "status" | "lastSync"> & { instanceId?: string },
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (details.instanceId) {
      setConnectedIntegrations((prev) =>
        prev.map((inst) =>
          inst.instanceId === details.instanceId
            ? { ...inst, ...details, status: "Connected", lastSync: new Date(), error: undefined }
            : inst,
        ),
      )
    } else {
      const newInstance: ConnectedIntegrationInstance = {
        ...details,
        instanceId: `ci_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        status: "Connected",
        lastSync: new Date(),
      }
      setConnectedIntegrations((prev) => [newInstance, ...prev]) // Add to top
    }
  }

  const handleDeleteIntegration = (instanceId: string) => {
    setConnectedIntegrations((prev) => prev.filter((inst) => inst.instanceId !== instanceId))
  }

  const handleReconnectIntegration = (instance: ConnectedIntegrationInstance) => {
    if (instance.templateId === "local-file-upload") return
    setConnectedIntegrations((prev) =>
      prev.map((inst) => (inst.instanceId === instance.instanceId ? { ...inst, status: "Pending" } : inst)),
    )
    setTimeout(() => {
      setConnectedIntegrations((prev) =>
        prev.map((inst) =>
          inst.instanceId === instance.instanceId
            ? { ...inst, status: "Connected", lastSync: new Date(), error: undefined }
            : inst,
        ),
      )
    }, 1500)
  }

  const filteredAvailableIntegrations = useMemo(() => {
    return availableIntegrationTemplates.filter((template) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        template.name.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const categorizedAvailableIntegrations = useMemo(() => {
    const categoriesToDisplay =
      selectedCategory === "all" ? integrationCategories : [selectedCategory as IntegrationCategory]
    return categoriesToDisplay
      .map((category) => ({
        title: category,
        icon: categoryIcons[category],
        integrations: filteredAvailableIntegrations.filter((int) => int.category === category),
      }))
      .filter((group) => group.integrations.length > 0)
  }, [filteredAvailableIntegrations, selectedCategory])

  return (
    <PageLayout>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[#121212] bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative min-h-screen text-gray-300">
        <input type="file" ref={fileInputRef} onChange={handleFileSelected} className="hidden" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <header className="mb-12 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 tracking-tight">Connect Your Data Universe</h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Integrate apps, databases, and files to bring all your data into Sweepo.
            </p>
          </header>

          {/* Refined Search and Filter Area */}
          <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-1 bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#2a2a2a] rounded-xl sticky top-4 z-10 shadow-lg">
            <div className="relative flex-grow w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search integrations (e.g., S3, Postgres, CSV...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm text-gray-200 focus:outline-none placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-md transition-colors"
            >
              <FilterIcon className="h-3.5 w-3.5" />
              Filters {showFilters ? "(Hide)" : "(Show)"}
            </button>
          </div>

          {showFilters && (
            <div className="mb-10 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] animate-fadeIn">
              <IntegrationSearchFilter
                selectedCategory={selectedCategory}
                onSelectedCategoryChange={setSelectedCategory}
                categories={integrationCategories as readonly string[]}
              />
            </div>
          )}

          {connectedIntegrations.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-100 mb-6">Your Connected Sources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connectedIntegrations.map((instance) => {
                  const template = availableIntegrationTemplates.find((t) => t.id === instance.templateId)
                  return (
                    <ConnectedIntegrationCard
                      key={instance.instanceId}
                      instance={instance}
                      template={template}
                      onEdit={handleOpenEditModal}
                      onDelete={handleDeleteIntegration}
                      onReconnect={handleReconnectIntegration}
                    />
                  )
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">
              {connectedIntegrations.length > 0 ? "Connect More Sources" : "Available Integrations"}
            </h2>
            {categorizedAvailableIntegrations.length > 0 ? (
              categorizedAvailableIntegrations.map((group) => (
                <div key={group.title} className="mb-12 group">
                  <div className="flex items-center mb-6 pl-1">
                    <span className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity">{group.icon}</span>
                    <h3 className="text-xl font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                      {group.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {availableIntegrationTemplates
                      .filter((t) => t.category === group.title) // Ensure correct filtering for display
                      .filter((template) => {
                        // Apply search term filter here as well
                        const searchLower = searchTerm.toLowerCase()
                        if (!searchLower) return true // Show all if no search term
                        return (
                          template.name.toLowerCase().includes(searchLower) ||
                          template.description.toLowerCase().includes(searchLower) ||
                          (template.tags && template.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
                        )
                      })
                      .map((template) => (
                        <AvailableIntegrationCard
                          key={template.id}
                          template={template}
                          onConnectClick={handleOpenConnectModal}
                        />
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#181818]/70 rounded-xl border border-[#2a2a2a]">
                <Search className="mx-auto h-12 w-12 text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-gray-300">No Integrations Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? "Try a different search term." : "It seems we couldn't find any integrations."}
                </p>
              </div>
            )}
          </section>

          <IntegrationConnectModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            template={modalTemplate}
            instanceToEdit={instanceToEdit}
            onConnect={handleConnectOrUpdateIntegration}
          />
        </div>
      </div>
    </PageLayout>
  )
}
