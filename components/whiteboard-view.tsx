"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Download, Undo, Redo, Square, Circle, Pencil, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function WhiteboardView({ projectName }: { projectName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState("pencil")
  const [color, setColor] = useState("#f97316") // Orange
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [elements, setElements] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element)
    })
  }, [elements])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    setLastX(x)
    setLastY(y)

    // Create new element
    const newElement = {
      type: tool,
      color,
      points: [{ x, y }],
    }

    setElements([...elements, newElement])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update last element
    const updatedElements = [...elements]
    const lastElement = updatedElements[updatedElements.length - 1]

    if (tool === "pencil") {
      lastElement.points.push({ x, y })
    } else if (tool === "square" || tool === "circle") {
      lastElement.width = x - lastElement.points[0].x
      lastElement.height = y - lastElement.points[0].y
    }

    setElements(updatedElements)
    setLastX(x)
    setLastY(y)
  }

  const endDrawing = () => {
    setIsDrawing(false)

    // Add to history
    setHistory(history.slice(0, historyIndex + 1).concat([elements]))
    setHistoryIndex(historyIndex + 1)
  }

  const drawElement = (ctx: CanvasRenderingContext2D, element: any) => {
    ctx.strokeStyle = element.color
    ctx.lineWidth = 2
    ctx.beginPath()

    if (element.type === "pencil") {
      if (element.points.length < 2) return

      ctx.moveTo(element.points[0].x, element.points[0].y)

      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x, element.points[i].y)
      }

      ctx.stroke()
    } else if (element.type === "square") {
      const { x, y } = element.points[0]
      ctx.strokeRect(x, y, element.width || 0, element.height || 0)
    } else if (element.type === "circle") {
      const { x, y } = element.points[0]
      const radius = Math.sqrt(Math.pow(element.width || 0, 2) + Math.pow(element.height || 0, 2)) / 2

      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    } else if (historyIndex === 0) {
      setHistoryIndex(-1)
      setElements([])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const generateAIElements = () => {
    setIsAIGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      const newElements = [
        {
          type: "square",
          color: "#f97316",
          points: [{ x: 100, y: 100 }],
          width: 200,
          height: 100,
        },
        {
          type: "circle",
          color: "#f97316",
          points: [{ x: 300, y: 200 }],
          width: 100,
          height: 100,
        },
        {
          type: "pencil",
          color: "#f97316",
          points: [
            { x: 150, y: 250 },
            { x: 170, y: 270 },
            { x: 190, y: 260 },
            { x: 210, y: 240 },
            { x: 230, y: 250 },
          ],
        },
      ]

      setElements(newElements)
      setHistory(history.slice(0, historyIndex + 1).concat([newElements]))
      setHistoryIndex(historyIndex + 1)
      setIsAIGenerating(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{projectName} Whiteboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={generateAIElements} disabled={isAIGenerating}>
            {isAIGenerating ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Generate
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex space-x-2">
        <Tabs defaultValue="pencil" onValueChange={setTool}>
          <TabsList>
            <TabsTrigger value="pencil">
              <Pencil className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="square">
              <Square className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="circle">
              <Circle className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="text">
              <Type className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex space-x-1">
          <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex < 0}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex space-x-1">
          <ColorButton color="#f97316" currentColor={color} onChange={setColor} />
          <ColorButton color="#3b82f6" currentColor={color} onChange={setColor} />
          <ColorButton color="#10b981" currentColor={color} onChange={setColor} />
          <ColorButton color="#ef4444" currentColor={color} onChange={setColor} />
          <ColorButton color="#000000" currentColor={color} onChange={setColor} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border border-border rounded-lg overflow-hidden bg-white"
        style={{ height: "60vh" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </motion.div>
    </div>
  )
}

function ColorButton({
  color,
  currentColor,
  onChange,
}: {
  color: string
  currentColor: string
  onChange: (color: string) => void
}) {
  return (
    <button
      className="w-6 h-6 rounded-full border border-border flex items-center justify-center"
      style={{ backgroundColor: color }}
      onClick={() => onChange(color)}
    >
      {color === currentColor && <div className="w-2 h-2 rounded-full bg-white" />}
    </button>
  )
}
