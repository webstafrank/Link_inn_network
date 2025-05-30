import type { Metadata } from "next"
import ForgeAICoach from "@/components/coach/forge-ai-coach"

export const metadata: Metadata = {
  title: "FORGE AI Coach | Your Personal Guide",
  description: "Get direct, no-nonsense advice on fitness, dating, and masculine development",
}

export default function CoachPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-heading tracking-tighter mb-2">FORGE AI COACH</h1>
        <p className="text-xl text-muted-foreground">Direct, no-nonsense guidance for men who want results</p>
      </div>

      <ForgeAICoach />
    </div>
  )
}

