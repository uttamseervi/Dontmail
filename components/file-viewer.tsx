"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Save, Copy, Check, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useWorkspaceStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export function FileViewer({ file }: { file: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(file.content)
  const [isCopied, setIsCopied] = useState(false)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const { updateFileContent } = useWorkspaceStore()
  const { toast } = useToast()

  const handleSave = () => {
    updateFileContent(file.path, content)
    setIsEditing(false)
    toast({
      title: "File saved",
      description: "Your changes have been saved",
      variant: "success",
    })
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(file.content)
    setIsCopied(true)

    toast({
      title: "Copied to clipboard",
      description: `${file.title} content copied to clipboard`,
      variant: "success",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsLinkCopied(true)

    toast({
      title: "Link copied",
      description: "File link copied to clipboard",
      variant: "success",
    })

    setTimeout(() => {
      setIsLinkCopied(false)
    }, 2000)
  }

  const renderFileContent = () => {
    if (isEditing) {
      return (
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[300px] font-mono" />
      )
    }

    switch (file.type) {
      case "markdown":
        return <MarkdownRenderer content={file.content} />
      case "json":
        return <JsonRenderer content={file.content} />
      case "text":
      default:
        return <TextRenderer content={file.content} />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {file.title}
          <span className="ml-2 text-sm text-muted-foreground">{getFileTypeLabel(file.type)}</span>
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleCopyLink} disabled={isLinkCopied}>
            {isLinkCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Link Copied
              </>
            ) : (
              <>
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={handleCopyToClipboard} disabled={isCopied}>
            {isCopied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy Content
              </>
            )}
          </Button>

          {isEditing ? (
            <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-[300px]"
      >
        {renderFileContent()}
      </motion.div>
    </div>
  )
}

function getFileTypeLabel(type: string): string {
  switch (type) {
    case "markdown":
      return "Markdown"
    case "json":
      return "JSON"
    case "text":
      return "Text"
    default:
      return type
  }
}

function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown rendering
  const html = content
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />")
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-md overflow-auto my-4"><code>$1</code></pre>')

  return <div className="prose prose-orange dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
}

function JsonRenderer({ content }: { content: string }) {
  try {
    const json = JSON.parse(content)
    const formattedJson = JSON.stringify(json, null, 2)

    return <pre className="bg-muted p-4 rounded-md overflow-auto font-mono text-sm">{formattedJson}</pre>
  } catch (error) {
    return (
      <div className="p-4 border border-destructive rounded-md text-destructive">
        Invalid JSON: {(error as Error).message}
      </div>
    )
  }
}

function TextRenderer({ content }: { content: string }) {
  return <pre className="whitespace-pre-wrap font-sans">{content}</pre>
}
