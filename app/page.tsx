import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-heading tracking-tighter sm:text-5xl xl:text-6xl/none">
                  FORGE YOUR BEST SELF
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discipline. Strength. Wisdom. Join the community of men committed to constant improvement.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/blog">
                  <Button size="lg" className="font-bold">
                    Start Reading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button size="lg" variant="outline" className="font-bold">
                    Shop Programs
                  </Button>
                </Link>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Hero"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Content Tabs */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading tracking-tighter sm:text-5xl">FEATURED CONTENT</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our latest articles, videos, and podcasts to help you level up in every area of life.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="articles" className="text-lg">
                  Articles
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-lg">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="podcasts" className="text-lg">
                  Podcasts
                </TabsTrigger>
              </TabsList>
              <TabsContent value="articles" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=200&width=400&text=Article+${i}`}
                        width={400}
                        height={200}
                        alt={`Article ${i}`}
                        className="w-full object-cover"
                      />
                      <CardHeader>
                        <CardTitle className="line-clamp-1">The Path to Mental Fortitude</CardTitle>
                        <CardDescription>Building resilience in a chaotic world</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">
                          Learn the strategies that elite performers use to maintain focus and clarity under pressure.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href="/blog/mental-fortitude">
                          <Button variant="ghost">Read More</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="videos" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="relative">
                        <Image
                          src={`/placeholder.svg?height=200&width=400&text=Video+${i}`}
                          width={400}
                          height={200}
                          alt={`Video ${i}`}
                          className="w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-black/70 p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">Strength Training Fundamentals</CardTitle>
                        <CardDescription>Master the essential lifts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">
                          A comprehensive guide to proper form and technique for the squat, deadlift, and bench press.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Link href="/videos/strength-fundamentals">
                          <Button variant="ghost">Watch Now</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="podcasts" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">The FORGE Podcast #${i}</CardTitle>
                        <CardDescription>With Special Guest John Smith</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">
                          A deep dive into the mindset of high performers and how to apply their principles to your
                          life.
                        </p>
                        <div className="mt-4 flex items-center space-x-2">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span className="sr-only">Play</span>
                          </Button>
                          <div className="h-2 flex-1 rounded-full bg-muted">
                            <div className="h-full w-1/3 rounded-full bg-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground">36:12</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href="/podcasts/episode-1">
                          <Button variant="ghost">Listen Now</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading tracking-tighter sm:text-5xl">FORGE YOUR FUTURE</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Premium programs and resources designed to accelerate your growth.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "12-Week Strength Program",
                description: "Build raw strength and power with our comprehensive training system",
                price: "$97",
                image: "/placeholder.svg?height=200&width=400&text=Strength+Program",
              },
              {
                title: "The Masculine Mind",
                description: "A deep dive into the psychology of successful men",
                price: "$49",
                image: "/placeholder.svg?height=200&width=400&text=Book",
              },
              {
                title: "Dating Mastery Course",
                description: "Develop the confidence and skills to excel in your relationships",
                price: "$129",
                image: "/placeholder.svg?height=200&width=400&text=Dating+Course",
              },
            ].map((product, i) => (
              <Card key={i} className="overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  width={400}
                  height={200}
                  alt={product.title}
                  className="w-full object-cover"
                />
                <CardHeader>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span className="text-xl font-bold">{product.price}</span>
                  <Link href={`/shop/product-${i + 1}`}>
                    <Button>Add to Cart</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="font-bold">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading tracking-tighter sm:text-5xl">JOIN THE BROTHERHOOD</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to our newsletter and get exclusive content, early access to new programs, and special offers.
              </p>
            </div>
            <div className="w-full max-w-md space-y-2">
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit" className="font-bold">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-2">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
