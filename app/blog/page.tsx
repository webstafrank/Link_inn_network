import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function BlogPage() {
  // Mock blog posts data
  const featuredPost = {
    id: 1,
    title: "The Modern Man's Guide to Building Discipline",
    excerpt:
      "Discover the proven strategies that high-performers use to build unshakeable discipline and achieve their goals.",
    date: "March 15, 2023",
    author: "James Wilson",
    category: "Self-Discipline",
    readTime: "8 min read",
    image: "/placeholder.svg?height=600&width=1200&text=Featured+Post",
  }

  const posts = [
    {
      id: 2,
      title: "Strength Training Fundamentals Every Man Should Know",
      excerpt: "Master the essential lifts and principles that form the foundation of an effective strength program.",
      date: "March 10, 2023",
      author: "Mike Johnson",
      category: "Fitness",
      readTime: "6 min read",
      image: "/placeholder.svg?height=400&width=600&text=Strength+Training",
    },
    {
      id: 3,
      title: "The Art of Stoicism in Modern Life",
      excerpt:
        "How ancient wisdom can help you navigate the challenges of the modern world with resilience and clarity.",
      date: "March 5, 2023",
      author: "Robert Greene",
      category: "Philosophy",
      readTime: "10 min read",
      image: "/placeholder.svg?height=400&width=600&text=Stoicism",
    },
    {
      id: 4,
      title: "Financial Independence: The Ultimate Freedom",
      excerpt: "Practical strategies to build wealth, eliminate debt, and achieve true financial independence.",
      date: "February 28, 2023",
      author: "David Ramsey",
      category: "Finance",
      readTime: "7 min read",
      image: "/placeholder.svg?height=400&width=600&text=Finance",
    },
    {
      id: 5,
      title: "Mastering Social Dynamics: A Guide for Introverts",
      excerpt:
        "How to navigate social situations with confidence and authenticity, even if you're naturally introverted.",
      date: "February 20, 2023",
      author: "Jordan Peterson",
      category: "Social Skills",
      readTime: "9 min read",
      image: "/placeholder.svg?height=400&width=600&text=Social+Dynamics",
    },
    {
      id: 6,
      title: "The Forgotten Art of Deep Focus",
      excerpt: "In a world of constant distraction, learn how to cultivate the superpower of sustained attention.",
      date: "February 15, 2023",
      author: "Cal Newport",
      category: "Productivity",
      readTime: "5 min read",
      image: "/placeholder.svg?height=400&width=600&text=Deep+Focus",
    },
    {
      id: 7,
      title: "Building a Powerful Morning Routine",
      excerpt: "How the first hour of your day can set you up for success or failure, and how to optimize it.",
      date: "February 10, 2023",
      author: "Tim Ferriss",
      category: "Habits",
      readTime: "6 min read",
      image: "/placeholder.svg?height=400&width=600&text=Morning+Routine",
    },
  ]

  const categories = [
    "All",
    "Self-Discipline",
    "Fitness",
    "Philosophy",
    "Finance",
    "Social Skills",
    "Productivity",
    "Habits",
    "Dating",
    "Career",
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter md:text-5xl">THE FORGE BLOG</h1>
          <p className="mt-2 text-xl text-muted-foreground">Practical wisdom for the modern man</p>
        </div>

        <div className="flex overflow-x-auto py-2 scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button key={category} variant={category === "All" ? "default" : "outline"} className="rounded-full">
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div className="rounded-xl border bg-card text-card-foreground overflow-hidden">
          <div className="grid gap-4 md:grid-cols-2">
            <Image
              src={featuredPost.image || "/placeholder.svg"}
              alt={featuredPost.title}
              width={600}
              height={400}
              className="h-full w-full object-cover"
            />
            <div className="flex flex-col justify-center space-y-4 p-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{featuredPost.category}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{featuredPost.readTime}</span>
                </div>
                <h2 className="text-3xl font-heading tracking-tight">{featuredPost.title}</h2>
                <p className="text-muted-foreground">{featuredPost.excerpt}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-muted p-1">
                  <div className="h-8 w-8 rounded-full bg-background" />
                </div>
                <div>
                  <p className="text-sm font-medium">{featuredPost.author}</p>
                  <p className="text-xs text-muted-foreground">{featuredPost.date}</p>
                </div>
              </div>
              <div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <Button className="group">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* All Posts */}
        <div>
          <h2 className="mb-6 text-2xl font-heading tracking-tight">Latest Articles</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={400}
                  height={225}
                  className="aspect-video w-full object-cover"
                />
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{post.category}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-muted p-1">
                      <div className="h-6 w-6 rounded-full bg-background" />
                    </div>
                    <span className="text-xs">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="ghost" size="sm">
                      Read More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </div>
    </div>
  )
}
