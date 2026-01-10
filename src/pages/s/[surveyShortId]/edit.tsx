import { NextPageWithLayout } from '@/pages/_app'
import { useRouter } from 'next/router'

const EditSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query

  return (
    <div>
      <h1>Edit Survey {surveyShortId}</h1>
    </div>
  )
}

export default EditSurveyPage

