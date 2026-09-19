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
  SegmentedControl,
  SegmentedControlItem,
  SegmentedControlList
} from '@/components/ui/segmented-control'
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

const stopHorizontalArrows = (event: React.KeyboardEvent) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.stopPropagation()
  }
}

export function UserMenu() {
  const { data: session } = useSession()
  const logout = useLogout()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
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

  const handleLocaleChange = async (locale: string) => {
    if (locale === router.locale) {
      return
    }

    await router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
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
              <User className="size-4" strokeWidth={1.5} />
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
        {/* Les flèches gauche/droite pilotent les segments ; sans cette barrière
            le menu Radix les intercepterait pour naviguer entre ses items. */}
        <div onKeyDown={stopHorizontalArrows}>
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm">
            <span>{t('theme')}</span>
            <SegmentedControl
              value={resolvedTheme === 'dark' ? 'dark' : 'light'}
              onValueChange={setTheme}
            >
              <SegmentedControlList>
                <SegmentedControlItem value="light" aria-label={t('lightMode')}>
                  <Sun strokeWidth={1.5} />
                </SegmentedControlItem>
                <SegmentedControlItem value="dark" aria-label={t('darkMode')}>
                  <Moon strokeWidth={1.5} />
                </SegmentedControlItem>
              </SegmentedControlList>
            </SegmentedControl>
          </div>
          <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm">
            <span>{t('language')}</span>
            <SegmentedControl
              value={router.locale === 'en' ? 'en' : 'fr'}
              onValueChange={handleLocaleChange}
            >
              <SegmentedControlList>
                <SegmentedControlItem value="fr" aria-label={t('french')}>
                  <FrIcon />
                </SegmentedControlItem>
                <SegmentedControlItem value="en" aria-label={t('english')}>
                  <EnIcon />
                </SegmentedControlItem>
              </SegmentedControlList>
            </SegmentedControl>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          variant="destructive"
          disabled={logout.isPending}
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          <span>{logout.isPending ? t('loggingOut') : t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
