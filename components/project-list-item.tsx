"use client"

import Link from "next/link"
import { Settings, Star } from "lucide-react"
import type { ProjectData } from "./project-card"

interface ProjectListItemProps {
  project: ProjectData
  className?: string
  onFavoriteToggle?: (id: string) => void
}

export function ProjectListItem({ project, className = "", onFavoriteToggle }: ProjectListItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "text-yellow-400"
      case "In Progress":
        return "text-blue-400"
      case "Completed":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-yellow-500"
      case "In Progress":
        return "bg-blue-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div
      className={`bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden group hover:border-gray-500 transition-all hover:translate-y-[-2px] hover:shadow-lg ${className}`}
    >
      <div className="p-3 flex items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">{project.title}</h3>
            <div className="flex items-center gap-1">
              <span
                className={`bg-[#2a2a2a] ${getStatusColor(project.status)} text-xs px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]`}
              >
                {project.status}
              </span>
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
          <p className="text-gray-400 text-xs mt-1">{project.description}</p>
        </div>

        <div className="w-32 px-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs">{project.progress}%</span>
          </div>
          <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
            <div
              className={`h-1 rounded-full transition-all ${getProgressBarColor(project.status)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            className={`${project.favorited ? "bg-[#3a3a3a] text-yellow-400" : "bg-[#2a2a2a] text-gray-400 opacity-0 group-hover:opacity-100"} transition-all p-1 rounded hover:bg-[#3a3a3a]`}
            onClick={() => onFavoriteToggle?.(project.id)}
            aria-label={project.favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className="h-3 w-3" fill={project.favorited ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/projects/${project.id}`}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-md py-1 px-2 text-xs transition-colors"
          >
            View
          </Link>
          {project.icon || <Settings className="h-4 w-4 text-gray-400" />}
        </div>
      </div>
    </div>
  )
}
