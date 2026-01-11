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
import { Textarea } from '@/components/ui/textarea'
import { routes } from '@/config/routes'
import { useCreateSurvey } from '@/features/surveys/api/surveys.queries'
import { CreateSurveyBodySchema } from '@/shared/api/contracts/surveys.contract'
import { translateFieldErrors } from '@/shared/i18n/zod-error'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

type CreateSurveyFormValues = z.infer<typeof CreateSurveyBodySchema>

export function CreateSurveyForm() {
  const router = useRouter()
  const createSurvey = useCreateSurvey()
  const t = useTranslations('surveys.create')
  const tForm = useTranslations('form')
  const tCommon = useTranslations('common')
  const tFormError = useTranslations('formError')

  const form = useForm<CreateSurveyFormValues>({
    resolver: zodResolver(CreateSurveyBodySchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: ''
    }
  })

  const handleSubmit = async (values: CreateSurveyFormValues) => {
    try {
      const survey = await createSurvey.mutateAsync(values)
      toast.success(t('toasts.createSuccess'))
      router.push(routes.survey.edit.getHref(survey.shortId))
    } catch (_error) {
      toast.error(t('toasts.createError'))
    }
  }

  const containerVariants = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-md"
    >
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
        className="w-full"
      >
        <div>
          <FieldLegend>{t('title')}</FieldLegend>
          <FieldDescription>{t('description')}</FieldDescription>
        </div>

        <FieldGroup className="mt-6">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="survey-title">
                  {tForm('inputs.title.label')}
                </FieldLabel>
                <Input
                  {...field}
                  id="survey-title"
                  placeholder={tForm('inputs.title.placeholder')}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={translateFieldErrors(fieldState.error, tFormError)}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="subtitle"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="survey-subtitle">
                  {tForm('inputs.subtitle.label')}
                </FieldLabel>
                <Input
                  {...field}
                  id="survey-subtitle"
                  placeholder={tForm('inputs.subtitle.placeholder')}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={translateFieldErrors(fieldState.error, tFormError)}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="survey-description">
                  {tForm('inputs.description.label')}
                </FieldLabel>
                <Textarea
                  {...field}
                  id="survey-description"
                  placeholder={tForm('inputs.description.placeholder')}
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError
                    errors={translateFieldErrors(fieldState.error, tFormError)}
                  />
                )}
              </Field>
            )}
          />

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createSurvey.isPending}
            >
              {tCommon('back')}
            </Button>
            <Button type="submit" isLoading={createSurvey.isPending}>
              {t('submitButton')}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </motion.div>
  )
}
