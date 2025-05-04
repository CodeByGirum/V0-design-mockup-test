import { ProjectCard, type ProjectData } from "./project-card"
import { ProjectCardSkeleton } from "./project-card-skeleton"
import { ProjectListItem } from "./project-list-item"

interface ProjectsSectionProps {
  title: string
  projects: ProjectData[]
  isLoading?: boolean
  delay?: number
  viewMode: "grid" | "list"
  onFavoriteToggle?: (id: string) => void
}

export function ProjectsSection({
  title,
  projects,
  isLoading = false,
  delay = 0,
  viewMode,
  onFavoriteToggle,
}: ProjectsSectionProps) {
  return (
    <div className="mb-6 slide-in-bottom" style={{ animationDelay: `${0.6 + delay}s` }}>
      <h3 className="text-xs uppercase text-gray-500 font-medium mb-3">{title}</h3>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Show skeletons when loading
            Array.from({ length: 2 }).map((_, index) => <ProjectCardSkeleton key={index} />)
          ) : projects.length > 0 ? (
            // Show projects if available
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} onFavoriteToggle={onFavoriteToggle} />
            ))
          ) : (
            // Show empty state
            <div className="col-span-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
              <p className="text-gray-400 text-sm">No {title.toLowerCase()} projects found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            // Show skeletons when loading
            Array.from({ length: 2 }).map((_, index) => <ProjectCardSkeleton key={index} />)
          ) : projects.length > 0 ? (
            // Show projects if available
            projects.map((project) => (
              <ProjectListItem key={project.id} project={project} onFavoriteToggle={onFavoriteToggle} />
            ))
          ) : (
            // Show empty state
            <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-md p-6 text-center">
              <p className="text-gray-400 text-sm">No {title.toLowerCase()} projects found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
