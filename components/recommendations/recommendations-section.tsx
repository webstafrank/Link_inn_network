"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserRecommendations } from "@/lib/actions/recommendation-actions"
import RecommendationCard from "./recommendation-card"
import type { RecommendationResponse } from "@/lib/services/recommendation-engine"

interface RecommendationsSectionProps {
  initialData?: RecommendationResponse
  title?: string
  description?: string
}

export default function RecommendationsSection({
  initialData,
  title = "Recommended For You",
  description = "Content tailored to your interests and activity",
}: RecommendationsSectionProps) {
  const [recommendations, setRecommendations] = useState<RecommendationResponse>(
    initialData || { articles: [], products: [], podcasts: [] },
  )
  const [isLoading, setIsLoading] = useState(!initialData)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (!initialData) {
      const fetchRecommendations = async () => {
        try {
          const data = await getUserRecommendations(6)
          setRecommendations(data)
        } catch (error) {
          console.error("Error fetching recommendations:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchRecommendations()
    }
  }, [initialData])

  // Combine all recommendations for the "All" tab
  const allRecommendations = [
    ...recommendations.articles.map((item) => ({ ...item, order: 1 })),
    ...recommendations.products.map((item) => ({ ...item, order: 2 })),
    ...recommendations.podcasts.map((item) => ({ ...item, order: 3 })),
  ]
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="all" className="m-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : allRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRecommendations.map((item) => (
                  <RecommendationCard key={`${item.type}-${item.id}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No recommendations available yet. Start exploring content to get personalized recommendations.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles" className="m-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recommendations.articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.articles.map((item) => (
                  <RecommendationCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No article recommendations available yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products" className="m-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recommendations.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.products.map((item) => (
                  <RecommendationCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No product recommendations available yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="podcasts" className="m-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : recommendations.podcasts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.podcasts.map((item) => (
                  <RecommendationCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No podcast recommendations available yet.</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

