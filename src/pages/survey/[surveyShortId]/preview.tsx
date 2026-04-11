import { RespondentTextQuestionField } from '@/features/surveys/respondent/components/respondent-text-question-field.component'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

const PreviewSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.survey')
  const [limited, setLimited] = useState('')
  const [unlimited, setUnlimited] = useState('')

  return (
    <>
      <Head>
        <title>{t('preview')}</title>
      </Head>
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-muted-foreground mb-6 text-sm">
          Preview · {typeof surveyShortId === 'string' ? surveyShortId : '…'}
        </p>
        <div className="flex flex-col gap-8">
          <RespondentTextQuestionField
            title="Short answer"
            description="This field has a maximum length; the counter updates as you type."
            config={{
              type: 'text',
              placeholder: 'Type here…',
              maxLength: 500
            }}
            value={limited}
            onChange={setLimited}
          />
          <RespondentTextQuestionField
            title="Long answer (no limit)"
            config={{
              type: 'textarea',
              placeholder: 'No character counter when maxLength is unset.',
              rows: 4
            }}
            value={unlimited}
            onChange={setUnlimited}
          />
        </div>
      </div>
    </>
  )
}

export default PreviewSurveyPage
