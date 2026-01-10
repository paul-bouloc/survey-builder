import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const SurveyResultsPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Survey Results {surveyShortId}</h1>
    </div>
  )
}

export default SurveyResultsPage

