"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Filter,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Share2,
  Star,
  Table,
  Trash2,
  Users,
  X,
  Archive,
} from "lucide-react"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { useRouter } from "next/navigation"

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Get transition settings from context
  const { transitionType, transitionDuration } = useTransition()

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("overview")

  // This would normally fetch project data based on the ID
  // For demo purposes, we'll use hardcoded data
  const project = {
    id: params.id,
    name: "random_kdd_dataset.csv",
    description: "KDD1999 DATASET",
    status: "Planning",
    progress: 0,
    createdAt: "2025-04-20T10:30:00Z",
    updatedAt: "2025-04-23T14:45:00Z",
    tags: ["CSV", "Dataset", "Security"],
    owner: "John Doe",
    collaborators: ["Alice Smith", "Bob Johnson"],
    size: "2.4 MB",
    rows: 4937,
    columns: 42,
  }

  // Sample CSV data for the preview table
  const headers = ["timestamp", "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes"]
  const data = [
    ["1331904600", "0", "tcp", "http", "SF", "215", "45076"],
    ["1331904600", "0", "tcp", "http", "SF", "162", "4528"],
    ["1331904600", "0", "tcp", "http", "SF", "236", "1228"],
    ["1331904601", "0", "tcp", "http", "SF", "233", "2032"],
    ["1331904601", "0", "tcp", "http", "SF", "239", "486"],
    ["1331904601", "0", "tcp", "http", "SF", "238", "1282"],
    ["1331904601", "0", "tcp", "http", "SF", "235", "1337"],
    ["1331904601", "0", "tcp", "http", "SF", "234", "1364"],
    ["1331904601", "0", "tcp", "http", "SF", "232", "2032"],
    ["1331904602", "0", "tcp", "http", "SF", "232", "2347"],
  ]

  // Sample column statistics for the Data tab
  const columnStats = [
    {
      name: "timestamp",
      type: "integer",
      nulls: 0,
      unique: 3254,
      min: "1331904600",
      max: "1331984602",
      mean: "1331944601",
    },
    { name: "duration", type: "integer", nulls: 0, unique: 1, min: "0", max: "0", mean: "0" },
    { name: "protocol_type", type: "string", nulls: 0, unique: 1, values: ["tcp"] },
    { name: "service", type: "string", nulls: 0, unique: 1, values: ["http"] },
    { name: "flag", type: "string", nulls: 0, unique: 1, values: ["SF"] },
    { name: "src_bytes", type: "integer", nulls: 0, unique: 28, min: "162", max: "239", mean: "215.6" },
    { name: "dst_bytes", type: "integer", nulls: 0, unique: 10, min: "486", max: "45076", mean: "6467.5" },
  ]

  // Sample data quality issues for the Analysis tab
  const dataQualityIssues = [
    { type: "Missing Values", count: 0, severity: "Low", description: "No missing values detected in the dataset." },
    {
      type: "Outliers",
      count: 12,
      severity: "Medium",
      description: "Detected outliers in src_bytes and dst_bytes columns.",
    },
    { type: "Duplicates", count: 5, severity: "Low", description: "Found 5 duplicate rows based on all columns." },
    { type: "Format Issues", count: 0, severity: "Low", description: "No format issues detected in the dataset." },
  ]

  // Sample data distribution for the Analysis tab
  const dataDistribution = [
    { category: "protocol_type", values: [{ name: "tcp", count: 4937, percentage: 100 }] },
    { category: "service", values: [{ name: "http", count: 4937, percentage: 100 }] },
    { category: "flag", values: [{ name: "SF", count: 4937, percentage: 100 }] },
  ]

  // Mock user data for search
  const mockUsers = [
    { id: "em1", email: "emily.wilson@example.com", name: "Emily Wilson", initials: "EW", color: "bg-purple-500" },
    { id: "dm1", email: "david.martinez@example.com", name: "David Martinez", initials: "DM", color: "bg-green-500" },
    { id: "sr1", email: "sarah.rodriguez@example.com", name: "Sarah Rodriguez", initials: "SR", color: "bg-pink-500" },
    { id: "mk1", email: "michael.kim@example.com", name: "Michael Kim", initials: "MK", color: "bg-yellow-500" },
    {
      id: "jt1",
      email: "jessica.thompson@example.com",
      name: "Jessica Thompson",
      initials: "JT",
      color: "bg-indigo-500",
    },
    { id: "rp1", email: "ryan.patel@example.com", name: "Ryan Patel", initials: "RP", color: "bg-red-500" },
  ]

  // State for team members
  const [teamMembers, setTeamMembers] = useState([
    { id: "jd", name: "John Doe", email: "john.doe@example.com", role: "Owner", initials: "JD", color: "bg-blue-500" },
    {
      id: "as",
      name: "Alice Smith",
      email: "alice.smith@example.com",
      role: "Collaborator",
      initials: "AS",
      color: "bg-green-500",
    },
    {
      id: "bj",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "Collaborator",
      initials: "BJ",
      color: "bg-purple-500",
    },
  ])

  // State for visibility
  const [visibility, setVisibility] = useState("private")

  // State for new member email
  const [newMemberEmail, setNewMemberEmail] = useState("")

  // State for email search results
  const [searchResults, setSearchResults] = useState<typeof mockUsers>([])

  // State for showing search results
  const [showSearchResults, setShowSearchResults] = useState(false)

  // State for showing add member form
  const [showAddMember, setShowAddMember] = useState(false)

  // State for modal
  const [modalVisible, setModalVisible] = useState(false)
  const [modalType, setModalType] = useState<"archive" | "transfer" | "delete" | null>(null)
  const [transferTargetId, setTransferTargetId] = useState("")

  // State for project status
  const [projectStatus, setProjectStatus] = useState("active")

  // Ref for the email input
  const emailInputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)

  // Effect to handle clicks outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Function for email search
  useEffect(() => {
    if (newMemberEmail.length > 1) {
      const results = mockUsers
        .filter(
          (user) =>
            user.email.toLowerCase().includes(newMemberEmail.toLowerCase()) ||
            user.name.toLowerCase().includes(newMemberEmail.toLowerCase()),
        )
        .slice(0, 4) // Limit to 4 results

      setSearchResults(results)
      setShowSearchResults(results.length > 0)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [newMemberEmail])

  // Function to add a new team member
  const handleAddMember = (email?: string, name?: string, initials?: string, color?: string) => {
    const emailToUse = email || newMemberEmail

    if (!emailToUse || !emailToUse.includes("@")) return

    // If using an existing user from search
    if (email && name && initials && color) {
      // Check if the user is already on the team
      if (teamMembers.some((member) => member.email === email)) {
        return // User already added
      }

      // Add existing user
      const newMember = {
        id: Date.now().toString(),
        name,
        email,
        role: "Collaborator",
        initials,
        color,
      }

      setTeamMembers([...teamMembers, newMember])
      setNewMemberEmail("")
      setShowSearchResults(false)
      return
    }

    // Generate a random color for new user
    const colors = ["bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    // Get name from email (before @)
    const nameFromEmail = emailToUse
      .split("@")[0]
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")

    // Get initials
    const initialsFromName = nameFromEmail
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

    // Add new member
    const newMember = {
      id: Date.now().toString(),
      name: nameFromEmail,
      email: emailToUse,
      role: "Collaborator",
      initials: initialsFromName,
      color: randomColor,
    }

    setTeamMembers([...teamMembers, newMember])
    setNewMemberEmail("")
    setShowAddMember(false)
    setShowSearchResults(false)
  }

  // Function to update member role
  const updateMemberRole = (id: string, newRole: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, role: newRole } : member)))
  }

  // Function to remove a member
  const removeMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  // Function to toggle add member form
  const toggleAddMember = () => {
    setShowAddMember(!showAddMember)
    setShowSearchResults(false)
    // Focus the input when showing the form
    if (!showAddMember) {
      setTimeout(() => {
        emailInputRef.current?.focus()
      }, 100)
    }
  }

  // Function to handle modal actions
  const handleDangerAction = (type: "archive" | "transfer" | "delete") => {
    setModalType(type)
    setModalVisible(true)
  }

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
    setTransferTargetId("")
  }

  // Function to execute danger actions
  const executeDangerAction = () => {
    if (modalType === "archive") {
      setProjectStatus("archived")
      closeModal()
      // In a real app, you would call an API to archive the project
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } else if (modalType === "delete") {
      closeModal()
      // In a real app, you would call an API to delete the project
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } else if (modalType === "transfer" && transferTargetId) {
      // Find the member with the selected ID
      const newOwner = teamMembers.find((member) => member.id === transferTargetId)

      if (newOwner) {
        // Update the team members (change owner and previous owner becomes collaborator)
        const updatedMembers = teamMembers.map((member) => {
          if (member.id === transferTargetId) {
            return { ...member, role: "Owner" }
          }
          if (member.role === "Owner") {
            return { ...member, role: "Collaborator" }
          }
          return member
        })

        setTeamMembers(updatedMembers)
        closeModal()
      }
    }
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <AdvancedPageTransition type={transitionType} duration={transitionDuration}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        {/* Header */}
        <header className="border-b border-[#2a2a2a] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-medium">Sweepo</h1>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              How it works
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              About Us
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
              Contact Us
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-gray-400 hover:text-white text-xs transition-colors">
                Signout
              </Link>
              <div className="bg-[#2a2a2a] rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-white text-xs">👤</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {projectStatus === "archived" ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Archive className="h-16 w-16 text-gray-500 mb-4" />
                <h2 className="text-xl font-medium mb-2">Project Archived</h2>
                <p className="text-gray-400 mb-6">This project has been archived and is no longer active.</p>
                <Link
                  href="/"
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-2 px-4 text-sm transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              <>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-xs">
                  <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Projects
                  </Link>
                  <span className="text-gray-600">/</span>
                  <span className="text-white">{project.name}</span>
                </div>

                {/* Project Header */}
                <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 mb-6 slide-in-bottom">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-xl font-medium mb-1">{project.name}</h1>
                      <p className="text-gray-400 text-sm">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
                        <Star className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
                        <Share2 className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-2 transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Status</p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                        <span className="text-sm">{project.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Created</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Last Modified</p>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">
                          {formatDate(project.updatedAt)} at {formatTime(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Owner</p>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm">{project.owner}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full">
                      <div
                        className="h-1.5 bg-yellow-500 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${params.id}/clean`}
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Clean Dataset
                    </Link>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors">
                      <Play className="h-3.5 w-3.5" />
                      Start Processing
                    </button>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                    <button
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-red-400 hover:bg-[#2a2a2a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      onClick={() => handleDangerAction("delete")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-[#2a2a2a] mb-6">
                  <div className="flex items-center gap-1">
                    <button
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        activeTab === "overview" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setActiveTab("overview")}
                    >
                      Overview
                    </button>
                    <button
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        activeTab === "data" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setActiveTab("data")}
                    >
                      Data
                    </button>
                    <button
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        activeTab === "analysis" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setActiveTab("analysis")}
                    >
                      Analysis
                    </button>
                    <button
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        activeTab === "settings" ? "border-b-2 border-white" : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setActiveTab("settings")}
                    >
                      Settings
                    </button>
                  </div>
                </div>

                {/* Tab Content with Framer Motion transitions */}
                <AdvancedPageTransition type="fade" duration={0.3}>
                  {activeTab === "overview" && (
                    <div className="flex gap-6">
                      {/* Main Column */}
                      <div className="flex-1">
                        {/* Data Preview */}
                        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md mb-6 slide-in-bottom">
                          <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Table className="h-4 w-4 text-gray-400" />
                              <h2 className="text-sm font-medium">Data Preview</h2>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                                <RefreshCw className="h-3.5 w-3.5 text-gray-400" />
                              </button>
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                                <Filter className="h-3.5 w-3.5 text-gray-400" />
                              </button>
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-[#1a1a1a]">
                                  {headers.map((header, index) => (
                                    <th
                                      key={index}
                                      className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]"
                                    >
                                      <div className="flex items-center gap-1">
                                        {header}
                                        <ChevronDown className="h-3 w-3 text-gray-500" />
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {data.map((row, rowIndex) => (
                                  <tr
                                    key={rowIndex}
                                    className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                                  >
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex} className="px-4 py-2 text-gray-300">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="p-3 border-t border-[#2a2a2a] flex justify-between items-center">
                            <div className="text-xs text-gray-400">Showing 1-10 of {project.rows} rows</div>
                            <div className="flex items-center gap-1">
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                                Previous
                              </button>
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                                Next
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Activity Timeline */}
                        <div
                          className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <h2 className="text-sm font-medium">Recent Activity</h2>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-4">
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <div className="w-0.5 h-full bg-[#2a2a2a]"></div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">Project created</span>
                                    <span className="text-xs text-gray-400">{formatDate(project.createdAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {project.owner} created this project with {project.rows} rows and {project.columns}{" "}
                                    columns.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <div className="w-0.5 h-full bg-[#2a2a2a]"></div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">Collaborator added</span>
                                    <span className="text-xs text-gray-400">{formatDate(project.updatedAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {project.owner} added {project.collaborators[0]} as a collaborator.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                  <div className="w-0.5 h-full bg-[#2a2a2a]"></div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">Status updated</span>
                                    <span className="text-xs text-gray-400">{formatDate(project.updatedAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {project.owner} changed the status to {project.status}.
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">Tags added</span>
                                    <span className="text-xs text-gray-400">{formatDate(project.updatedAt)}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {project.owner} added tags: {project.tags.join(", ")}.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="w-80">
                        {/* Project Info */}
                        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md mb-6 slide-in-right">
                          <div className="border-b border-[#2a2a2a] p-4">
                            <h2 className="text-sm font-medium">Project Information</h2>
                          </div>
                          <div className="p-4 space-y-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">File Size</p>
                              <div className="flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-gray-400" />
                                <span className="text-sm">{project.size}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Rows</p>
                              <span className="text-sm">{project.rows.toLocaleString()}</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Columns</p>
                              <span className="text-sm">{project.columns}</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Tags</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {project.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="bg-[#2a2a2a] text-xs px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Team */}
                        <div
                          className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md mb-6 slide-in-right"
                          style={{ animationDelay: "0.1s" }}
                        >
                          <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                            <h2 className="text-sm font-medium">Team</h2>
                            <button
                              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1 transition-colors"
                              onClick={toggleAddMember}
                              aria-label="Add team member"
                            >
                              <Plus className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {teamMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`${member.color} rounded-full w-6 h-6 flex items-center justify-center`}
                                    >
                                      <span className="text-white text-xs">{member.initials}</span>
                                    </div>
                                    <div>
                                      <p className="text-sm">{member.name}</p>
                                      <p className="text-xs text-gray-400">{member.role}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {member.role !== "Owner" && (
                                      <select
                                        className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-md py-1 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                                        value={member.role}
                                        onChange={(e) => updateMemberRole(member.id, e.target.value)}
                                      >
                                        <option value="Collaborator">Collaborator</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Viewer">Viewer</option>
                                      </select>
                                    )}
                                    {member.role !== "Owner" && (
                                      <button
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                        onClick={() => removeMember(member.id)}
                                        aria-label="Remove team member"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {showAddMember && (
                                <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                                  <div className="flex gap-2 relative">
                                    <div className="flex-1 relative">
                                      <input
                                        ref={emailInputRef}
                                        type="email"
                                        placeholder="Add member by email"
                                        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-xs w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                                      />

                                      {/* Search Results Dropdown */}
                                      {showSearchResults && (
                                        <div
                                          ref={searchResultsRef}
                                          className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md overflow-hidden z-10 shadow-lg"
                                        >
                                          {searchResults.map((user) => (
                                            <div
                                              key={user.id}
                                              className="flex items-center gap-2 p-2 hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                                              onClick={() =>
                                                handleAddMember(user.email, user.name, user.initials, user.color)
                                              }
                                            >
                                              <div
                                                className={`${user.color} rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}
                                              >
                                                <span className="text-white text-xs">{user.initials}</span>
                                              </div>
                                              <div className="overflow-hidden">
                                                <p className="text-xs truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1 px-2 text-xs transition-colors"
                                      onClick={() => handleAddMember()}
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div
                          className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-right"
                          style={{ animationDelay: "0.2s" }}
                        >
                          <div className="border-b border-[#2a2a2a] p-4">
                            <h2 className="text-sm font-medium">Quick Stats</h2>
                          </div>
                          <div className="p-4">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-xs text-gray-400">Data Completeness</p>
                                  <span className="text-xs">98%</span>
                                </div>
                                <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                                  <div
                                    className="h-1 bg-green-500 rounded-full transition-all"
                                    style={{ width: "98%" }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-xs text-gray-400">Data Quality</p>
                                  <span className="text-xs">85%</span>
                                </div>
                                <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                                  <div
                                    className="h-1 bg-blue-500 rounded-full transition-all"
                                    style={{ width: "85%" }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-1">
                                  <p className="text-xs text-gray-400">Processing Speed</p>
                                  <span className="text-xs">76%</span>
                                </div>
                                <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
                                  <div
                                    className="h-1 bg-yellow-500 rounded-full transition-all"
                                    style={{ width: "76%" }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "data" && (
                    <div className="space-y-6">
                      {/* Column Statistics */}
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom">
                        <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-medium">Column Statistics</h2>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-[#1a1a1a]">
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Column Name
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Type
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Null Count
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Unique Values
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Min
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Max
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Mean
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {columnStats.map((column, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                                >
                                  <td className="px-4 py-2 text-gray-300">{column.name}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.type}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.nulls}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.unique}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.min || "-"}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.max || "-"}</td>
                                  <td className="px-4 py-2 text-gray-300">{column.mean || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Data Preview */}
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom">
                        <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-medium">Data Preview</h2>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                              <RefreshCw className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                              <Filter className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md p-1.5 transition-colors">
                              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-[#1a1a1a]">
                                {headers.map((header, index) => (
                                  <th
                                    key={index}
                                    className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]"
                                  >
                                    <div className="flex items-center gap-1">
                                      {header}
                                      <ChevronDown className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.map((row, rowIndex) => (
                                <tr
                                  key={rowIndex}
                                  className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                                >
                                  {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-2 text-gray-300">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="p-3 border-t border-[#2a2a2a] flex justify-between items-center">
                          <div className="text-xs text-gray-400">Showing 1-10 of {project.rows} rows</div>
                          <div className="flex items-center gap-1">
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                              Previous
                            </button>
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md px-2 py-1 text-xs transition-colors">
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analysis" && (
                    <div className="space-y-6">
                      {/* Data Quality Issues */}
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom">
                        <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-medium">Data Quality Issues</h2>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="bg-[#1a1a1a]">
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Issue Type
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Count
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Severity
                                </th>
                                <th className="px-4 py-2 text-left font-medium text-gray-400 border-b border-[#2a2a2a]">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataQualityIssues.map((issue, index) => (
                                <tr
                                  key={index}
                                  className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                                >
                                  <td className="px-4 py-2 text-gray-300">{issue.type}</td>
                                  <td className="px-4 py-2 text-gray-300">{issue.count}</td>
                                  <td className="px-4 py-2">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-xs ${
                                        issue.severity === "Low"
                                          ? "bg-green-900/30 text-green-400"
                                          : issue.severity === "Medium"
                                            ? "bg-yellow-900/30 text-yellow-400"
                                            : "bg-red-900/30 text-red-400"
                                      }`}
                                    >
                                      {issue.severity}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 text-gray-300">{issue.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Data Distribution */}
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom">
                        <div className="border-b border-[#2a2a2a] p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Table className="h-4 w-4 text-gray-400" />
                            <h2 className="text-sm font-medium">Data Distribution</h2>
                          </div>
                        </div>
                        <div className="p-4 space-y-6">
                          {dataDistribution.map((dist, index) => (
                            <div key={index}>
                              <h3 className="text-sm font-medium mb-2">{dist.category}</h3>
                              <div className="bg-[#1a1a1a] p-3 rounded-md">
                                <div className="flex items-center h-8">
                                  {dist.values.map((value, vIndex) => (
                                    <div
                                      key={vIndex}
                                      className="h-full bg-blue-500 first:rounded-l-md last:rounded-r-md flex items-center justify-center px-2 text-xs text-white"
                                      style={{ width: `${value.percentage}%` }}
                                    >
                                      {value.percentage > 10 ? `${value.name} (${value.percentage}%)` : ""}
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-2 space-y-1">
                                  {dist.values.map((value, vIndex) => (
                                    <div key={vIndex} className="flex justify-between text-xs">
                                      <span>{value.name}</span>
                                      <span>
                                        {value.count} ({value.percentage}%)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "settings" && (
                    <div className="space-y-6">
                      {/* Project Settings */}
                      <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md slide-in-bottom">
                        <div className="border-b border-[#2a2a2a] p-4">
                          <h2 className="text-sm font-medium">Project Settings</h2>
                        </div>
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Project Name</label>
                            <input
                              type="text"
                              value={project.name}
                              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={project.description}
                              rows={3}
                              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Tags</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.tags.map((tag, index) => (
                                <div
                                  key={index}
                                  className="bg-[#2a2a2a] text-xs px-2 py-1 rounded flex items-center gap-1"
                                >
                                  {tag}
                                  <button className="text-gray-400 hover:text-white">
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add a tag"
                                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 px-3 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                              />
                              <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium transition-colors">
                                Add
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Visibility</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="visibility"
                                  checked={visibility === "private"}
                                  onChange={() => setVisibility("private")}
                                  className="bg-[#1a1a1a] border border-[#2a2a2a] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                />
                                <span className="text-sm">Private</span>
                              </label>
                              <label className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="visibility"
                                  checked={visibility === "public"}
                                  onChange={() => setVisibility("public")}
                                  className="bg-[#1a1a1a] border border-[#2a2a2a] text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-transparent"
                                />
                                <span className="text-sm">Public</span>
                              </label>
                            </div>
                          </div>
                          <div className="pt-2">
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium transition-colors">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="bg-[#1e1e1e] border border-red-900/30 rounded-md slide-in-bottom">
                        <div className="border-b border-red-900/30 p-4">
                          <h2 className="text-sm font-medium text-red-400">Danger Zone</h2>
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-medium">Archive this project</h3>
                              <p className="text-xs text-gray-400">
                                Archive this project to make it read-only and hide it from the main view.
                              </p>
                            </div>
                            <button
                              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-red-400 rounded-md py-1.5 px-3 text-xs font-medium transition-colors"
                              onClick={() => handleDangerAction("archive")}
                            >
                              Archive
                            </button>
                          </div>
                          <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-medium">Transfer ownership</h3>
                              <p className="text-xs text-gray-400">Transfer this project to another team member.</p>
                            </div>
                            <button
                              className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-yellow-400 rounded-md py-1.5 px-3 text-xs font-medium transition-colors"
                              onClick={() => handleDangerAction("transfer")}
                            >
                              Transfer
                            </button>
                          </div>
                          <div className="border-t border-[#2a2a2a] pt-4 flex justify-between items-center">
                            <div>
                              <h3 className="text-sm font-medium">Delete this project</h3>
                              <p className="text-xs text-gray-400">
                                Once you delete a project, there is no going back. Please be certain.
                              </p>
                            </div>
                            <button
                              className="bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-md py-1.5 px-3 text-xs font-medium transition-colors"
                              onClick={() => handleDangerAction("delete")}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </AdvancedPageTransition>
              </>
            )}
          </main>
        </div>

        {/* Modal for danger zone actions */}
        {modalVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md w-full max-w-md p-6 animate-fade-in">
              {modalType === "archive" && (
                <>
                  <h2 className="text-lg font-medium mb-4">Archive Project</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Are you sure you want to archive this project? It will be moved to the archive and made read-only.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={executeDangerAction}
                    >
                      Archive
                    </button>
                  </div>
                </>
              )}

              {modalType === "transfer" && (
                <>
                  <h2 className="text-lg font-medium mb-4">Transfer Ownership</h2>
                  <p className="text-sm text-gray-400 mb-4">Select a team member to transfer ownership to:</p>
                  <div className="mb-6">
                    <select
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm w-full focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                      value={transferTargetId}
                      onChange={(e) => setTransferTargetId(e.target.value)}
                    >
                      <option value="">Select a team member</option>
                      {teamMembers
                        .filter((member) => member.role !== "Owner")
                        .map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={executeDangerAction}
                      disabled={!transferTargetId}
                    >
                      Transfer
                    </button>
                  </div>
                </>
              )}

              {modalType === "delete" && (
                <>
                  <h2 className="text-lg font-medium mb-4">Delete Project</h2>
                  <p className="text-sm text-gray-400 mb-6">
                    Are you sure you want to delete this project? This action cannot be undone and all data will be
                    permanently lost.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-md py-1.5 px-4 text-sm transition-colors"
                      onClick={executeDangerAction}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdvancedPageTransition>
  )
}
