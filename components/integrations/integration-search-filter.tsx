/**
 * Purpose: Provides UI for category filtering. Search input is now separate.
 * Used in: app/integrations/page.tsx (conditionally rendered)
 */
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IntegrationSearchFilterProps {
  selectedCategory: string
  onSelectedCategoryChange: (category: string) => void
  categories: readonly string[]
}

export function IntegrationSearchFilter({
  selectedCategory,
  onSelectedCategoryChange,
  categories,
}: IntegrationSearchFilterProps) {
  return (
    <div>
      <label htmlFor="integration-category" className="block text-sm font-medium text-gray-400 mb-1.5">
        Filter by Category
      </label>
      <Select value={selectedCategory} onValueChange={onSelectedCategoryChange}>
        <SelectTrigger className="w-full bg-[#222222] border-[#383838] text-sm rounded-md py-2.5 focus:border-gray-500 focus:ring-gray-500/50 text-gray-300">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="bg-[#222222] border-[#383838] text-gray-300">
          <SelectItem value="all" className="hover:!bg-[#2a2a2a] focus:!bg-[#2a2a2a]">
            All Categories
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="hover:!bg-[#2a2a2a] focus:!bg-[#2a2a2a]">
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
