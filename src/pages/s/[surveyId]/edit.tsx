import { useRouter } from 'next/router'
import type { NextPageWithLayout } from '../../_app'

const EditSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  return (
    <div>
      <h1>Edit Survey {router.query.surveyId}</h1>
    </div>
  )
}

export default EditSurveyPage
