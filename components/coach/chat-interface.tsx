"use client"

import type React from "react"

import { useState, useRef, type RefObject } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Message } from "@/lib/types"
import { getChatResponse } from "@/lib/actions/coach-actions"
import MessageBubble from "./message-bubble"

interface ChatInterfaceProps {
  messages: Message[]
  addMessage: (message: Message) => void
  activeMode: string
  messagesEndRef: RefObject<HTMLDivElement>
}

export default function ChatInterface({ messages, addMessage, activeMode, messagesEndRef }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input }
    addMessage(userMessage)

    // Clear input
    setInput("")

    // Set loading state
    setIsLoading(true)

    try {
      // Get AI response
      const response = await getChatResponse(messages.concat(userMessage), activeMode)

      // Add AI response to chat
      addMessage({ role: "assistant", content: response })
    } catch (error) {
      console.error("Error getting chat response:", error)
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-[700px]">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} isLastMessage={index === messages.length - 1} />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your question..."
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="h-[60px] w-[60px]" disabled={!input.trim() || isLoading}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

