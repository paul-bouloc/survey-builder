import { routes } from '@/config/routes'
import { useSession } from '@/features/auth/api/auth.mutations'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function AuthRedirect() {
  const router = useRouter()
  const { data: session, isLoading } = useSession()

  useEffect(() => {
    if (!isLoading && session) {
      const redirectTo =
        typeof router.query.redirect === 'string'
          ? decodeURIComponent(router.query.redirect)
          : routes.home.getHref()
      router.push(redirectTo)
    }
  }, [session, isLoading, router])

  if (isLoading || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
