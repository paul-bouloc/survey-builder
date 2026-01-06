import AuthLayout from '@/components/layouts/auth-layout/auth.layout'
import { AuthForm } from '@/features/auth/components/auth-form.component'
import type { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const LoginPage: NextPageWithLayout = () => {
  const t = useTranslations('routes.auth')

  return (
    <>
      <Head>
        <title>{t('login')}</title>
      </Head>
      <div className="flex w-full flex-col items-center p-4">
        <AuthForm />
      </div>
    </>
  )
}

LoginPage.getLayout = page => <AuthLayout>{page}</AuthLayout>
LoginPage.public = true

export default LoginPage
