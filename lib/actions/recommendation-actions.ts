"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import {
  getRecommendations,
  trackUserActivity,
  updateUserPreferences,
  recordRecommendation,
  type RecommendationResponse,
} from "@/lib/services/recommendation-engine"

// Get personalized recommendations for the current user
export async function getUserRecommendations(limit = 5): Promise<RecommendationResponse> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      articles: [],
      products: [],
      podcasts: [],
    }
  }

  return getRecommendations(session.user.id, limit)
}

// Track user activity (view, like, purchase, etc.)
export async function trackActivity(itemType: string, itemId: string, activityType: string): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return false
  }

  await trackUserActivity(session.user.id, itemType, itemId, activityType)
  return true
}

// Update user preferences
export async function saveUserPreferences(preferences: {
  categories?: string[]
  tags?: string[]
  fitnessLevel?: string
  fitnessGoals?: string[]
}): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return false
  }

  await updateUserPreferences(session.user.id, preferences)
  return true
}

// Record that a recommendation was shown to the user
export async function logRecommendation(itemType: string, itemId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return false
  }

  await recordRecommendation(session.user.id, itemType, itemId)
  return true
}

