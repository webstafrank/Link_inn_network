"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { generatePodcastSummary } from "@/lib/actions/content-actions"
import ContentDisplay from "./content-display"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  keyPoints: z.string().optional(),
  guestName: z.string().optional(),
  guestBio: z.string().optional(),
  includeTimestamps: z.boolean().default(true),
  includeQuotes: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export default function PodcastSummaryGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      keyPoints: "",
      guestName: "",
      guestBio: "",
      includeTimestamps: true,
      includeQuotes: true,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsGenerating(true)
    setContent("")

    try {
      const generatedContent = await generatePodcastSummary(values)
      setContent(generatedContent)
      toast({
        title: "Summary generated successfully",
        description: "Your podcast summary is ready to use or edit.",
      })
    } catch (error) {
      console.error("Error generating summary:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    })
  }

  const handleRegenerateContent = () => {
    onSubmit(form.getValues())
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-heading mb-4">Podcast Summary Generator</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mastering Mental Toughness with John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Episode Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what the episode is about..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key Points (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Main topics discussed in the episode, one per line..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>List the main topics or points discussed in the episode</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Name (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guestBio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Bio (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fitness coach and author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="includeTimestamps"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include Timestamps</FormLabel>
                      <FormDescription>Add timestamps for key moments</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeQuotes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Include Quotes</FormLabel>
                      <FormDescription>Add notable quotes from the episode</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Summary...
                </>
              ) : (
                "Generate Podcast Summary"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading">Generated Summary</h2>
          <div className="flex gap-2">
            {content && (
              <>
                <Button variant="outline" size="sm" onClick={handleCopyContent}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleRegenerateContent} disabled={isGenerating}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </>
            )}
          </div>
        </div>

        <ContentDisplay
          content={content}
          isLoading={isGenerating}
          placeholder="Your generated podcast summary will appear here..."
        />
      </div>
    </div>
  )
}
