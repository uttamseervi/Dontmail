"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronRight, File, Folder, Home, LogOut, PlusCircle, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkspaceStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function Sidebar() {
  const params = useParams()
  const router = useRouter()
  const domain = params.domain as string
  const projectSlug = params.project as string
  const { getDomain } = useWorkspaceStore()
  const { toast } = useToast()
  const domainData = getDomain(domain)

  const handleLogout = () => {
    // Remove authentication status from session storage
    sessionStorage.removeItem(`auth_${domain}`)

    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "success",
    })

    router.push("/")
  }

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold">
            {domain.charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 font-semibold">{domain}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/${domain}`)}>
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Projects</h3>
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => router.push(`/${domain}`)}>
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          {domainData?.projects?.map((project, index) => (
            <ProjectItem
              key={index}
              project={project}
              domain={domain}
              isActive={projectSlug === project.name.toLowerCase().replace(/\s+/g, "-")}
            />
          ))}
        </div>
      </ScrollArea>

      {/* <div className="p-4 border-t border-border"> */}
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/${domain}/custom-search`)}>
        <Search className="mr-2 h-4 w-4" />
        Browser
      </Button>
      {/* </div> */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(`/${domain}/profile`)}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </Button>
      </div>
    </div>
  )
}

function ProjectItem({ project, domain, isActive }: { project: any; domain: string; isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(isActive)
  const router = useRouter()
  const projectSlug = project.name.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-md text-sm cursor-pointer",
          isActive ? "bg-orange-500/10 text-orange-500" : "hover:bg-muted",
        )}
        onClick={() => {
          setIsOpen(!isOpen)
          router.push(`/${domain}/${projectSlug}`)
        }}
      >
        {project.folders && project.folders.length > 0 ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
          )
        ) : (
          <div className="w-4 mr-1" />
        )}
        <span>{project.name}</span>
      </div>

      <AnimatePresence>
        {isOpen && project.folders && project.folders.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 pl-2 border-l border-border"
          >
            {project.folders.map((folder: any, index: number) => (
              <FolderItem key={index} folder={folder} domain={domain} projectSlug={projectSlug} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FolderItem({ folder, domain, projectSlug }: { folder: any; domain: string; projectSlug: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const folderSlug = folder.name.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="mb-1">
      <div
        className="flex items-center py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-muted"
        onClick={() => setIsOpen(!isOpen)}
      >
        {folder.files && folder.files.length > 0 ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
          )
        ) : (
          <div className="w-4 mr-1" />
        )}
        <Folder className="h-4 w-4 mr-1 shrink-0" />
        <span>{folder.name}</span>
      </div>

      <AnimatePresence>
        {isOpen && folder.files && folder.files.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 pl-2 border-l border-border"
          >
            {folder.files.map((file: any, index: number) => (
              <FileItem key={index} file={file} domain={domain} projectSlug={projectSlug} folderSlug={folderSlug} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FileItem({
  file,
  domain,
  projectSlug,
  folderSlug,
}: { file: any; domain: string; projectSlug: string; folderSlug: string }) {
  const router = useRouter()
  const fileSlug = file.title.toLowerCase().replace(/\s+/g, "-")

  return (
    <div
      className="flex items-center py-1 px-2 rounded-md text-sm cursor-pointer hover:bg-muted"
      onClick={() => router.push(`/${domain}/${projectSlug}/${folderSlug}/${fileSlug}`)}
    >
      <File className="h-4 w-4 mr-1 shrink-0" />
      <span>{file.title}</span>
    </div>
  )
}
