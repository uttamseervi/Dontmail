"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { useWorkspaceStore } from "@/lib/store"
import { AuthPage } from "@/components/auth-page"

export default function DomainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const domain = params.domain as string
  const { setCurrentDomain } = useWorkspaceStore()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setCurrentDomain(domain)
    setIsLoading(false)

    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem(`auth_${domain}`)
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [domain, setCurrentDomain])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
    // Store authentication status in session storage
    sessionStorage.setItem(`auth_${domain}`, "true")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-orange-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage domain={domain} onAuthenticated={handleAuthenticated} />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Suspense fallback={<div>Loading search...</div>}>
          <GlobalSearch />
        </Suspense>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}
