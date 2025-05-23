"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [domain, setDomain] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<"domain" | "password">("domain")

  const router = useRouter()
  const { toast } = useToast()

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (domain.trim()) {
      setStep("password")
    } else {
      toast({
        title: "Domain required",
        description: "Please enter a domain to continue",
        variant: "destructive",
      })
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter your password to continue.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Access granted",
      description: "Redirecting to your workspace...",
    })

    setTimeout(() => {
      router.push(`/${domain.toLowerCase()}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl py-8"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to <span className="text-orange-500">Workspace</span>
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Your all-in-one collaborative workspace with AI-powered tools
            </p>
          </div>

          <div className="w-full max-w-md space-y-4">
            {step === "domain" && (
              <form onSubmit={handleDomainSubmit} className="flex flex-col space-y-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter your domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="h-12 pl-4 pr-12 text-lg"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10 bg-orange-500 hover:bg-orange-600"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Try domains like: "demoUser", "myMetaverse", or "design"
                </p>
              </form>
            )}

            {step === "password" && (
              <form onSubmit={handlePasswordSubmit} className="flex flex-col space-y-3">
                <div className="relative">
                  <Input
                    type="password"
                    placeholder={`Password for "${domain}"`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-4 pr-12 text-lg"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1 top-1 h-10 w-10 bg-orange-500 hover:bg-orange-600"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Dummy Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
            <FeatureCard
              title="Nested Projects"
              description="Organize your work with nested projects and folders"
              icon="📁"
            />
            <FeatureCard
              title="AI-Powered"
              description="Get smart suggestions and summaries with AI"
              icon="🧠"
            />
            <FeatureCard
              title="Universal Search"
              description="Find anything across all your workspaces"
              icon="🔍"
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center p-6 bg-card rounded-lg border border-border"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground text-center">{description}</p>
    </motion.div>
  )
}
