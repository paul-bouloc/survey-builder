import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const SurveyResultDetailPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId, responseShortId } = router.query

  return (
    <div>
      <h1>Survey Result Detail</h1>
      <p>Survey: {surveyShortId}</p>
      <p>Response: {responseShortId}</p>
    </div>
  )
}

export default SurveyResultDetailPage
