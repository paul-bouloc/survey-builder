import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRegister } from '@/features/auth/api/auth.mutations'
import { ApiErrorResponse } from '@/server/api/errors'
import { RegisterBodySchema } from '@/shared/api/contracts/auth.contract'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type FormValues = z.infer<typeof RegisterBodySchema>

export function RegisterForm(props: {
  onSuccess?: (data: { userId: string; email: string }) => void
}) {
  const register = useRegister()

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterBodySchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordConfirm: '',
      acceptTerms: false
    }
  })

  const { control, handleSubmit, setError, reset, formState } = form

  const handleApiSuccess = (data: { userId: string; email: string }) => {
    toast.success('API response (success)')
    props.onSuccess?.(data)
    reset({
      ...form.getValues(),
      password: '',
      passwordConfirm: ''
    })
  }

  const handleApiError = (err: unknown) => {
    const ax = err as AxiosError
    const apiErr = (ax?.response?.data as ApiErrorResponse)?.error

    toast.error('API response (error)')

    if (apiErr?.code === 'conflict') {
      setError('email', {
        type: 'server',
        message: apiErr.message ?? 'Email already in use.'
      })
      return
    }

    setError('root', {
      type: 'server',
      message: apiErr?.message ?? 'An unexpected error occurred.'
    })
  }

  function onSubmit(values: FormValues) {
    register.mutate(values, {
      onSuccess: handleApiSuccess,
      onError: handleApiError
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-md">
      <FieldLegend>Create an account</FieldLegend>
      <FieldDescription>
        Fill in your information. Your password must be strong.
      </FieldDescription>

      <FieldGroup className="mt-6">
        {formState.errors.root?.message ? (
          <div className="rounded-md border px-4 py-3 text-sm">
            {formState.errors.root.message}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-firstName">First name</FieldLabel>
                <Input
                  {...field}
                  id="register-firstName"
                  placeholder="John"
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-lastName">Last name</FieldLabel>
                <Input
                  {...field}
                  id="register-lastName"
                  placeholder="Doe"
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input
                {...field}
                id="register-email"
                placeholder="john.doe@email.com"
                autoComplete="email"
                inputMode="email"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                Used for login and important notifications.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  10+ characters, uppercase, lowercase, number and symbol.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-passwordConfirm">
                  Confirm password
                </FieldLabel>
                <Input
                  {...field}
                  id="register-passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <FieldSeparator />

        <Controller
          name="acceptTerms"
          control={control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox
                    id="register-acceptTerms"
                    name={field.name}
                    checked={field.value}
                    onCheckedChange={v => field.onChange(v === true)}
                    className="max-w-4"
                  />
                  <FieldLabel
                    htmlFor="register-acceptTerms"
                    className="font-normal"
                  >
                    I accept the Terms &amp; Conditions
                  </FieldLabel>
                </Field>
              </FieldGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldSet>
          )}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={register.isPending}
          >
            Reset
          </Button>

          <Button type="submit" disabled={register.isPending}>
            {register.isPending ? 'Creating...' : 'Create account'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
