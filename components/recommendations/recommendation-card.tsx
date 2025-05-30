"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logRecommendation } from "@/lib/actions/recommendation-actions"
import type { RecommendationItem } from "@/lib/services/recommendation-engine"

interface RecommendationCardProps {
  item: RecommendationItem
}

export default function RecommendationCard({ item }: RecommendationCardProps) {
  // Function to handle click and log the recommendation
  const handleClick = async () => {
    await logRecommendation(item.type, item.id)
  }

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative">
        <Image
          src={item.imageUrl || `/placeholder.svg?height=200&width=400&text=${item.type}`}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="mb-2">
          <span className="text-xs font-medium text-primary uppercase">
            {item.type === "post"
              ? "Article"
              : item.type === "product"
                ? "Product"
                : item.type === "podcast"
                  ? "Podcast"
                  : "Episode"}
          </span>
        </div>
        <h3 className="font-bold line-clamp-2 mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={item.url} className="w-full" onClick={handleClick}>
          <Button variant="outline" className="w-full">
            {item.type === "post" ? "Read Article" : item.type === "product" ? "View Product" : "Listen Now"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

