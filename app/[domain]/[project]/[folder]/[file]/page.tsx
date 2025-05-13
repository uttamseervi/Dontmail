"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useWorkspaceStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react"
import { FileViewer } from "@/components/file-viewer"
import { AIFeatures } from "@/components/ai-features"

export default function FilePage() {
  const params = useParams()
  const router = useRouter()
  const domain = params.domain as string
  const projectSlug = params.project as string
  const folderName = params.folder as string
  const fileName = params.file as string

  const { getFile, deleteFile } = useWorkspaceStore()
  const file = getFile(domain, projectSlug, folderName, fileName)

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">File not found</h2>
        <p className="text-muted-foreground mb-4">The file you're looking for doesn't exist</p>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this file?")) {
      deleteFile(domain, projectSlug, folderName, fileName)
      router.back()
    }
  }

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.back()} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{file.title}</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <FileViewer file={file} />
          </div>
          <div className="bg-card rounded-lg border border-border p-6">
            <AIFeatures file={file} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
