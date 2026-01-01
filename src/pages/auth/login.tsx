import AuthLayout from '@/components/layouts/auth-layout/auth.layout'
import { AuthForm } from '@/features/auth/components/auth-form.component'
import type { NextPageWithLayout } from '@/pages/_app'

const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="flex w-full flex-col items-center p-4">
      <AuthForm />
    </div>
  )
}

LoginPage.getLayout = page => <AuthLayout>{page}</AuthLayout>
LoginPage.public = true

export default LoginPage
