"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Blog post generation
export async function generateBlogPost(params: {
  topic: string
  keywords?: string
  contentType: "full-post" | "outline" | "intro"
  tone: "bold" | "motivational" | "educational" | "aggressive"
  wordCount: number
  includeCallToAction: boolean
}) {
  const { topic, keywords, contentType, tone, wordCount, includeCallToAction } = params

  // Create system prompt based on tone
  let systemPrompt = "You are an expert fitness and masculinity writer for a blog called FORGE. "

  switch (tone) {
    case "bold":
      systemPrompt +=
        "Your writing style is bold, confident, and authoritative. You use strong language, direct statements, and a commanding tone that inspires men to take action. You don't sugarcoat the truth."
      break
    case "motivational":
      systemPrompt +=
        "Your writing style is highly motivational and inspiring. You use powerful language that energizes readers and makes them believe in their potential. You focus on overcoming obstacles and pushing limits."
      break
    case "educational":
      systemPrompt +=
        "Your writing style is educational and informative, but still masculine and direct. You provide detailed explanations and evidence-based information while maintaining an authoritative tone."
      break
    case "aggressive":
      systemPrompt +=
        "Your writing style is aggressive, intense, and no-nonsense. You use forceful language, challenge excuses, and push readers hard. You're unapologetically direct and sometimes use military-inspired language."
      break
  }

  // Create user prompt based on content type
  let userPrompt = `Create a ${contentType === "full-post" ? "complete blog post" : contentType === "outline" ? "detailed outline" : "compelling introduction"} about "${topic}"`

  if (keywords) {
    userPrompt += ` that incorporates the following keywords: ${keywords}.`
  }

  userPrompt += `\n\nThe content should be approximately ${wordCount} words${contentType === "intro" ? " for the introduction" : ""}.`

  if (includeCallToAction) {
    userPrompt += "\n\nInclude a strong call-to-action at the end that encourages readers to take specific steps."
  }

  userPrompt +=
    "\n\nFormat the content using Markdown with appropriate headings, bullet points, and emphasis where needed."

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: contentType === "full-post" ? 2000 : 1000,
    })

    return text
  } catch (error) {
    console.error("Error generating blog post:", error)
    throw new Error("Failed to generate blog post content")
  }
}

// Podcast summary generation
export async function generatePodcastSummary(params: {
  title: string
  description: string
  keyPoints?: string
  guestName?: string
  guestBio?: string
  includeTimestamps: boolean
  includeQuotes: boolean
}) {
  const { title, description, keyPoints, guestName, guestBio, includeTimestamps, includeQuotes } = params

  const systemPrompt =
    "You are a skilled content writer for a masculine self-improvement podcast called FORGE. You create compelling, concise podcast summaries that capture the essence of each episode and entice listeners to tune in. Your writing is bold, direct, and uses strong language that appeals to men interested in fitness, discipline, and personal growth."

  let userPrompt = `Create a comprehensive podcast summary for an episode titled "${title}".`

  userPrompt += `\n\nEpisode description: ${description}`

  if (keyPoints) {
    userPrompt += `\n\nKey points discussed: ${keyPoints}`
  }

  if (guestName) {
    userPrompt += `\n\nGuest: ${guestName}`
    if (guestBio) {
      userPrompt += ` - ${guestBio}`
    }
  }

  userPrompt += "\n\nThe summary should include:"
  userPrompt += "\n- A compelling introduction that hooks the reader"
  userPrompt += "\n- A brief overview of the main topics covered"

  if (includeTimestamps) {
    userPrompt += "\n- Key timestamps for important moments in the episode (create realistic timestamps)"
  }

  if (includeQuotes) {
    userPrompt += "\n- Notable quotes from the episode (create compelling quotes that sound authentic)"
  }

  userPrompt += "\n- A conclusion that encourages listeners to check out the full episode"

  userPrompt +=
    "\n\nFormat the content using Markdown with appropriate headings, bullet points, and emphasis where needed."

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating podcast summary:", error)
    throw new Error("Failed to generate podcast summary")
  }
}

// Fitness tips generation
export async function generateFitnessTips(params: {
  topic: string
  fitnessLevel: "beginner" | "intermediate" | "advanced" | "all"
  category: "strength" | "muscle-building" | "fat-loss" | "nutrition" | "recovery" | "supplements"
  numberOfTips: number
}) {
  const { topic, fitnessLevel, category, numberOfTips } = params

  const systemPrompt =
    "You are a professional strength coach and fitness expert who specializes in helping men achieve their physical potential. Your advice is practical, science-based, and delivered in a bold, masculine tone. You don't sugarcoat information and you focus on what actually works, not trendy fitness fads. Your tips are concise, actionable, and sometimes challenge conventional wisdom."

  let userPrompt = `Create ${numberOfTips} powerful fitness tips about "${topic}" for ${fitnessLevel === "all" ? "men of all fitness levels" : `${fitnessLevel}-level men`}.`

  userPrompt += `\n\nThese tips should focus on the ${category} category and provide specific, actionable advice that readers can implement immediately.`

  userPrompt += "\n\nEach tip should include:"
  userPrompt += "\n- A bold, attention-grabbing title"
  userPrompt += "\n- A concise explanation (2-3 sentences)"
  userPrompt += "\n- A practical example or specific implementation advice"

  userPrompt +=
    "\n\nFormat the content using Markdown with appropriate headings, bullet points, and emphasis where needed. Number each tip clearly."

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating fitness tips:", error)
    throw new Error("Failed to generate fitness tips")
  }
}

// Social media content generation
export async function generateSocialMedia(params: {
  topic: string
  platform: "instagram" | "twitter" | "facebook" | "linkedin"
  contentType: "post" | "carousel" | "story"
  includeHashtags: boolean
  includeEmojis: boolean
  linkToInclude?: string
}) {
  const { topic, platform, contentType, includeHashtags, includeEmojis, linkToInclude } = params

  const systemPrompt =
    "You are a social media manager for FORGE, a masculine self-improvement brand focused on strength training, discipline, and personal development. Your content is bold, direct, and motivational. You create engaging social media content that resonates with men who are serious about improving themselves physically and mentally."

  let userPrompt = `Create ${contentType === "carousel" ? "a series of 5 slides for an Instagram carousel" : contentType === "story" ? "content for a social media story" : `a social media post for ${platform}`} about "${topic}".`

  userPrompt += `\n\nThe content should be formatted appropriately for ${platform} and should be engaging, bold, and motivational.`

  if (contentType === "carousel") {
    userPrompt += "\n\nFor the carousel, create:"
    userPrompt += "\n- An attention-grabbing first slide"
    userPrompt += "\n- 3 content slides with valuable information"
    userPrompt += "\n- A final slide with a call-to-action"
  }

  if (linkToInclude) {
    userPrompt += `\n\nInclude this link in the content: ${linkToInclude}`
  }

  if (includeHashtags) {
    userPrompt += "\n\nInclude 5-7 relevant hashtags that would perform well for this content."
  }

  if (includeEmojis) {
    userPrompt += "\n\nUse appropriate emojis to enhance the content and make it more engaging."
  }

  userPrompt += "\n\nFormat the content using Markdown and make it ready to copy and paste."

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating social media content:", error)
    throw new Error("Failed to generate social media content")
  }
}

