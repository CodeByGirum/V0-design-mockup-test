"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, X, Crown, Trash2, BarChart3, Download, Eye, FileText } from "lucide-react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

// Mock Data
const mockCollaborators = [
  {
    id: "collab1",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Admin",
    avatar: "/portrait-young-woman.png",
  },
  {
    id: "collab2",
    name: "David Martinez",
    email: "david.martinez@example.com",
    role: "Contributor",
    avatar: "/david-statue.png",
  },
  {
    id: "collab3",
    name: "Sarah Rodriguez",
    email: "sarah.rodriguez@example.com",
    role: "Viewer",
    avatar: "/portrait-of-sarah.png",
  },
]

const roleOptions = [
  { value: "Viewer", label: "Viewer", description: "Can view and comment" },
  { value: "Contributor", label: "Contributor", description: "Can edit" },
  { value: "Admin", label: "Admin", description: "Full access" },
]

// Helper component for settings sections
const SettingsSection = ({
  title,
  description,
  children,
  className = "",
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg ${className}`}>
    <div className="p-6">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      <Separator className="my-4 bg-[#2a2a2a]" />
      <div className="space-y-6">{children}</div>
    </div>
  </div>
)

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const { transitionType, transitionDuration } = useTransition()

  const [projectName, setProjectName] = useState("random_kdd_dataset.csv")
  const [projectDescription, setProjectDescription] = useState("KDD1999 DATASET")
  const [tags, setTags] = useState(["CSV", "Dataset", "Security"])
  const [newTag, setNewTag] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [collaborators, setCollaborators] = useState(mockCollaborators)
  const [newCollabEmail, setNewCollabEmail] = useState("")
  const [newCollabRole, setNewCollabRole] = useState<"Viewer" | "Contributor" | "Admin">("Viewer")
  const [knowledge, setKnowledge] = useState("")
  const [dangerAction, setDangerAction] = useState<"archive" | "transfer" | "delete" | null>(null)
  const [dangerInput, setDangerInput] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddCollaborator = () => {
    if (newCollabEmail.trim() && !collaborators.some((c) => c.email === newCollabEmail.trim())) {
      const newCollaborator = {
        id: `collab${Date.now()}`,
        name: newCollabEmail.split("@")[0],
        email: newCollabEmail.trim(),
        role: newCollabRole,
        avatar: `/placeholder.svg?width=32&height=32&query=${newCollabEmail.split("@")[0]}`,
      }
      setCollaborators([...collaborators, newCollaborator])
      setNewCollabEmail("")
    }
  }

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id))
  }

  const handleConfirmDangerAction = () => {
    if (dangerAction === "delete" && dangerInput !== projectName) return
    console.log(`Executing ${dangerAction} action...`)
    setDangerAction(null)
    setDangerInput("")
  }

  const DangerModal = () => {
    if (!dangerAction) return null

    const titles = {
      archive: "Archive Project",
      transfer: "Transfer Ownership",
      delete: "Delete Project",
    }
    const descriptions = {
      archive: "Archiving this project will make it read-only and hide it from the main dashboard. Are you sure?",
      transfer: "Transferring ownership is a critical action. Please select the new owner from your collaborators.",
      delete: `This action is irreversible. This will permanently delete the project. To confirm, please type "${projectName}" below.`,
    }

    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 w-full max-w-md">
          <h2 className={`text-lg font-medium ${dangerAction === "delete" ? "text-red-400" : "text-white"}`}>
            {titles[dangerAction]}
          </h2>
          <p className="text-sm text-gray-400 mt-2 mb-6">{descriptions[dangerAction]}</p>
          {dangerAction === "delete" && (
            <Input
              value={dangerInput}
              onChange={(e) => setDangerInput(e.target.value)}
              placeholder={projectName}
              className="bg-[#121212] border-[#3a3a3a] focus:ring-red-500"
            />
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDangerAction(null)}>
              Cancel
            </Button>
            <Button
              variant={dangerAction === "delete" ? "destructive" : "default"}
              onClick={handleConfirmDangerAction}
              disabled={dangerAction === "delete" && dangerInput !== projectName}
              className={
                dangerAction === "delete"
                  ? "bg-red-900 hover:bg-red-800 text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-gray-300">
        <header className="border-b border-[#2a2a2a] px-4 sm:px-8 py-4 flex justify-between items-center sticky top-0 bg-[#121212]/80 backdrop-blur-sm z-10">
          <h1 className="text-lg font-medium text-white">Sweepo</h1>
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={`/projects/${params.id}`}
              className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-md hover:bg-[#2a2a2a] transition-colors"
            >
              Project
            </Link>
          </nav>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <Link
                href={`/projects/${params.id}`}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back to Project</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Settings Column */}
              <div className="lg:col-span-2 space-y-8">
                <SettingsSection title="Project Details">
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-400">Project Name</label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-[#121212] border-[#3a3a3a]"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-400">Description</label>
                    <Textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="bg-[#121212] border-[#3a3a3a]"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <div key={tag} className="bg-[#2a2a2a] text-xs px-2 py-1 rounded-md flex items-center gap-1.5">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-white">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag..."
                        className="bg-[#121212] border-[#3a3a3a]"
                      />
                      <Button
                        onClick={handleAddTag}
                        variant="outline"
                        className="bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a]"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection title="Team Management" description="Manage who has access to this project.">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Owner</label>
                    <div className="flex items-center justify-between bg-[#121212] p-3 rounded-lg border border-[#2a2a2a]">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm font-semibold text-white">Girum Wondemagegn</span>
                      </div>
                      <Button
                        variant="outline"
                        className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] hover:text-white bg-transparent text-xs"
                        onClick={() => setDangerAction("transfer")}
                      >
                        Transfer Ownership
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Collaborators</label>
                    <div className="bg-[#121212] rounded-lg border border-[#2a2a2a]">
                      {collaborators.map((c) => (
                        <div
                          key={c.id}
                          className="flex flex-wrap items-center justify-between p-3 border-b border-[#2a2a2a] last:border-b-0 gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img src={c.avatar || "/placeholder.svg"} alt={c.name} className="h-8 w-8 rounded-full" />
                            <div>
                              <p className="text-sm text-white">{c.name}</p>
                              <p className="text-xs text-gray-400">{c.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select defaultValue={c.role}>
                              <SelectTrigger className="w-[140px] bg-[#1e1e1e] border-[#3a3a3a] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roleOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div>
                                      <p className="font-medium text-sm">{option.label}</p>
                                      <p className="text-xs text-gray-400">{option.description}</p>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveCollaborator(c.id)}>
                              <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="text-sm font-medium text-white">Add New Collaborator</label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Input
                        value={newCollabEmail}
                        onChange={(e) => setNewCollabEmail(e.target.value)}
                        placeholder="Enter email address..."
                        className="bg-[#121212] border-[#3a3a3a] flex-grow"
                      />
                      <div className="flex gap-2">
                        <Select
                          onValueChange={(value: "Viewer" | "Contributor" | "Admin") => setNewCollabRole(value)}
                          defaultValue={newCollabRole}
                        >
                          <SelectTrigger className="w-full sm:w-[150px] bg-[#1e1e1e] border-[#3a3a3a] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <p className="font-medium text-sm">{option.label}</p>
                                  <p className="text-xs text-gray-400">{option.description}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={handleAddCollaborator}
                          variant="outline"
                          className="bg-[#2a2a2a] border-[#3a3a3a] hover:bg-[#3a3a3a]"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Knowledge & Rules"
                  description="This dataset contains network intrusion records from the KDD Cup 1999 challenge, featuring 41 attributes per connection to identify normal or attack traffic in a military network simulation."
                >
                  <Textarea
                    value={knowledge}
                    onChange={(e) => setKnowledge(e.target.value)}
                    placeholder="e.g., 'Treat any transaction over $10,000 as suspicious.'"
                    className="bg-[#121212] border-[#3a3a3a] min-h-[150px] text-sm"
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{200 - knowledge.length} characters remaining</p>
                    <Button className="bg-white text-black hover:bg-gray-200">
                      <Save className="h-4 w-4 mr-2" />
                      Save Rules
                    </Button>
                  </div>
                </SettingsSection>

                <div className="bg-[#1e1e1e] border border-red-900/50 rounded-lg">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      These actions are critical and may be irreversible. Please proceed with caution.
                    </p>
                    <Separator className="my-4 bg-red-900/50" />
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium text-white">Project Visibility</h3>
                          <p className="text-sm text-gray-400">
                            {isPublic ? "Anyone with the link can view." : "Only collaborators and owner can access."}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 sm:mt-0">
                          <label htmlFor="visibility-switch" className="text-sm">
                            Private
                          </label>
                          <Switch id="visibility-switch" checked={isPublic} onCheckedChange={setIsPublic} />
                          <label htmlFor="visibility-switch" className="text-sm">
                            Public
                          </label>
                        </div>
                      </div>
                      {[
                        {
                          action: "archive",
                          label: "Archive this project",
                          description: "The project will be hidden and made read-only.",
                        },
                        {
                          action: "delete",
                          label: "Delete this project",
                          description: "Permanently delete this project and all its data.",
                        },
                      ].map((item) => (
                        <div key={item.action} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-medium text-white">{item.label}</h3>
                            <p className="text-sm text-gray-400">{item.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            className="border-red-900/80 text-red-400 hover:bg-red-900/30 hover:text-red-300 bg-transparent mt-2 sm:mt-0"
                            onClick={() => setDangerAction(item.action as any)}
                          >
                            {item.label.split(" ")[0]}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-8">
                <SettingsSection title="Project Analytics">
                  <div className="space-y-4">
                    {[
                      { icon: FileText, label: "File Size", value: "2.4 MB" },
                      { icon: BarChart3, label: "Rows", value: "4,937" },
                      { icon: BarChart3, label: "Columns", value: "42" },
                      { icon: Download, label: "Downloads", value: "128" },
                      { icon: Eye, label: "Views", value: "1.2k" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </SettingsSection>
              </div>
            </div>
          </div>
        </main>
        <DangerModal />
      </div>
    </AdvancedPageTransition>
  )
}
