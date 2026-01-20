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
import { getSafeRedirectFromQuery } from '@/lib/safe-redirect'
import {
  AuthCheckBodySchema,
  AuthRegisterBodySchema
} from '@/shared/api/contracts/auth/auth.contract'
import { translateFieldErrors } from '@/shared/i18n/zod-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('auth.login')
  const tForm = useTranslations('form')
  const tCommon = useTranslations('common')
  const tFormError = useTranslations('formError')
  const [needsRegistration, setNeedsRegistration] = useState(false)

  const redirectTo = getSafeRedirectFromQuery(
    router.query,
    routes.home.getHref()
  )

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
        toast.success(t('toasts.loginSuccessful'))
        router.push(redirectTo)
      }
    } catch (_error) {
      toast.error(t('toasts.loginFailed'))
    }
  }

  const handleRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await auth.mutateAsync(values)

      if (result.isNewUser) {
        toast.success(t('toasts.registrationSuccessful'))
      } else {
        toast.success(t('toasts.loginSuccessful'))
      }

      router.push(redirectTo)
    } catch (_error) {
      toast.error(t('toasts.registrationFailed'))
    }
  }

  const containerVariants = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  }

  const nameFieldVariants = {
    initial: { opacity: 0, height: 0, marginTop: 0 },
    animate: { opacity: 1, height: 'auto', marginTop: 2 },
    exit: { opacity: 0, height: 0, marginTop: 0 }
  }

  const textVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-md"
    >
      <form
        onSubmit={
          needsRegistration
            ? registerForm.handleSubmit(handleRegisterSubmit)
            : emailForm.handleSubmit(handleEmailSubmit)
        }
        noValidate
        className="w-full"
      >
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={needsRegistration ? 'register' : 'login'}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
              <FieldLegend>
                {needsRegistration ? t('register') : t('login')}
              </FieldLegend>
              <FieldDescription>
                {needsRegistration
                  ? t('registerDescription')
                  : t('loginDescription')}
              </FieldDescription>
            </motion.div>
          </AnimatePresence>
        </div>

        <FieldGroup className="mt-6 [&>[data-slot=field]:first-of-type]:mb-0">
          {needsRegistration ? (
            <Controller
              name="email"
              control={registerForm.control}
              render={({ field, fieldState }) => (
                <motion.div
                  animate={{
                    opacity: 0.6
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-email">
                      {tForm('inputs.email.label')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="auth-email"
                      type="email"
                      placeholder={tForm('inputs.email.placeholder')}
                      autoComplete="email"
                      inputMode="email"
                      disabled
                      className="bg-muted"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError
                        errors={translateFieldErrors(
                          fieldState.error,
                          tFormError
                        )}
                      />
                    )}
                  </Field>
                </motion.div>
              )}
            />
          ) : (
            <Controller
              name="email"
              control={emailForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="auth-email">
                    {tForm('inputs.email.label')}
                  </FieldLabel>
                  <Input
                    {...field}
                    id="auth-email"
                    type="email"
                    placeholder={tForm('inputs.email.placeholder')}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={translateFieldErrors(
                        fieldState.error,
                        tFormError
                      )}
                    />
                  )}
                </Field>
              )}
            />
          )}

          <AnimatePresence>
            {needsRegistration && (
              <motion.div
                variants={nameFieldVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="-mt-2!"
              >
                <Controller
                  name="name"
                  control={registerForm.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="auth-name">
                        {tForm('inputs.name.label')}
                      </FieldLabel>
                      <Input
                        {...field}
                        id="auth-name"
                        placeholder={tForm('inputs.name.placeholder')}
                        autoComplete="name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={translateFieldErrors(
                            fieldState.error,
                            tFormError
                          )}
                        />
                      )}
                    </Field>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="flex flex-wrap justify-end gap-2"
            animate={{
              marginTop: needsRegistration ? 16 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              {needsRegistration && (
                <motion.div
                  key="back-button"
                  initial={{ opacity: 0, x: -20, width: 0, marginRight: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto', marginRight: 8 }}
                  exit={{ opacity: 0, x: -20, width: 0, marginRight: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', flexShrink: 0 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNeedsRegistration(false)
                      registerForm.reset()
                    }}
                    disabled={auth.isPending}
                  >
                    {tCommon('back')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key="submit-button"
              initial={false}
              animate={{
                width: 'auto'
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                flexShrink: 0
              }}
            >
              <Button type="submit" isLoading={auth.isPending}>
                {needsRegistration ? t('register') : tCommon('continue')}
              </Button>
            </motion.div>
          </motion.div>
        </FieldGroup>
      </form>
    </motion.div>
  )
}
