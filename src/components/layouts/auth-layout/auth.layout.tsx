import { AuthRedirect } from '@/components/auth/auth-redirect.component'
import AuthNavbar from '@/components/layouts/auth-layout/auth.navbar'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex w-full flex-col">
      <AuthRedirect />
      <AuthNavbar />
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  )
}
