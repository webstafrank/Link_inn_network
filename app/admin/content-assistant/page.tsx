import type { Metadata } from "next"
import ContentAssistant from "@/components/content-assistant/content-assistant"

export const metadata: Metadata = {
  title: "Content Assistant | FORGE Admin",
  description: "AI-powered content generation for your bodybuilding and masculinity blog",
}

export default function ContentAssistantPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-heading tracking-tighter mb-2">CONTENT FORGE</h1>
        <p className="text-xl text-muted-foreground">
          AI-powered assistant to generate bold, masculine content for your audience
        </p>
      </div>

      <ContentAssistant />
    </div>
  )
}

