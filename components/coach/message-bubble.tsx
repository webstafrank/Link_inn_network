import type { Message } from "@/lib/types"
import ReactMarkdown from "react-markdown"

interface MessageBubbleProps {
  message: Message
  isLastMessage: boolean
}

export default function MessageBubble({ message, isLastMessage }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg p-4 max-w-[80%] ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

