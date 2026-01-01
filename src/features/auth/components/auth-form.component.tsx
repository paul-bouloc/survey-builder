import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { routes } from '@/config/routes'
import { useAuth } from '@/features/auth/api/auth.mutations'
import { getErrorMessage } from '@/lib/api-error'
import {
  AuthCheckBodySchema,
  AuthRegisterBodySchema
} from '@/shared/api/contracts/auth.contract'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type EmailFormValues = z.infer<typeof AuthCheckBodySchema>
type RegisterFormValues = z.infer<typeof AuthRegisterBodySchema>

export function AuthForm() {
  const router = useRouter()
  const auth = useAuth()
  const [needsRegistration, setNeedsRegistration] = useState(false)

  // Get redirect URL from query params
  const redirectTo =
    typeof router.query.redirect === 'string'
      ? decodeURIComponent(router.query.redirect)
      : routes.home.getHref()

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(AuthCheckBodySchema),
    defaultValues: {
      email: ''
    }
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(AuthRegisterBodySchema),
    defaultValues: {
      email: '',
      name: ''
    }
  })

  const handleEmailSubmit = async (values: EmailFormValues) => {
    try {
      const result = await auth.mutateAsync(values)

      if (result.needsRegistration || (result.isNewUser && !result.name)) {
        setNeedsRegistration(true)
        registerForm.setValue('email', values.email)
      } else {
        toast.success('Login successful')
        router.push(redirectTo)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      toast.error(errorMessage)
      emailForm.setError('root', {
        type: 'server',
        message: errorMessage
      })
    }
  }

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await auth.mutateAsync(values)

      if (result.isNewUser) {
        toast.success('Registration successful')
      } else {
        toast.success('Login successful')
      }

      router.push(redirectTo)
    } catch (error) {
      const errorMessage = getErrorMessage(error)

      toast.error(errorMessage)
      registerForm.setError('root', {
        type: 'server',
        message: errorMessage
      })
    }
  }

  if (needsRegistration) {
    return (
      <form
        onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
        noValidate
        className="w-full max-w-md"
      >
        <FieldLegend>Create an account</FieldLegend>
        <FieldDescription>
          Please enter your name to complete your registration.
        </FieldDescription>

        <FieldGroup className="mt-6">
          {registerForm.formState.errors.root?.message ? (
            <div className="text-destructive rounded-md border px-4 py-3 text-sm">
              {registerForm.formState.errors.root.message}
            </div>
          ) : null}

          <Controller
            name="email"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="auth-email"
                  type="email"
                  disabled
                  className="bg-muted"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={registerForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="auth-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="auth-name"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNeedsRegistration(false)
                registerForm.reset()
              }}
              disabled={auth.isPending}
            >
              Back
            </Button>

            <Button type="submit" disabled={auth.isPending}>
              {auth.isPending ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
      noValidate
      className="w-full max-w-md"
    >
      <FieldLegend>Login</FieldLegend>
      <FieldDescription>
        Enter your email address to sign in or create an account.
      </FieldDescription>

      <FieldGroup className="mt-6">
        {emailForm.formState.errors.root?.message ? (
          <div className="text-destructive rounded-md border px-4 py-3 text-sm">
            {emailForm.formState.errors.root.message}
          </div>
        ) : null}

        <Controller
          name="email"
          control={emailForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="auth-email">Email</FieldLabel>
              <Input
                {...field}
                id="auth-email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                inputMode="email"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="submit" disabled={auth.isPending}>
            {auth.isPending ? 'Signing in...' : 'Continue'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
