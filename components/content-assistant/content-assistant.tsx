"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogPostGenerator from "./blog-post-generator"
import PodcastSummaryGenerator from "./podcast-summary-generator"
import FitnessTipsGenerator from "./fitness-tips-generator"
import SocialMediaGenerator from "./social-media-generator"
import { Card, CardContent } from "@/components/ui/card"

export default function ContentAssistant() {
  const [activeTab, setActiveTab] = useState("blog-post")

  return (
    <Card className="border-2 border-border">
      <CardContent className="p-6">
        <Tabs defaultValue="blog-post" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="blog-post" className="text-base font-bold">
              Blog Post
            </TabsTrigger>
            <TabsTrigger value="podcast" className="text-base font-bold">
              Podcast Summary
            </TabsTrigger>
            <TabsTrigger value="fitness-tips" className="text-base font-bold">
              Fitness Tips
            </TabsTrigger>
            <TabsTrigger value="social-media" className="text-base font-bold">
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog-post">
            <BlogPostGenerator />
          </TabsContent>

          <TabsContent value="podcast">
            <PodcastSummaryGenerator />
          </TabsContent>

          <TabsContent value="fitness-tips">
            <FitnessTipsGenerator />
          </TabsContent>

          <TabsContent value="social-media">
            <SocialMediaGenerator />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
