"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getUserData, resetUserPassword } from "@/lib/auth"

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  domain,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  domain: string
}) {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationMethod, setVerificationMethod] = useState("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const userData = getUserData(domain)

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if email/phone matches the one in the user data
    if (verificationMethod === "email" && userData?.email !== email) {
      setError("Email address not found")
      return
    }

    if (verificationMethod === "phone" && userData?.phone !== phone) {
      setError("Phone number not found")
      return
    }

    // Simulate sending verification code
    toast({
      title: "Verification code sent",
      description: `A verification code has been sent to your ${verificationMethod}`,
      variant: "success",
    })

    setStep(2)
    setError("")
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate code verification (any 6-digit code works)
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setStep(3)
    setError("")
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Reset the password
    resetUserPassword(domain, newPassword)

    toast({
      title: "Password reset successful",
      description: "You can now log in with your new password",
      variant: "success",
    })

    // Close the dialog and reset state
    onOpenChange(false)
    setStep(1)
    setEmail("")
    setPhone("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  const handleClose = () => {
    onOpenChange(false)
    setStep(1)
    setEmail("")
    setPhone("")
    setVerificationCode("")
    setNewPassword("")
    setConfirmPassword("")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleRequestReset}>
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="email" onValueChange={setVerificationMethod}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError("")
                      }}
                      placeholder="your@email.com"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="phone" className="mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setError("")
                      }}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Send Verification Code
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code sent to your {verificationMethod}
                </p>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Verify Code
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Enter new password"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Confirm new password"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
