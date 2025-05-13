"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useWorkspaceStore } from "@/lib/store"

export function NewFileDialog({
  open,
  onOpenChange,
  domain,
  projectSlug,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  domain: string
  projectSlug: string
}) {
  const [fileName, setFileName] = useState("")
  const [fileType, setFileType] = useState("markdown")
  const [folderName, setFolderName] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState("")

  const { getProject, addFile } = useWorkspaceStore()
  const project = getProject(domain, projectSlug)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileName.trim()) {
      setError("File name is required")
      return
    }

    if (!folderName) {
      setError("Please select a folder")
      return
    }

    // Add file extension if not present
    let title = fileName
    if (fileType === "markdown" && !title.endsWith(".md")) {
      title += ".md"
    } else if (fileType === "json" && !title.endsWith(".json")) {
      title += ".json"
    } else if (fileType === "text" && !title.endsWith(".txt")) {
      title += ".txt"
    }

    addFile(domain, projectSlug, folderName, {
      title,
      type: fileType,
      content: content || getDefaultContent(fileType),
    })

    setFileName("")
    setContent("")
    onOpenChange(false)
  }

  const getDefaultContent = (type: string) => {
    switch (type) {
      case "markdown":
        return "# New Document\n\nStart writing here..."
      case "json":
        return '{\n  "key": "value"\n}'
      case "text":
      default:
        return "This is a new text file."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create new file</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="file-name">File name</Label>
                <Input
                  id="file-name"
                  value={fileName}
                  onChange={(e) => {
                    setFileName(e.target.value)
                    setError("")
                  }}
                  placeholder="document"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file-type">File type</Label>
                <Select value={fileType} onValueChange={(value) => setFileType(value)}>
                  <SelectTrigger id="file-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                    <SelectItem value="text">Text (.txt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="folder">Folder</Label>
              <Select
                value={folderName}
                onValueChange={(value) => {
                  setFolderName(value)
                  setError("")
                }}
              >
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {project?.folders?.map((folder: any, index: number) => (
                    <SelectItem key={index} value={folder.name}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content (optional)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={getDefaultContent(fileType)}
                rows={5}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Create File
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
