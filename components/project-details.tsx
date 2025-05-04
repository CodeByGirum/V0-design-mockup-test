"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Clock, Download, FileSpreadsheet, Share2, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ProjectDetailsProps {
  id: string
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("overview")
  const [visibility, setVisibility] = useState("private")
  const [teamMembers, setTeamMembers] = useState([
    { id: "1", name: "You (Owner)", email: "you@example.com", role: "owner", initials: "YO", color: "bg-blue-500" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "editor", initials: "JS", color: "bg-green-500" },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "viewer",
      initials: "MJ",
      color: "bg-purple-500",
    },
  ])

  // Set active tab based on URL
  useEffect(() => {
    if (pathname.includes("/settings")) {
      setActiveTab("settings")
    } else {
      setActiveTab("overview")
    }
  }, [pathname])

  const handleRoleChange = (memberId: string, newRole: string) => {
    setTeamMembers((members) =>
      members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)),
    )
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers((members) => members.filter((member) => member.id !== memberId))
  }

  const handleAddMember = (newMember: any) => {
    // Check if member already exists
    const exists = teamMembers.some((member) => member.email === newMember.email)
    if (exists) return

    // Add new member with viewer role by default
    setTeamMembers([...teamMembers, { ...newMember, role: "viewer" }])
  }

  const handleArchiveProject = () => {
    console.log("Project archived")
    // In a real app, you would make an API call here
    // and then redirect to the projects page
    window.location.href = "/"
  }

  const handleTransferOwnership = (newOwnerId: string) => {
    console.log("Ownership transferred to", newOwnerId)

    // Update team members to reflect new ownership
    setTeamMembers((members) =>
      members.map((member) => {
        if (member.id === newOwnerId) return { ...member, role: "owner" }
        if (member.role === "owner") return { ...member, role: "editor" }
        return member
      }),
    )
  }

  const handleDeleteProject = () => {
    console.log("Project deleted")
    // In a real app, you would make an API call here
    // and then redirect to the projects page
    window.location.href = "/"
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-foreground font-medium">Customer Data Analysis</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Customer Data Analysis</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated 2 hours ago</span>
              <span>•</span>
              <span>2.4 MB</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Favorite
          </Button>
          <Button size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" asChild>
            <Link href={`/projects/${id}`}>Overview</Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link href={`/projects/${id}/settings`}>Settings</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">About</h2>
                <p className="text-muted-foreground">
                  This project contains customer data analysis for Q2 2023. It includes demographic information,
                  purchase history, and customer satisfaction scores.
                </p>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">Data Preview</h2>
                <div className="rounded-md border border-border overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border-b border-r border-border p-2 text-left font-medium">Customer ID</th>
                        <th className="border-b border-r border-border p-2 text-left font-medium">Name</th>
                        <th className="border-b border-r border-border p-2 text-left font-medium">Email</th>
                        <th className="border-b border-r border-border p-2 text-left font-medium">Purchase Count</th>
                        <th className="border-b border-border p-2 text-left font-medium">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="border-r border-border p-2">CUS-{1000 + i}</td>
                          <td className="border-r border-border p-2">Customer {i + 1}</td>
                          <td className="border-r border-border p-2">customer{i + 1}@example.com</td>
                          <td className="border-r border-border p-2">{Math.floor(Math.random() * 10) + 1}</td>
                          <td className="p-2">{Math.floor(Math.random() * 5) + 1}/5</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Team</h2>
                  <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-white ${member.color}`}>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                      <Badge variant={member.role === "owner" ? "default" : "outline"}>
                        {member.role === "owner" ? "Owner" : member.role === "editor" ? "Editor" : "Viewer"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">Stats</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rows</dt>
                    <dd className="font-medium">1,245</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Columns</dt>
                    <dd className="font-medium">24</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Missing Values</dt>
                    <dd className="font-medium">3.2%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duplicates</dt>
                    <dd className="font-medium">0</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">Activity</h2>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-500 text-white text-xs">
                          {i === 0 ? "YO" : i === 1 ? "JS" : "MJ"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <span className="font-medium">{i === 0 ? "You" : i === 1 ? "Jane" : "Mike"}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {i === 0 ? "updated the data" : i === 1 ? "added a comment" : "viewed the project"}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {i === 0 ? "2 hours ago" : i === 1 ? "Yesterday" : "3 days ago"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-4">Project Settings</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-name">Project Name</Label>
                    <input
                      id="project-name"
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      defaultValue="Customer Data Analysis"
                    />
                  </div>

                  <div>
                    <Label htmlFor="project-description">Description</Label>
                    <textarea
                      id="project-description"
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      defaultValue="This project contains customer data analysis for Q2 2023. It includes demographic information, purchase history, and customer satisfaction scores."
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-4">Visibility</h2>

                <RadioGroup value={visibility} onValueChange={setVisibility} className="space-y-3">
                  <div className="flex items-start space-x-3 rounded-md border border-border p-3">
                    <RadioGroupItem value="private" id="private" />
                    <div className="space-y-1">
                      <Label htmlFor="private" className="font-medium">
                        Private
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Only you and people you invite can access this project.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-md border border-border p-3">
                    <RadioGroupItem value="organization" id="organization" />
                    <div className="space-y-1">
                      <Label htmlFor="organization" className="font-medium">
                        Organization
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Anyone in your organization can access this project.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-md border border-border p-3">
                    <RadioGroupItem value="public" id="public" />
                    <div className="space-y-1">
                      <Label htmlFor="public" className="font-medium">
                        Public
                      </Label>
                      <p className="text-sm text-muted-foreground">Anyone with the link can access this project.</p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-4">Team Access</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Team Members</h3>
                    <Button variant="outline" size="sm">
                      Add Member
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`text-white ${member.color}`}>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-md border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value)}
                            disabled={member.role === "owner"}
                          >
                            <option value="owner">Owner</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>

                          {member.role !== "owner" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-100/10"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
                <h2 className="text-lg font-medium text-destructive mb-4">Danger Zone</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border border-border p-3">
                    <div>
                      <h3 className="font-medium">Archive Project</h3>
                      <p className="text-sm text-muted-foreground">
                        Archive this project to hide it from your dashboard.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleArchiveProject}>
                      Archive
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-border p-3">
                    <div>
                      <h3 className="font-medium">Transfer Ownership</h3>
                      <p className="text-sm text-muted-foreground">
                        Transfer ownership of this project to another team member.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransferOwnership("2")} // For demo, transfer to Jane
                    >
                      Transfer
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-destructive/50 p-3">
                    <div>
                      <h3 className="font-medium text-destructive">Delete Project</h3>
                      <p className="text-sm text-muted-foreground">Permanently delete this project and all its data.</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDeleteProject}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">Project Info</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd className="font-medium">June 15, 2023</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Modified</dt>
                    <dd className="font-medium">Today, 2:30 PM</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="font-medium">2.4 MB</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="font-medium">PRJ-{id}</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-md border border-border p-4">
                <h2 className="text-lg font-medium mb-2">Recent Activity</h2>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          className={`text-white ${i % 3 === 0 ? "bg-blue-500" : i % 3 === 1 ? "bg-green-500" : "bg-purple-500"}`}
                        >
                          {i % 3 === 0 ? "YO" : i % 3 === 1 ? "JS" : "MJ"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <span className="font-medium">{i % 3 === 0 ? "You" : i % 3 === 1 ? "Jane" : "Mike"}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          {i === 0
                            ? "updated settings"
                            : i === 1
                              ? "added a comment"
                              : i === 2
                                ? "viewed the project"
                                : i === 3
                                  ? "edited data"
                                  : "exported results"}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {i === 0
                            ? "2 hours ago"
                            : i === 1
                              ? "Yesterday"
                              : i === 2
                                ? "3 days ago"
                                : i === 3
                                  ? "Last week"
                                  : "2 weeks ago"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
