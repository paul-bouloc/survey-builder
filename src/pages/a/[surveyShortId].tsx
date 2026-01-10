import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const AnswerSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Answer Survey {surveyShortId}</h1>
    </div>
  )
}

export default AnswerSurveyPage

