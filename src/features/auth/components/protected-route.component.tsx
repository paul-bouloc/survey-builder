import { routes } from '@/config/routes'
import { useSession } from '@/features/auth/api/auth.mutations'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, isLoading, isError } = useSession()

  useEffect(() => {
    if (!isLoading && (isError || !session)) {
      router.push(routes.auth.login.getHref())
    }
  }, [session, isLoading, isError, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  if (isError || !session) {
    return null // La redirection est en cours
  }

  return <>{children}</>
}
