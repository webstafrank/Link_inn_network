"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "./chat-interface"
import type { Message } from "@/lib/types"
import { Card } from "@/components/ui/card"

// Define the different coach modes
const COACH_MODES = {
  FITNESS: {
    id: "fitness",
    title: "Fitness Coach",
    description: "Expert guidance on strength training, muscle building, and athletic performance",
    initialMessage:
      "I'm your FORGE Fitness Coach. I'll give you direct, evidence-based advice on training, nutrition, and recovery. What specific fitness goal are you working toward?",
    icon: "💪",
  },
  DATING: {
    id: "dating",
    title: "Dating Coach",
    description: "Straight-talking advice on attraction, relationships, and social dynamics",
    initialMessage:
      "I'm your FORGE Dating Coach. I'll give you honest, practical advice on attraction, relationships, and social dynamics. What's your current situation?",
    icon: "🔥",
  },
  MASCULINITY: {
    id: "masculinity",
    title: "Masculinity Coach",
    description: "Guidance on discipline, purpose, and developing your masculine potential",
    initialMessage:
      "I'm your FORGE Masculinity Coach. I'll help you develop discipline, purpose, and mental fortitude. What area of your life are you looking to strengthen?",
    icon: "⚔️",
  },
}

export default function ForgeAICoach() {
  const [activeMode, setActiveMode] = useState<string>(COACH_MODES.FITNESS.id)
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    [COACH_MODES.FITNESS.id]: [{ role: "assistant", content: COACH_MODES.FITNESS.initialMessage }],
    [COACH_MODES.DATING.id]: [{ role: "assistant", content: COACH_MODES.DATING.initialMessage }],
    [COACH_MODES.MASCULINITY.id]: [{ role: "assistant", content: COACH_MODES.MASCULINITY.initialMessage }],
  })

  // Reset scroll position when changing tabs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMode, chatHistory])

  const handleModeChange = (mode: string) => {
    setActiveMode(mode)
  }

  const addMessage = (message: Message) => {
    setChatHistory((prev) => ({
      ...prev,
      [activeMode]: [...prev[activeMode], message],
    }))
  }

  return (
    <Card className="border-2 border-border">
      <div className="grid grid-cols-1 lg:grid-cols-4 min-h-[700px]">
        <div className="p-6 border-r border-border">
          <h2 className="text-xl font-heading mb-4">Choose Your Coach</h2>
          <Tabs
            defaultValue={activeMode}
            value={activeMode}
            onValueChange={handleModeChange}
            orientation="vertical"
            className="w-full"
          >
            <TabsList className="flex flex-col h-auto bg-transparent space-y-2">
              {Object.values(COACH_MODES).map((mode) => (
                <TabsTrigger
                  key={mode.id}
                  value={mode.id}
                  className="w-full justify-start text-left px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">{mode.icon}</span>
                    <div>
                      <p className="font-bold">{mode.title}</p>
                      <p className="text-xs text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.values(COACH_MODES).map((mode) => (
              <TabsContent key={mode.id} value={mode.id} className="mt-0 hidden">
                {/* This content is hidden but needed for Tabs component */}
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8">
            <h3 className="text-sm font-bold mb-2">About FORGE AI Coach</h3>
            <p className="text-sm text-muted-foreground">
              Your AI coach provides direct, no-nonsense advice based on proven principles. The coach doesn't sugarcoat
              the truth - it gives you what you need to hear, not what you want to hear.
            </p>
          </div>
        </div>

        <div className="col-span-3">
          <ChatInterface
            messages={chatHistory[activeMode]}
            addMessage={addMessage}
            activeMode={activeMode}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
    </Card>
  )
}

