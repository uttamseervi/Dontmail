"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bot, MessageSquare, Tag, FolderTree, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export function AIFeatures({ file }: { file: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Bot className="h-5 w-5 mr-2 text-orange-500" />
        <h2 className="text-lg font-medium">AI Features</h2>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <AISummary file={file} />
        </TabsContent>

        <TabsContent value="qa">
          <AIQA file={file} />
        </TabsContent>

        <TabsContent value="tags">
          <AITags file={file} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AISummary({ file }: { file: any }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState("")

  const generateSummary = () => {
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      const summaries = [
        "This document outlines the key features and benefits of the project, highlighting its innovative approach to solving common problems in the industry.",
        "A comprehensive overview of the technical architecture, including the stack, deployment strategy, and scalability considerations.",
        "This file contains important notes about the project timeline, milestones, and potential roadblocks that need to be addressed.",
        "An analysis of user feedback and feature requests, prioritized by impact and implementation difficulty.",
      ]

      setSummary(summaries[Math.floor(Math.random() * summaries.length)])
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {summary ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-muted rounded-md">
          <p>{summary}</p>
        </motion.div>
      ) : (
        <div className="text-center p-6">
          <p className="text-muted-foreground mb-4">Generate an AI summary of this file</p>
          <Button onClick={generateSummary} disabled={isGenerating} className="bg-orange-500 hover:bg-orange-600">
            {isGenerating ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

function AIQA({ file }: { file: any }) {
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [answer, setAnswer] = useState("")

  const askQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsAsking(true)

    // Simulate AI processing
    setTimeout(() => {
      const answers = [
        "Based on the content, I'd recommend focusing on the core features first before expanding to additional functionality.",
        "The document suggests that this approach would be more efficient in terms of both time and resource utilization.",
        "According to the file, the best practice would be to implement this in stages, starting with a proof of concept.",
        "The content indicates that this is a priority feature that should be implemented in the next sprint.",
      ]

      setAnswer(answers[Math.floor(Math.random() * answers.length)])
      setIsAsking(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={askQuestion} className="space-y-2">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about this file..."
          className="resize-none"
        />
        <Button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {isAsking ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Thinking...
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI
            </>
          )}
        </Button>
      </form>

      {answer && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-muted rounded-md">
          <div className="flex items-start">
            <Bot className="h-5 w-5 mr-2 mt-0.5 text-orange-500" />
            <p>{answer}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function AITags({ file }: { file: any }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [suggestedFolder, setSuggestedFolder] = useState("")

  const generateTags = () => {
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      const tagSets = [
        ["documentation", "important", "reference"],
        ["project", "planning", "timeline"],
        ["technical", "architecture", "design"],
        ["user-feedback", "feature-request", "priority"],
      ]

      const folderSuggestions = ["Documentation", "Planning", "Technical Specs", "User Research"]

      setTags(tagSets[Math.floor(Math.random() * tagSets.length)])
      setSuggestedFolder(folderSuggestions[Math.floor(Math.random() * folderSuggestions.length)])
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      {tags.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-orange-500/10">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Folder</h3>
            <div className="flex items-center p-2 bg-muted rounded-md">
              <FolderTree className="h-4 w-4 mr-2 text-orange-500" />
              {suggestedFolder}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center p-6">
          <p className="text-muted-foreground mb-4">Generate AI tags and folder suggestions</p>
          <Button onClick={generateTags} disabled={isGenerating} className="bg-orange-500 hover:bg-orange-600">
            {isGenerating ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Suggestions
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
