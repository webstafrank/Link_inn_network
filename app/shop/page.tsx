import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function ShopPage() {
  // Mock product data
  const featuredProducts = [
    {
      id: 1,
      title: "12-Week Strength Program",
      description: "Build raw strength and power with our comprehensive training system",
      price: "$97",
      category: "Fitness",
      image: "/placeholder.svg?height=400&width=600&text=Strength+Program",
    },
    {
      id: 2,
      title: "The Masculine Mind",
      description: "A deep dive into the psychology of successful men",
      price: "$49",
      category: "Books",
      image: "/placeholder.svg?height=400&width=600&text=Book",
    },
    {
      id: 3,
      title: "Dating Mastery Course",
      description: "Develop the confidence and skills to excel in your relationships",
      price: "$129",
      category: "Courses",
      image: "/placeholder.svg?height=400&width=600&text=Dating+Course",
    },
  ]

  const products = [
    {
      id: 4,
      title: "Advanced Hypertrophy Program",
      description: "Scientifically designed to maximize muscle growth",
      price: "$89",
      category: "Fitness",
      image: "/placeholder.svg?height=400&width=600&text=Hypertrophy+Program",
    },
    {
      id: 5,
      title: "Intermittent Fasting Guide",
      description: "Optimize your nutrition with strategic eating windows",
      price: "$29",
      category: "Nutrition",
      image: "/placeholder.svg?height=400&width=600&text=Nutrition+Guide",
    },
    {
      id: 6,
      title: "The Art of Assertiveness",
      description: "Learn to communicate with confidence and clarity",
      price: "$39",
      category: "Books",
      image: "/placeholder.svg?height=400&width=600&text=Assertiveness+Book",
    },
    {
      id: 7,
      title: "Financial Freedom Blueprint",
      description: "A step-by-step guide to building wealth and security",
      price: "$79",
      category: "Courses",
      image: "/placeholder.svg?height=400&width=600&text=Finance+Course",
    },
    {
      id: 8,
      title: "Morning Routine Mastery",
      description: "Transform your mornings, transform your life",
      price: "$19",
      category: "Courses",
      image: "/placeholder.svg?height=400&width=600&text=Morning+Routine",
    },
    {
      id: 9,
      title: "Premium Leather Journal",
      description: "Track your goals and reflections with our handcrafted journal",
      price: "$45",
      category: "Accessories",
      image: "/placeholder.svg?height=400&width=600&text=Journal",
    },
  ]

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-heading tracking-tighter md:text-5xl">THE FORGE SHOP</h1>
          <p className="mt-2 text-xl text-muted-foreground">Premium resources to accelerate your growth</p>
        </div>

        {/* Featured Products */}
        <section>
          <h2 className="mb-6 text-2xl font-heading tracking-tight">Featured Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={400}
                  height={225}
                  className="aspect-video w-full object-cover"
                />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{product.category}</span>
                  </div>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span className="text-xl font-bold">{product.price}</span>
                  <Link href={`/shop/product/${product.id}`}>
                    <Button>Add to Cart</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* All Products */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-heading tracking-tight">All Products</h2>
            <Tabs defaultValue="all" className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="fitness">Fitness</TabsTrigger>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  width={400}
                  height={225}
                  className="aspect-video w-full object-cover"
                />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{product.category}</span>
                  </div>
                  <CardTitle>{product.title}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span className="text-xl font-bold">{product.price}</span>
                  <Link href={`/shop/product/${product.id}`}>
                    <Button>Add to Cart</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex justify-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
}

