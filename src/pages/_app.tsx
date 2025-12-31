import MainLayout from '@/components/layouts/root-layout/root.layout'
import { ThemeProvider } from '@/components/theme-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import { Toaster } from 'sonner'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
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

  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? (page => <MainLayout>{page}</MainLayout>)

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <div className={`${inter.variable} antialiased`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
        <Toaster position="bottom-center" offset={70} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
