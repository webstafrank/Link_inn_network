"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { saveUserPreferences } from "@/lib/actions/recommendation-actions"
import prisma from "@/lib/db"

// Define the form schema
const formSchema = z.object({
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  fitnessLevel: z.string().optional(),
  fitnessGoals: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface UserPreferencesFormProps {
  initialData?: {
    categories?: string[]
    tags?: string[]
    fitnessLevel?: string
    fitnessGoals?: string[]
  }
}

export default function UserPreferencesForm({ initialData }: UserPreferencesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [tags, setTags] = useState<{ id: string; name: string }[]>([])

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: initialData?.categories || [],
      tags: initialData?.tags || [],
      fitnessLevel: initialData?.fitnessLevel || "",
      fitnessGoals: initialData?.fitnessGoals || [],
    },
  })

  // Fetch categories and tags on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          }),
          prisma.tag.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
          }),
        ])

        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error("Error fetching form data:", error)
        toast({
          title: "Error",
          description: "Failed to load preferences data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      await saveUserPreferences(values)
      toast({
        title: "Preferences saved",
        description: "Your content preferences have been updated",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Categories</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(category.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), category.id]
                            : (field.value || []).filter((id) => id !== category.id)
                          field.onChange(updatedValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{category.name}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormDescription>
                Select categories that interest you to get more relevant recommendations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {tags.map((tag) => (
                  <FormItem key={tag.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(tag.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), tag.id]
                            : (field.value || []).filter((id) => id !== tag.id)
                          field.onChange(updatedValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{tag.name}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormDescription>Select specific topics you're interested in.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fitnessLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fitness Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>This helps us recommend appropriate fitness content.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fitnessGoals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fitness Goals</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { id: "strength", label: "Strength" },
                  { id: "muscle-building", label: "Muscle Building" },
                  { id: "fat-loss", label: "Fat Loss" },
                  { id: "endurance", label: "Endurance" },
                  { id: "flexibility", label: "Flexibility" },
                  { id: "general-fitness", label: "General Fitness" },
                ].map((goal) => (
                  <FormItem key={goal.id} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(goal.id)}
                        onCheckedChange={(checked) => {
                          const updatedValue = checked
                            ? [...(field.value || []), goal.id]
                            : (field.value || []).filter((id) => id !== goal.id)
                          field.onChange(updatedValue)
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{goal.label}</FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormDescription>Select your fitness goals to get targeted recommendations.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </form>
    </Form>
  )
}

