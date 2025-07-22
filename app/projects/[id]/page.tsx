"use client"

import { useState } from "react"
import Link from "next/link"
import { AdvancedPageTransition } from "@/components/advanced-page-transition"
import { useTransition } from "@/components/transition-provider"
import { ProjectDetails } from "@/components/project-details"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { transitionType, transitionDuration } = useTransition()

  // Mock project data - in a real app, this would be fetched based on params.id
  const [project] = useState({
    id: params.id,
    name: "random_kdd_dataset.csv",
    description: "KDD1999 DATASET",
    tags: ["CSV", "Dataset", "Security"],
    visibility: "private",
    team: [
      { id: "1", name: "Alice", avatar: "A" },
      { id: "2", name: "Bob", avatar: "B" },
    ],
    createdAt: "2023-10-26T10:00:00Z",
    updatedAt: "2023-10-26T12:30:00Z",
  })

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
              Signout
            </Link>
            <div className="bg-[#2a2a2a] rounded-full w-6 h-6 flex items-center justify-center">
              <span className="text-white text-xs">👤</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <ProjectDetails project={project} />
        </main>
      </div>
    </AdvancedPageTransition>
  )
}
