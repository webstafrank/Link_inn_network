"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

interface ContentDisplayProps {
  content: string
  isLoading: boolean
  placeholder: string
}

export default function ContentDisplay({ content, isLoading, placeholder }: ContentDisplayProps) {
  return (
    <Card className="h-[600px] overflow-auto">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : content ? (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p>{placeholder}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

