"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Copy, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { generateBlogPost } from "@/lib/actions/content-actions"
import ContentDisplay from "./content-display"

const formSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  keywords: z.string().optional(),
  contentType: z.enum(["full-post", "outline", "intro"]),
  tone: z.enum(["bold", "motivational", "educational", "aggressive"]),
  wordCount: z.number().min(100).max(2000),
  includeCallToAction: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export default function BlogPostGenerator() {
  const [content, setContent] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      keywords: "",
      contentType: "full-post",
      tone: "bold",
      wordCount: 800,
      includeCallToAction: true,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsGenerating(true)
    setContent("")

    try {
      const generatedContent = await generateBlogPost(values)
      setContent(generatedContent)
      toast({
        title: "Content generated successfully",
        description: "Your blog post is ready to use or edit.",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your content. Please try again.",
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
        <h2 className="text-2xl font-heading mb-4">Blog Post Generator</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Building muscle after 40" {...field} />
                  </FormControl>
                  <FormDescription>The main subject of your blog post</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., testosterone, strength training, recovery" {...field} />
                  </FormControl>
                  <FormDescription>Comma-separated keywords to include in the content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-post">Full Post</SelectItem>
                        <SelectItem value="outline">Detailed Outline</SelectItem>
                        <SelectItem value="intro">Introduction Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bold">Bold & Confident</SelectItem>
                        <SelectItem value="motivational">Motivational</SelectItem>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="wordCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Word Count: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={100}
                      max={2000}
                      step={100}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormDescription>Adjust the length of your content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeCallToAction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Include Call to Action</FormLabel>
                    <FormDescription>Add a strong call to action at the end of the post</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Content...
                </>
              ) : (
                "Generate Blog Post"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading">Generated Content</h2>
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
          placeholder="Your generated blog post will appear here..."
        />
      </div>
    </div>
  )
}

