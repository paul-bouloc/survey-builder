import { RespondentTextQuestionField } from '@/features/surveys/respondent/components/respondent-text-question-field.component'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

const AnswerSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes')
  const [textValue, setTextValue] = useState('')

  return (
    <>
      <Head>
        <title>{t('answer')}</title>
      </Head>
      <div className="mx-auto max-w-lg px-4 py-8">
        <p className="text-muted-foreground mb-6 text-sm">
          {typeof surveyShortId === 'string' ? surveyShortId : '…'}
        </p>
        <RespondentTextQuestionField
          title="Your response"
          config={{
            type: 'text',
            placeholder: 'Answer',
            maxLength: 280
          }}
          value={textValue}
          onChange={setTextValue}
        />
      </div>
    </>
  )
}

export default AnswerSurveyPage
