import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const SurveyAnalyticsPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Survey Analytics {surveyShortId}</h1>
    </div>
  )
}

export default SurveyAnalyticsPage
