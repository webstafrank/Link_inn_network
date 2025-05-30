import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import UserPreferencesForm from "@/components/recommendations/user-preferences-form"

export default async function PreferencesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/preferences")
  }

  // Get user preferences
  const userPreferences = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-heading tracking-tighter mb-2">CONTENT PREFERENCES</h1>
          <p className="text-xl text-muted-foreground">
            Customize your recommendations to get content that matters to you
          </p>
        </div>

        <div className="space-y-8">
          <UserPreferencesForm initialData={userPreferences || undefined} />
        </div>
      </div>
    </div>
  )
}

