import { SessionGuard } from '@/components/auth/session-guard.component'
import MainLayout from '@/components/layouts/root-layout/root.layout'
import { ThemeProvider } from '@/components/theme-provider'
import { routes } from '@/config/routes'
import { store } from '@/store'
import { messagesByLocale, type Locale } from '@/shared/i18n/messages'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { NextPage } from 'next'
import type { AbstractIntlMessages } from 'next-intl'
import { NextIntlClientProvider } from 'next-intl'
import type { AppProps } from 'next/app'
import { Geist_Mono, Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono'
})

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
  public?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
  pageProps: AppProps['pageProps'] & {
    messages?: AbstractIntlMessages
  }
}

function AppContent({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()
  const isPublicPage = Component.public ?? false
  const isAuthPage =
    router.pathname?.startsWith(routes.auth.login.path) ?? false

  const getLayout =
    Component.getLayout ?? (page => <MainLayout>{page}</MainLayout>)

  const page = <Component {...pageProps} />

  if (isPublicPage || isAuthPage) {
    return getLayout(page)
  }

  return <SessionGuard>{getLayout(page)}</SessionGuard>
}

export default function App(props: AppPropsWithLayout) {
  const router = useRouter()
  const locale = (router.locale ?? router.defaultLocale ?? 'fr') as Locale
  const messages = props.pageProps.messages ?? messagesByLocale[locale]
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false
          },
          mutations: {
            retry: 0
          }
        }
      })
  )

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider
        messages={messages}
        locale={locale}
        timeZone="Europe/Paris"
        now={new Date()}
      >
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <div
              className={`${inter.variable} ${geistMono.variable} antialiased`}
            >
              <AppContent {...props} />
            </div>
          </Provider>
          <Toaster position="bottom-center" />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
            />
          )}
        </QueryClientProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
