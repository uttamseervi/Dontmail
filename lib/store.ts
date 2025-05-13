import { create } from "zustand"

// Initial dummy data
const initialData = {
  somanath: {
    password: "1234",
    email: "somanath@example.com",
    phone: "+1234567890",
    projects: [
      {
        name: "Hackathon",
        folders: [
          {
            name: "Planning",
            files: [
              {
                title: "idea.md",
                type: "markdown",
                content:
                  "# Big Idea\n\nCreate a collaborative workspace with AI-powered tools to enhance productivity and creativity.\n\n## Features\n\n- Real-time collaboration\n- AI-powered suggestions\n- Universal search\n- File organization",
              },
              {
                title: "team.json",
                type: "json",
                content:
                  '{ "members": ["Alex", "Somanath", "Jamie", "Taylor"], "roles": { "Alex": "Frontend", "Somanath": "Backend", "Jamie": "Design", "Taylor": "AI" } }',
              },
            ],
          },
          {
            name: "Research",
            files: [
              {
                title: "competitors.txt",
                type: "text",
                content:
                  "Competitor Analysis:\n\n1. Notion - Great for docs, weak for real-time\n2. Figma - Strong design focus, limited file types\n3. Miro - Good for whiteboards, not for document management",
              },
            ],
          },
        ],
      },
      {
        name: "Marketing Campaign",
        folders: [
          {
            name: "Content",
            files: [
              {
                title: "social-posts.md",
                type: "markdown",
                content:
                  '# Social Media Campaign\n\n## Twitter\n\n- Launch announcement: "Excited to introduce our new product! #innovation"\n- Feature highlight: "Discover how our AI can boost your productivity"\n\n## LinkedIn\n\n- Detailed product overview\n- Customer success stories',
              },
            ],
          },
        ],
      },
    ],
  },
  design: {
    email: "design@example.com",
    projects: [
      {
        name: "Website Redesign",
        folders: [
          {
            name: "Mockups",
            files: [
              {
                title: "homepage.md",
                type: "markdown",
                content:
                  '# Homepage Design\n\n## Hero Section\n\n- Bold headline: "Transform Your Workflow"\n- Animated illustration of the product\n- CTA button: "Get Started"\n\n## Features Section\n\n- 3-column layout\n- Icon + heading + description for each feature',
              },
            ],
          },
        ],
      },
    ],
  },
}

