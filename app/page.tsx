"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import {
  Search,
  Plus,
  BarChart2,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  ChevronDown,
  X,
  Check,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { ProjectsSection } from "@/components/projects-section"
import { StatsCard } from "@/components/stats-card"
import { FileUploadWizard } from "@/components/file-upload-wizard"
import type { ProjectData } from "@/components/project-card"

type ViewMode = "grid" | "list"
type StatusFilter = "all" | "planning" | "in-progress" | "completed"
type TagFilter = string | null
type SortOption = "name" | "progress" | "date"
type SortDirection = "asc" | "desc"

export default function Dashboard() {
  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [tagFilter, setTagFilter] = useState<TagFilter>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // New project modal state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  // Filter dropdown ref for click outside detection
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Sample project data with favorited property
  const [projects, setProjects] = useState<ProjectData[]>([
    {
      id: "random_kdd_dataset",
      title: "random_kdd_dataset.csv",
      description: "KDD1999 DATASET",
      progress: 0,
      status: "Planning",
      tags: ["CSV"],
      favorited: true,
    },
    {
      id: "50x50_table",
      title: "50x50_table.csv",
      description: "50 by 50 table",
      progress: 0,
      status: "Planning",
      tags: ["Table"],
      favorited: false,
    },
    {
      id: "bad_data",
      title: "bad_data.csv",
      description: "byovyo",
      progress: 45,
      status: "In Progress",
      tags: ["CSV"],
      favorited: false,
    },
    {
      id: "completed_project",
      title: "completed_project.csv",
      description: "Completed project example",
      progress: 100,
      status: "Completed",
      tags: ["CSV", "Dataset"],
      favorited: true,
    },
  ])

  // Toggle favorite status for a project
  const toggleFavorite = (id: string) => {
    setProjects(
      projects.map((project) => (project.id === id ? { ...project, favorited: !project.favorited } : project)),
    )
  }

  // Handle new project creation
  const handleNewProject = (projectData: any) => {
    // Create a new project from the form data
    const newProject: ProjectData = {
      id: Date.now().toString(),
      title: projectData.name,
      description: projectData.description || "",
      progress: 0,
      status: "Planning",
      tags: projectData.category ? [projectData.category] : ["CSV"],
      favorited: false,
    }

    setProjects([newProject, ...projects])
  }

  // Get all unique tags from projects
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [projects])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort projects based on current filters
  const filteredProjects = useMemo(() => {
    let result = [...projects]

    // Filter by favorites
    if (showFavoritesOnly) {
      result = result.filter((project) => project.favorited)
    }

    // Filter by status
    if (statusFilter !== "all") {
      const normalizedStatus =
        statusFilter === "planning" ? "Planning" : statusFilter === "in-progress" ? "In Progress" : "Completed"

      result = result.filter((project) => project.status === normalizedStatus)
    }

    // Filter by tag
    if (tagFilter) {
      result = result.filter((project) => project.tags.includes(tagFilter))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Sort projects
    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === "name") {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === "progress") {
        comparison = a.progress - b.progress
      } else if (sortBy === "date") {
        // For demo purposes, we'll sort by ID since we don't have actual dates
        comparison = a.id.localeCompare(b.id)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [projects, statusFilter, tagFilter, searchQuery, showFavoritesOnly, sortBy, sortDirection])

  // Group projects by status
  const planningProjects = filteredProjects.filter((p) => p.status === "Planning")
  const inProgressProjects = filteredProjects.filter((p) => p.status === "In Progress")
  const completedProjects = filteredProjects.filter((p) => p.status === "Completed")

  // Count of favorited projects
  const favoritedProjectsCount = projects.filter((p) => p.favorited).length

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all")
    setTagFilter(null)
    setSearchQuery("")
    setShowFavoritesOnly(false)
    setSortBy("name")
    setSortDirection("asc")
  }

  return (
    <AdvancedPageTransition type="perspective" duration={0.5}>
      <div className="flex flex-col min-h-screen bg-[#121212] text-white">
        {/* Header */}
        <header className="border-b border-[#2a2a2a] px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-medium">Sweepo</h1>
            <nav className="flex items-center gap-4">
              <Link href="#" className="text-white text-xs px-3 py-1 rounded bg-[#2a2a2a] transition-colors">
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Projects
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-400 hover:text-white text-xs transition-colors">
              How it works
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xs transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xs transition-colors">
              Contact Us
            </Link>
            <div className="flex items-center gap-2">
              <Link href="#" className="text-gray-400 hover:text-white text-xs transition-colors">
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
          {/* Sidebar */}
          <div className="w-56 border-r border-[#2a2a2a] p-4 fade-in">
            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowFavoritesOnly(false)
                    setStatusFilter("all")
                  }}
                  className={`w-full flex items-center gap-2 text-xs ${!showFavoritesOnly && statusFilter === "all" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <Grid className="h-3.5 w-3.5" />
                  <span>All Projects</span>
                  <span className="ml-auto bg-[#3a3a3a] text-xs px-1.5 rounded">{projects.length}</span>
                </button>
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`w-full flex items-center gap-2 text-xs ${showFavoritesOnly ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <Star className="h-3.5 w-3.5" fill={showFavoritesOnly ? "currentColor" : "none"} />
                  <span>Favorites</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">{favoritedProjectsCount}</span>
                </button>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-xs text-gray-400 py-1.5 px-2 hover:bg-[#1e1e1e] rounded transition-colors"
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Recent</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">5</span>
                </Link>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Status</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`w-full flex items-center gap-2 text-xs ${statusFilter === "all" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                  <span>All</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">{projects.length}</span>
                </button>
                <button
                  onClick={() => setStatusFilter("planning")}
                  className={`w-full flex items-center gap-2 text-xs ${statusFilter === "planning" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span>Planning</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">
                    {projects.filter((p) => p.status === "Planning").length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("in-progress")}
                  className={`w-full flex items-center gap-2 text-xs ${statusFilter === "in-progress" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span>In Progress</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">
                    {projects.filter((p) => p.status === "In Progress").length}
                  </span>
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`w-full flex items-center gap-2 text-xs ${statusFilter === "completed" ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                >
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span>Completed</span>
                  <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">
                    {projects.filter((p) => p.status === "Completed").length}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">Tags</h3>
              <div className="space-y-1">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={`w-full flex items-center gap-2 text-xs ${tagFilter === tag ? "text-white bg-[#2a2a2a]" : "text-gray-400 hover:bg-[#1e1e1e]"} py-1.5 px-2 rounded transition-colors text-left`}
                  >
                    <span>{tag}</span>
                    <span className="ml-auto bg-[#1e1e1e] text-xs px-1.5 rounded">
                      {projects.filter((p) => p.tags.includes(tag)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-auto">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="Total Projects"
                value={projects.length}
                icon={<BarChart2 className="h-4 w-4 text-gray-400" />}
                delay={0}
              />
              <StatsCard
                title="In Planning"
                value={projects.filter((p) => p.status === "Planning").length}
                icon={<BarChart2 className="h-4 w-4 text-gray-400" />}
                delay={1}
              />
              <StatsCard
                title="In Progress"
                value={projects.filter((p) => p.status === "In Progress").length}
                icon={<BarChart2 className="h-4 w-4 text-gray-400" />}
                delay={2}
              />
              <StatsCard
                title="Completed"
                value={projects.filter((p) => p.status === "Completed").length}
                icon={<BarChart2 className="h-4 w-4 text-gray-400" />}
                delay={3}
              />
            </div>

            {/* Projects Header */}
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 slide-in-bottom"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Projects</h2>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`${viewMode === "grid" ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"} p-1 rounded transition-colors hover:bg-[#3a3a3a]`}
                    aria-label="Grid view"
                  >
                    <Grid className={`h-3.5 w-3.5 ${viewMode === "grid" ? "text-white" : "text-gray-400"}`} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`${viewMode === "list" ? "bg-[#2a2a2a]" : "bg-[#1a1a1a]"} p-1 rounded transition-colors hover:bg-[#3a3a3a]`}
                    aria-label="List view"
                  >
                    <List className={`h-3.5 w-3.5 ${viewMode === "list" ? "text-white" : "text-gray-400"}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <input
                    type="text"
                    placeholder="Search projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-md py-1.5 pl-8 pr-3 text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all"
                  />
                  <Search className="absolute left-2.5 top-1.5 h-3.5 w-3.5 text-gray-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1.5 text-gray-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`${showFilters ? "bg-[#2a2a2a] text-white" : "bg-[#1a1a1a] text-gray-400"} border border-[#2a2a2a] rounded-md p-1.5 flex items-center gap-1 transition-colors hover:bg-[#2a2a2a] hover:text-white`}
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span className="text-xs">Filter</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>

                  {/* Filter Dropdown */}
                  {showFilters && (
                    <div className="absolute right-0 mt-1 w-64 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-10">
                      <div className="p-3">
                        <h4 className="text-xs font-medium mb-2">Sort by</h4>
                        <div className="space-y-1 mb-3">
                          <button
                            onClick={() => setSortBy("name")}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="h-3.5 w-3.5 text-gray-400" />
                              <span>Name</span>
                            </div>
                            {sortBy === "name" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortBy("progress")}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <BarChart2 className="h-3.5 w-3.5 text-gray-400" />
                              <span>Progress</span>
                            </div>
                            {sortBy === "progress" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortBy("date")}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>Date</span>
                            </div>
                            {sortBy === "date" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                        </div>

                        <h4 className="text-xs font-medium mb-2">Direction</h4>
                        <div className="space-y-1 mb-3">
                          <button
                            onClick={() => setSortDirection("asc")}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <SortAsc className="h-3.5 w-3.5 text-gray-400" />
                              <span>Ascending</span>
                            </div>
                            {sortDirection === "asc" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                          <button
                            onClick={() => setSortDirection("desc")}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <SortDesc className="h-3.5 w-3.5 text-gray-400" />
                              <span>Descending</span>
                            </div>
                            {sortDirection === "desc" && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                        </div>

                        <h4 className="text-xs font-medium mb-2">Show</h4>
                        <div className="space-y-1 mb-3">
                          <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className="w-full flex items-center justify-between text-xs text-gray-300 py-1 px-2 hover:bg-[#2a2a2a] rounded transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Star className="h-3.5 w-3.5 text-gray-400" />
                              <span>Favorites only</span>
                            </div>
                            {showFavoritesOnly && <Check className="h-3.5 w-3.5 text-blue-400" />}
                          </button>
                        </div>

                        <div className="pt-2 border-t border-[#2a2a2a]">
                          <button
                            onClick={resetFilters}
                            className="w-full text-xs text-blue-400 hover:text-blue-300 py-1"
                          >
                            Reset all filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsNewProjectModalOpen(true)}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1.5 px-3 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New project
                </button>
              </div>
            </div>

            {/* Active filters */}
            {(statusFilter !== "all" ||
              tagFilter ||
              searchQuery ||
              showFavoritesOnly ||
              sortBy !== "name" ||
              sortDirection !== "asc") && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400">Active filters:</span>

                {statusFilter !== "all" && (
                  <div className="bg-[#2a2a2a] rounded-md py-1 px-2 text-xs flex items-center gap-1">
                    <span>Status: {statusFilter.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                    <button onClick={() => setStatusFilter("all")} className="text-gray-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {tagFilter && (
                  <div className="bg-[#2a2a2a] rounded-md py-1 px-2 text-xs flex items-center gap-1">
                    <span>Tag: {tagFilter}</span>
                    <button onClick={() => setTagFilter(null)} className="text-gray-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {searchQuery && (
                  <div className="bg-[#2a2a2a] rounded-md py-1 px-2 text-xs flex items-center gap-1">
                    <span>Search: {searchQuery}</span>
                    <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {showFavoritesOnly && (
                  <div className="bg-[#2a2a2a] rounded-md py-1 px-2 text-xs flex items-center gap-1">
                    <span>Favorites only</span>
                    <button onClick={() => setShowFavoritesOnly(false)} className="text-gray-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {(sortBy !== "name" || sortDirection !== "asc") && (
                  <div className="bg-[#2a2a2a] rounded-md py-1 px-2 text-xs flex items-center gap-1">
                    <span>
                      Sort: {sortBy} ({sortDirection})
                    </span>
                    <button
                      onClick={() => {
                        setSortBy("name")
                        setSortDirection("asc")
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <button onClick={resetFilters} className="text-xs text-blue-400 hover:text-blue-300">
                  Clear all
                </button>
              </div>
            )}

            {/* Project Categories */}
            {filteredProjects.length === 0 ? (
              <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
                <p className="text-gray-400 text-sm">No projects found matching your filters.</p>
                <button onClick={resetFilters} className="mt-2 text-xs text-blue-400 hover:text-blue-300">
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {planningProjects.length > 0 && (
                  <ProjectsSection
                    title="Planning"
                    projects={planningProjects}
                    delay={0}
                    viewMode={viewMode}
                    onFavoriteToggle={toggleFavorite}
                  />
                )}
                {inProgressProjects.length > 0 && (
                  <ProjectsSection
                    title="In Progress"
                    projects={inProgressProjects}
                    delay={0.1}
                    viewMode={viewMode}
                    onFavoriteToggle={toggleFavorite}
                  />
                )}
                {completedProjects.length > 0 && (
                  <ProjectsSection
                    title="Completed"
                    projects={completedProjects}
                    delay={0.2}
                    viewMode={viewMode}
                    onFavoriteToggle={toggleFavorite}
                  />
                )}
              </>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#2a2a2a] py-3 px-8">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">© 2025 Sweepo. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </footer>

        {/* File Upload Wizard */}
        <FileUploadWizard
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onComplete={handleNewProject}
        />
      </div>
    </AdvancedPageTransition>
  )
}
