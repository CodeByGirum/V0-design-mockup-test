"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Mock user data for search suggestions
const mockUsers = [
  { id: "u1", email: "sarah.johnson@example.com", name: "Sarah Johnson", initials: "SJ", color: "bg-blue-500" },
  { id: "u2", email: "michael.chen@example.com", name: "Michael Chen", initials: "MC", color: "bg-green-500" },
  { id: "u3", email: "alex.rodriguez@example.com", name: "Alex Rodriguez", initials: "AR", color: "bg-purple-500" },
  { id: "u4", email: "emma.patel@example.com", name: "Emma Patel", initials: "EP", color: "bg-amber-500" },
  { id: "u5", email: "david.kim@example.com", name: "David Kim", initials: "DK", color: "bg-pink-500" },
  { id: "u6", email: "olivia.smith@example.com", name: "Olivia Smith", initials: "OS", color: "bg-indigo-500" },
  { id: "u7", email: "james.wilson@example.com", name: "James Wilson", initials: "JW", color: "bg-teal-500" },
  { id: "u8", email: "sophia.garcia@example.com", name: "Sophia Garcia", initials: "SG", color: "bg-rose-500" },
]

interface TeamMemberSearchProps {
  onAddMember: (member: any) => void
}

export function TeamMemberSearch({ onAddMember }: TeamMemberSearchProps) {
  const [email, setEmail] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions based on input
  useEffect(() => {
    if (email.trim() === "") {
      setSuggestions([])
      return
    }

    const filtered = mockUsers
      .filter(
        (user) =>
          user.email.toLowerCase().includes(email.toLowerCase()) ||
          user.name.toLowerCase().includes(email.toLowerCase()),
      )
      .slice(0, 5) // Limit to 5 suggestions

    setSuggestions(filtered)
    setShowSuggestions(filtered.length > 0)
  }, [email])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleAddMember = () => {
    if (email.trim() === "") return

    // Check if the email matches any suggestion
    const matchedUser = suggestions.find((user) => user.email.toLowerCase() === email.toLowerCase())

    if (matchedUser) {
      onAddMember(matchedUser)
    } else {
      // Generate a new user if no match
      const nameParts = email.split("@")[0].split(".")
      const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : ""
      const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : ""
      const name = `${firstName} ${lastName}`.trim() || "New User"
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      // Generate a random color
      const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-purple-500",
        "bg-amber-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-teal-500",
        "bg-rose-500",
      ]
      const color = colors[Math.floor(Math.random() * colors.length)]

      onAddMember({
        id: `new-${Date.now()}`,
        email,
        name,
        initials,
        color,
      })
    }

    setEmail("")
    setShowSuggestions(false)
  }

  const handleSelectSuggestion = (user: any) => {
    onAddMember(user)
    setEmail("")
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => email.trim() !== "" && setSuggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddMember()
              }
            }}
            className="pl-9"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <Button onClick={handleAddMember}>Add</Button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg"
        >
          <ul className="py-1 text-sm">
            {suggestions.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => handleSelectSuggestion(user)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className={`text-xs text-white ${user.color}`}>{user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
