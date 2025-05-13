"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, File } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useWorkspaceStore } from "@/lib/store"

export function ProjectSearch({ projectSlug, domain }: { projectSlug: string; domain: string }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { searchProjectFiles } = useWorkspaceStore()

  useEffect(() => {
    if (query.trim().length > 1) {
      setIsSearching(true)
      const searchResults = searchProjectFiles(domain, projectSlug, query)
      setResults(searchResults)
      setIsSearching(false)
    } else {
      setResults([])
    }
  }, [query, searchProjectFiles, domain, projectSlug])

  const handleSelect = (result: any) => {
    router.push(result.path)
    setQuery("")
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search in this project..."
          className="pl-10"
        />
      </div>

      {query.trim().length > 1 && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10">
          <div className="p-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleSelect(result)}
              >
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2 text-orange-500" />
                  <span className="font-medium">{result.title}</span>
                </div>
                {result.preview && <p className="text-sm text-muted-foreground mt-1">{result.preview}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
