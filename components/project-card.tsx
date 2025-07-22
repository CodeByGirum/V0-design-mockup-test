"use client"

import type React from "react"
import Link from "next/link"
import { Settings, Star } from "lucide-react"

export interface ProjectData {
  id: string
  title: string
  description: string
  progress: number
  status: "Planning" | "In Progress" | "Completed"
  tags: string[]
  icon?: React.ReactNode
  favorited?: boolean
}

interface ProjectCardProps {
  project: ProjectData
  className?: string
  onFavoriteToggle?: (id: string) => void
}

export function ProjectCard({ project, className = "", onFavoriteToggle }: ProjectCardProps) {
  return (
    <div
      className={`bg-[#1e1e1e] border border-[#2a2a2a] rounded-md overflow-hidden group hover:border-gray-400 transition-all hover:translate-y-[-2px] hover:shadow-lg ${className}`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-medium">{project.title}</h3>
            <p className="text-gray-400 text-xs">{project.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`${project.favorited ? "bg-[#3a3a3a] text-gray-200" : "bg-[#2a2a2a] text-gray-400 opacity-0 group-hover:opacity-100"} transition-all p-1 rounded hover:bg-[#3a3a3a]`}
              onClick={() => onFavoriteToggle?.(project.id)}
              aria-label={project.favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className="h-3 w-3" fill={project.favorited ? "currentColor" : "none"} />
            </button>
            <Link
              href={`/projects/${project.id}/settings`}
              className="bg-[#2a2a2a] text-gray-400 p-1 rounded hover:bg-[#3a3a3a] transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Project settings"
            >
              <Settings className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs">{project.progress}%</span>
          </div>
          <div className="h-1 w-full bg-[#2a2a2a] rounded-full">
            <div
              className="h-1 rounded-full transition-all bg-gray-500"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-1">
            <span className="bg-[#2a2a2a] text-gray-300 text-xs px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]">
              {project.status}
            </span>
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#2a2a2a] text-gray-300 text-xs px-2 py-0.5 rounded transition-colors hover:bg-[#3a3a3a]"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link href={`/projects/${project.id}`} className="text-xs text-gray-400 hover:text-white transition-colors">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
