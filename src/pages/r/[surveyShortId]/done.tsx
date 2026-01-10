import SurveyLayout from '@/components/layouts/survey-layout/survey.layout'
import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

const RunSurveyDonePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Survey Completed {surveyShortId}</h1>
    </div>
  )
}

RunSurveyDonePage.getLayout = function getLayout(page: ReactElement) {
  return <SurveyLayout>{page}</SurveyLayout>
}

export default RunSurveyDonePage

