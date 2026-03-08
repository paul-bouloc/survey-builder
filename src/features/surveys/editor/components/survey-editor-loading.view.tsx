import { useTranslations } from 'next-intl'

export function SurveyEditorLoadingView() {
  const t = useTranslations('surveys.edit')

  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="border-primary size-8 animate-spin rounded-full border-4 border-t-transparent"
          aria-hidden
        />
        <p className="text-muted-foreground text-sm">{t('loading')}</p>
      </div>
    </div>
  )
}
