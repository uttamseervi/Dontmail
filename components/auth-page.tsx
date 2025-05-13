"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, HelpCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ForgotPasswordDialog } from "@/components/forgot-password-dialog"
import { useRouter } from "next/navigation"
import { checkPassword, isExistingUser, createUser } from "@/lib/auth"

export function AuthPage({
  domain,
  onAuthenticated,
}: {
  domain: string
  onAuthenticated: () => void
}) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const isNewUser = !isExistingUser(domain)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNewUser) {
      if (!password.trim()) {
        setError("Password is required")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (!email.trim()) {
        setError("Email is required for account recovery")
        return
      }

      // Create new user
      createUser(domain, password, email, phone)

      toast({
        title: "Account created",
        description: "Your workspace is now ready",
        variant: "success",
      })

      onAuthenticated()
    } else {
      if (!password.trim()) {
        setError("Password is required")
        return
      }

      // Check password
      if (checkPassword(domain, password)) {
        toast({
          title: "Login successful",
          description: `Welcome to ${domain} workspace`,
          variant: "success",
        })
        onAuthenticated()
      } else {
        setError("Incorrect password")
        toast({
          title: "Authentication failed",
          description: "Incorrect password. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 flex flex-col items-center text-center">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold">{isNewUser ? "Set Up Your Workspace" : "Welcome Back"}</h1>
            <p className="mt-2 text-muted-foreground">
              {isNewUser
                ? "Create a password to protect your new workspace"
                : `Enter your password to access ${domain}'s workspace`}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isNewUser && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number (Optional)</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setError("")
                      }}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className={error ? "border-destructive" : ""}
                />
              </div>

              {isNewUser && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setError("")
                    }}
                    className={error ? "border-destructive" : ""}
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
                {isNewUser ? "Create Workspace" : "Sign In"}
              </Button>

              {!isNewUser && (
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-orange-500"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    <HelpCircle className="mr-1 h-3 w-3" />
                    Forgot Password?
                  </Button>
                </div>
              )}

              {!isNewUser && domain === "demoUser" && (
                <p className="text-center text-sm text-muted-foreground">Hint: Try password "1234"</p>
              )}
            </div>
          </form>
        </div>
      </motion.div>

      <ForgotPasswordDialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen} domain={domain} />
    </div>
  )
}
