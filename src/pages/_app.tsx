import { SessionGuard } from '@/components/auth/session-guard.component'
import MainLayout from '@/components/layouts/root-layout/root.layout'
import { ThemeProvider } from '@/components/theme-provider'
import { routes } from '@/config/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Geist_Mono, Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { Toaster } from 'sonner'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
  public?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
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
      <QueryClientProvider client={queryClient}>
        <div className={`${inter.variable} ${geistMono.variable} antialiased`}>
          <AppContent {...props} />
        </div>
        <Toaster position="bottom-center" />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
