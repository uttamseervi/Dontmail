"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useWorkspaceStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { NewProjectDialog } from "@/components/new-project-dialog"

export default function DomainPage() {
  const params = useParams()
  const domain = params.domain as string
  const { getDomain } = useWorkspaceStore()
  const domainData = getDomain(domain)
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false)

  return (
    <div className="container mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-orange-500">{domain}</span> Workspace
          </h1>
          <Button onClick={() => setIsNewProjectDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {domainData && domainData.projects && domainData.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainData.projects.map((project, index) => (
              <ProjectCard key={index} project={project} domain={domain} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create your first project to get started</p>
            <Button onClick={() => setIsNewProjectDialogOpen(true)} className="bg-orange-500 hover:bg-orange-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        )}
      </motion.div>

      <NewProjectDialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen} domain={domain} />
    </div>
  )
}

function ProjectCard({ project, domain }: { project: any; domain: string }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="p-6 bg-card rounded-lg border border-border">
      <a href={`/${domain}/${project.name.toLowerCase().replace(/\s+/g, "-")}`}>
        <h3 className="text-xl font-medium mb-2">{project.name}</h3>
        <p className="text-muted-foreground mb-4">
          {project.folders?.length || 0} folders • {getFileCount(project)} files
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-orange-500">View project</span>
          <span className="text-xs text-muted-foreground">Updated {getRandomTimeAgo()}</span>
        </div>
      </a>
    </motion.div>
  )
}

function getFileCount(project: any): number {
  let count = 0
  if (project.folders) {
    project.folders.forEach((folder: any) => {
      count += folder.files?.length || 0
    })
  }
  return count
}

function getRandomTimeAgo(): string {
  const times = ["just now", "5 minutes ago", "1 hour ago", "yesterday", "2 days ago"]
  return times[Math.floor(Math.random() * times.length)]
}
