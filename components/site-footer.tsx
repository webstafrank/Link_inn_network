import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for men who want to forge their best selves.{" "}
            <Link href={siteConfig.links.terms} className="font-medium underline underline-offset-4">
              Terms
            </Link>
            .{" "}
            <Link href={siteConfig.links.privacy} className="font-medium underline underline-offset-4">
              Privacy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <Link href={siteConfig.links.instagram} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
              )}
            >
              <Icons.instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </div>
          </Link>
          <Link href={siteConfig.links.youtube} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
              )}
            >
              <Icons.youtube className="h-4 w-4" />
              <span className="sr-only">YouTube</span>
            </div>
          </Link>
          <Link href={siteConfig.links.twitter} target="_blank" rel="noreferrer">
            <div
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
              )}
            >
              <Icons.twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  )
}
