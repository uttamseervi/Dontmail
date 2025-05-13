"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useWorkspaceStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle, FolderPlus } from "lucide-react"
import { useState } from "react"
import { NewFolderDialog } from "@/components/new-folder-dialog"
import { NewFileDialog } from "@/components/new-file-dialog"
import { ProjectSearch } from "@/components/project-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderView } from "@/components/folder-view"
import { WhiteboardView } from "@/components/whiteboard-view"

export default function ProjectPage() {
  const params = useParams()
  const domain = params.domain as string
  const projectSlug = params.project as string
  const { getProject } = useWorkspaceStore()
  const project = getProject(domain, projectSlug)

  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false)

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist</p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    )
  }

  const projectName = project.name

  return (
    <div className="container mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">{projectName}</span>
            </h1>
            <div className="flex space-x-2">
              <Button onClick={() => setIsNewFolderDialogOpen(true)} variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button onClick={() => setIsNewFileDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
                <PlusCircle className="mr-2 h-4 w-4" />
                New File
              </Button>
            </div>
          </div>
          <ProjectSearch projectSlug={projectSlug} domain={domain} />
        </div>

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
          </TabsList>
          <TabsContent value="files">
            {project.folders && project.folders.length > 0 ? (
              <div className="space-y-6">
                {project.folders.map((folder: any, index: number) => (
                  <FolderView key={index} folder={folder} domain={domain} projectSlug={projectSlug} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
                <h3 className="text-xl font-medium mb-2">No folders yet</h3>
                <p className="text-muted-foreground mb-4">Create your first folder to organize your files</p>
                <Button onClick={() => setIsNewFolderDialogOpen(true)} variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Folder
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="whiteboard">
            <WhiteboardView projectName={projectName} />
          </TabsContent>
        </Tabs>
      </motion.div>

      <NewFolderDialog
        open={isNewFolderDialogOpen}
        onOpenChange={setIsNewFolderDialogOpen}
        domain={domain}
        projectSlug={projectSlug}
      />

      <NewFileDialog
        open={isNewFileDialogOpen}
        onOpenChange={setIsNewFileDialogOpen}
        domain={domain}
        projectSlug={projectSlug}
      />
    </div>
  )
}
