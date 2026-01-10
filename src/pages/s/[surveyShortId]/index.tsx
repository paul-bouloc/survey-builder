import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const SurveyOverviewPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Survey Overview {surveyShortId}</h1>
    </div>
  )
}

export default SurveyOverviewPage
