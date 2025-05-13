"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, File, Folder } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkspaceStore } from "@/lib/store"

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const router = useRouter()
  const { searchAllFiles } = useWorkspaceStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (query.trim().length > 1) {
      const searchResults = searchAllFiles(query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query, searchAllFiles])

  const handleSelect = (result: any) => {
    router.push(result.path)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <>
      <div className="border-b border-border p-2 flex items-center">
        <Button
          variant="outline"
          className="w-full justify-between text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search across all workspaces...
          </div>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border border-border rounded-lg shadow-lg z-50"
            >
              <div className="flex items-center p-4 border-b border-border">
                <Search className="h-5 w-5 mr-2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search across all workspaces..."
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4">
                {query.trim().length > 1 ? (
                  results.length > 0 ? (
                    <ScrollArea className="h-[60vh] max-h-[500px]">
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => handleSelect(result)}
                          >
                            <div className="flex items-center mb-2">
                              {result.type === "file" ? (
                                <File className="h-4 w-4 mr-2 text-orange-500" />
                              ) : (
                                <Folder className="h-4 w-4 mr-2 text-orange-500" />
                              )}
                              <span className="font-medium">{result.title}</span>
                            </div>
                            {result.preview && <p className="text-sm text-muted-foreground">{result.preview}</p>}
                            <div className="mt-2 text-xs text-muted-foreground">{result.breadcrumb}</div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">No results found</p>
                    </div>
                  )
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">Type to search...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
