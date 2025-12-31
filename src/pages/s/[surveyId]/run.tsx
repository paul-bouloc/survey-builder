import AuthLayout from '@/components/layouts/survey-layout/survey.layout'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from '../../_app'

const RunSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  return (
    <div>
      <h1>Run Survey {router.query.surveyId}</h1>
    </div>
  )
}

RunSurveyPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>
}

export default RunSurveyPage
