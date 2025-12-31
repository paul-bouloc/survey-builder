import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr" suppressHydrationWarning>
      <Head />
      <body className="h-screen w-full overflow-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