type WorkspaceStore = {
  domains: Record<string, any>
  currentDomain: string

  // Domain actions
  getDomain: (domain: string) => any
  setCurrentDomain: (domain: string) => void
  createDomain: (domain: string, password: string, email: string, phone: string) => void

  // Profile actions
  updateProfile: (domain: string, email: string, phone: string) => void
  updatePassword: (domain: string, newPassword: string) => void
  resetPassword: (domain: string, newPassword: string) => void

  // Project actions
  getProject: (domain: string, projectSlug: string) => any
  addProject: (domain: string, project: any) => void

  // Folder actions
  addFolder: (domain: string, projectSlug: string, folder: any) => void

  // File actions
  getFile: (domain: string, projectSlug: string, folderName: string, fileName: string) => any
  addFile: (domain: string, projectSlug: string, folderName: string, file: any) => void
  updateFileContent: (path: string, content: string) => void
  deleteFile: (domain: string, projectSlug: string, folderName: string, fileName: string) => void

  // Search actions
  searchAllFiles: (query: string) => any[]
  searchProjectFiles: (domain: string, projectSlug: string, query: string) => any[]
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  domains: initialData,
  currentDomain: "",

  getDomain: (domain: string) => {
    return get().domains[domain]
  },

  setCurrentDomain: (domain: string) => {
    set({ currentDomain: domain })

    // Create domain if it doesn't exist
    if (!get().domains[domain]) {
      set((state) => ({
        domains: {
          ...state.domains,
          [domain]: {
            projects: [],
          },
        },
      }))
    }
  },

  createDomain: (domain: string, password: string, email: string, phone: string) => {
    set((state) => ({
      domains: {
        ...state.domains,
        [domain]: {
          password,
          email,
          phone,
          projects: [],
        },
      },
    }))
  },

  updateProfile: (domain: string, email: string, phone: string) => {
    set((state) => {
      const domains = { ...state.domains }

      if (domains[domain]) {
        domains[domain].email = email
        domains[domain].phone = phone
      }

      return { domains }
    })
  },

  updatePassword: (domain: string, newPassword: string) => {
    set((state) => {
      const domains = { ...state.domains }

      if (domains[domain]) {
        domains[domain].password = newPassword
      }

      return { domains }
    })
  },

  resetPassword: (domain: string, newPassword: string) => {
    set((state) => {
      const domains = { ...state.domains }

      if (domains[domain]) {
        domains[domain].password = newPassword
      }

      return { domains }
    })
  },

  getProject: (domain: string, projectSlug: string) => {
    const domainData = get().domains[domain]
    if (!domainData || !domainData.projects) return null

    return domainData.projects.find((project: any) => project.name.toLowerCase().replace(/\s+/g, "-") === projectSlug)
  },

  addProject: (domain: string, project: any) => {
    set((state) => {
      const domains = { ...state.domains }

      if (!domains[domain]) {
        domains[domain] = { projects: [] }
      }

      if (!domains[domain].projects) {
        domains[domain].projects = []
      }

      domains[domain].projects.push(project)

      return { domains }
    })
  },

  addFolder: (domain: string, projectSlug: string, folder: any) => {
    set((state) => {
      const domains = { ...state.domains }
      const project = domains[domain].projects.find(
        (p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
      )

      if (project) {
        if (!project.folders) {
          project.folders = []
        }

        project.folders.push(folder)
      }

      return { domains }
    })
  },

  getFile: (domain: string, projectSlug: string, folderName: string, fileName: string) => {
    const domainData = get().domains[domain]
    if (!domainData || !domainData.projects) return null

    const project = domainData.projects.find((p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug)

    if (!project || !project.folders) return null

    const folder = project.folders.find((f: any) => f.name.toLowerCase().replace(/\s+/g, "-") === folderName)

    if (!folder || !folder.files) return null

    const file = folder.files.find((f: any) => f.title.toLowerCase().replace(/\s+/g, "-") === fileName)

    if (file) {
      // Add path to file for easier reference
      return {
        ...file,
        path: `/${domain}/${projectSlug}/${folderName}/${fileName}`,
      }
    }

    return null
  },

  addFile: (domain: string, projectSlug: string, folderName: string, file: any) => {
    set((state) => {
      const domains = { ...state.domains }
      const project = domains[domain].projects.find(
        (p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
      )

      if (project) {
        const folder = project.folders.find((f: any) => f.name === folderName)

        if (folder) {
          if (!folder.files) {
            folder.files = []
          }

          folder.files.push(file)
        }
      }

      return { domains }
    })
  },

  updateFileContent: (path: string, content: string) => {
    const [_, domain, projectSlug, folderSlug, fileSlug] = path.split("/")

    set((state) => {
      const domains = { ...state.domains }
      const project = domains[domain].projects.find(
        (p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
      )

      if (project) {
        const folder = project.folders.find((f: any) => f.name.toLowerCase().replace(/\s+/g, "-") === folderSlug)

        if (folder) {
          const file = folder.files.find((f: any) => f.title.toLowerCase().replace(/\s+/g, "-") === fileSlug)

          if (file) {
            file.content = content
          }
        }
      }

      return { domains }
    })
  },

  deleteFile: (domain: string, projectSlug: string, folderName: string, fileName: string) => {
    set((state) => {
      const domains = { ...state.domains }
      const project = domains[domain].projects.find(
        (p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug,
      )

      if (project) {
        const folder = project.folders.find((f: any) => f.name.toLowerCase().replace(/\s+/g, "-") === folderName)

        if (folder && folder.files) {
          folder.files = folder.files.filter((f: any) => f.title.toLowerCase().replace(/\s+/g, "-") !== fileName)
        }
      }

      return { domains }
    })
  },

  searchAllFiles: (query: string) => {
    const { domains } = get()
    const results: any[] = []
    const lowerQuery = query.toLowerCase()

    Object.entries(domains).forEach(([domainName, domain]) => {
      if (!domain.projects) return

      domain.projects.forEach((project: any) => {
        const projectSlug = project.name.toLowerCase().replace(/\s+/g, "-")

        if (!project.folders) return

        project.folders.forEach((folder: any) => {
          const folderSlug = folder.name.toLowerCase().replace(/\s+/g, "-")

          if (!folder.files) return

          folder.files.forEach((file: any) => {
            const fileSlug = file.title.toLowerCase().replace(/\s+/g, "-")

            // Check if file title or content matches query
            if (file.title.toLowerCase().includes(lowerQuery) || file.content.toLowerCase().includes(lowerQuery)) {
              // Find the matching content for preview
              let preview = ""
              const contentLower = file.content.toLowerCase()
              const queryIndex = contentLower.indexOf(lowerQuery)

              if (queryIndex !== -1) {
                const start = Math.max(0, queryIndex - 20)
                const end = Math.min(file.content.length, queryIndex + lowerQuery.length + 60)
                preview = file.content.substring(start, end)

                if (start > 0) {
                  preview = "..." + preview
                }

                if (end < file.content.length) {
                  preview = preview + "..."
                }
              } else {
                preview = file.content.substring(0, 80) + "..."
              }

              results.push({
                type: "file",
                title: file.title,
                preview,
                path: `/${domainName}/${projectSlug}/${folderSlug}/${fileSlug}`,
                breadcrumb: `${domainName} / ${project.name} / ${folder.name}`,
              })
            }
          })
        })
      })
    })

    return results
  },

  searchProjectFiles: (domain: string, projectSlug: string, query: string) => {
    const domainData = get().domains[domain]
    if (!domainData || !domainData.projects) return []

    const results: any[] = []
    const lowerQuery = query.toLowerCase()

    const project = domainData.projects.find((p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === projectSlug)

    if (!project || !project.folders) return []

    project.folders.forEach((folder: any) => {
      const folderSlug = folder.name.toLowerCase().replace(/\s+/g, "-")

      if (!folder.files) return

      folder.files.forEach((file: any) => {
        const fileSlug = file.title.toLowerCase().replace(/\s+/g, "-")

        // Check if file title or content matches query
        if (file.title.toLowerCase().includes(lowerQuery) || file.content.toLowerCase().includes(lowerQuery)) {
          // Find the matching content for preview
          let preview = ""
          const contentLower = file.content.toLowerCase()
          const queryIndex = contentLower.indexOf(lowerQuery)

          if (queryIndex !== -1) {
            const start = Math.max(0, queryIndex - 20)
            const end = Math.min(file.content.length, queryIndex + lowerQuery.length + 60)
            preview = file.content.substring(start, end)

            if (start > 0) {
              preview = "..." + preview
            }

            if (end < file.content.length) {
              preview = preview + "..."
            }
          } else {
            preview = file.content.substring(0, 80) + "..."
          }

          results.push({
            type: "file",
            title: file.title,
            preview,
            path: `/${domain}/${projectSlug}/${folderSlug}/${fileSlug}`,
          })
        }
      })
    })

    return results
  },
}))
