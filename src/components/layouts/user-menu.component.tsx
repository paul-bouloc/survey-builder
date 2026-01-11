import { EnIcon } from '@/components/icons/flags/en.icon'
import { FrIcon } from '@/components/icons/flags/fr.icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { routes } from '@/config/routes'
import { useLogout, useSession } from '@/features/auth/api/auth.mutations'
import { LogOut, Moon, Sun, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import * as React from 'react'

export function UserMenu() {
  const { data: session } = useSession()
  const logout = useLogout()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const t = useTranslations('nav')

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!session || !mounted) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      router.push(routes.auth.login.getHref())
    } catch (_error) {
      router.push(routes.auth.login.getHref())
    }
  }

  const handleLanguageToggle = async () => {
    const nextLocale = router.locale === 'fr' ? 'en' : 'fr'
    await router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: nextLocale }
    )
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              aria-label="User menu"
            >
              <User className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('account')}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{session.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="size-4" />
              <span>{t('lightMode')}</span>
            </>
          ) : (
            <>
              <Moon className="size-4" />
              <span>{t('darkMode')}</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLanguageToggle}>
          {router.locale === 'fr' ? (
            <>
              <div className="flex size-4 items-center justify-center [&_svg]:size-4">
                <EnIcon />
              </div>
              <span>{t('switchLanguage')}</span>
            </>
          ) : (
            <>
              <div className="flex size-4 items-center justify-center [&_svg]:size-4">
                <FrIcon />
              </div>
              <span>{t('switchLanguage')}</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          disabled={logout.isPending}
        >
          <LogOut className="size-4" />
          <span>{logout.isPending ? t('loggingOut') : t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
