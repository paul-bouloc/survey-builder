import { routes } from '@/config/routes'
import { useSession } from '@/features/auth/api/auth.mutations'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface SessionGuardProps {
  children: React.ReactNode
}

export function SessionGuard({ children }: SessionGuardProps) {
  const router = useRouter()
  const { data: session, isLoading, isError } = useSession()
  const tCommon = useTranslations('common')

  useEffect(() => {
    if (!isLoading && (isError || !session)) {
      const currentPath = router.asPath
      const loginPath = routes.auth.login.path
      const redirectUrl =
        currentPath && currentPath !== loginPath
          ? routes.auth.login.getHref(currentPath)
          : routes.auth.login.getHref()
      router.push(redirectUrl)
    }
  }, [session, isLoading, isError, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-muted-foreground text-sm">
            {tCommon('loading')}...
          </p>
        </div>
      </div>
    )
  }

  if (isError || !session) {
    return null
  }

  return <>{children}</>
}
