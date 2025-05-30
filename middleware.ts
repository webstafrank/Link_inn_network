import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Only track certain paths
  if (path.startsWith("/blog/") || path.startsWith("/shop/product/") || path.startsWith("/podcasts/")) {
    // Get the user token
    const token = await getToken({ req: request })

    if (token?.sub) {
      // Extract the content type and ID from the path
      let itemType: string | null = null
      const itemId: string | null = null

      // Parse the path to get content type and ID
      if (path.startsWith("/blog/")) {
        itemType = "post"
        // We'll need to fetch the post ID from the slug in the actual implementation
      } else if (path.startsWith("/shop/product/")) {
        itemType = "product"
        // We'll need to fetch the product ID from the slug
      } else if (path.match(/^\/podcasts\/[^/]+\/[^/]+$/)) {
        itemType = "episode"
        // We'll need to fetch the episode ID from the slug
      } else if (path.match(/^\/podcasts\/[^/]+$/)) {
        itemType = "podcast"
        // We'll need to fetch the podcast ID from the slug
      }

      // In a real implementation, we would need to fetch the actual IDs
      // For now, we'll just log that we would track this activity
      console.log(`Would track activity: ${itemType}, ${path}, view`)

      // In a real implementation, we would do:
      // if (itemType && itemId) {
      //   await trackUserActivity(token.sub, itemType, itemId, "view")
      // }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/blog/:path*", "/shop/product/:path*", "/podcasts/:path*"],
}

