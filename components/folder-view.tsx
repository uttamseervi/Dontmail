"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, File, FileText, FileJson, PlusCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewFileDialog } from "@/components/new-file-dialog"
import { useToast } from "@/hooks/use-toast"

export function FolderView({
  folder,
  domain,
  projectSlug,
}: {
  folder: any
  domain: string
  projectSlug: string
}) {
  const [isOpen, setIsOpen] = useState(true)
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false)
  const router = useRouter()
  const folderSlug = folder.name.toLowerCase().replace(/\s+/g, "-")
  const { toast } = useToast()

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "markdown":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "json":
        return <FileJson className="h-4 w-4 text-green-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          {isOpen ? (
            <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
          )}
          <h3 className="font-medium">{folder.name}</h3>
          <span className="ml-2 text-sm text-muted-foreground">{folder.files?.length || 0} files</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setIsNewFileDialogOpen(true)
          }}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add File
        </Button>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {folder.files && folder.files.length > 0 ? (
            folder.files.map((file: any, index: number) => (
              <FileCard key={index} file={file} domain={domain} projectSlug={projectSlug} folderSlug={folderSlug} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-md">
              <p className="text-muted-foreground mb-2">No files in this folder</p>
              <Button variant="outline" size="sm" onClick={() => setIsNewFileDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" />
                Add File
              </Button>
            </div>
          )}
        </div>
      )}

      <NewFileDialog
        open={isNewFileDialogOpen}
        onOpenChange={setIsNewFileDialogOpen}
        domain={domain}
        projectSlug={projectSlug}
      />
    </div>
  )
}

function FileCard({
  file,
  domain,
  projectSlug,
  folderSlug,
}: {
  file: any
  domain: string
  projectSlug: string
  folderSlug: string
}) {
  const router = useRouter()
  const fileSlug = file.title.toLowerCase().replace(/\s+/g, "-")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const filePath = `/${domain}/${projectSlug}/${folderSlug}/${fileSlug}`

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Create full URL
    const fullUrl = `${window.location.origin}${filePath}`
    navigator.clipboard.writeText(fullUrl)

    setIsCopied(true)
    toast({
      title: "Link copied",
      description: "File link copied to clipboard",
      variant: "success",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "markdown":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "json":
        return <FileJson className="h-4 w-4 text-green-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="p-3 bg-background rounded-md border border-border hover:border-orange-500/50 cursor-pointer group relative"
      onClick={() => router.push(filePath)}
    >
      <div className="flex items-center mb-2">
        {getFileIcon(file.type)}
        <span className="ml-2 font-medium">{file.title}</span>
      </div>
      <p className="text-xs text-muted-foreground truncate">
        {file.content.substring(0, 50)}
        {file.content.length > 50 ? "..." : ""}
      </p>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
        onClick={handleCopyPath}
      >
        {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
    </motion.div>
  )
}
