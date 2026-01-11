import { createRoute } from '@/server/api/create-route'
import { getSurveys } from '@/server/api/routes/surveys/get'
import { postSurvey } from '@/server/api/routes/surveys/post'

export default createRoute({
  GET: getSurveys,
  POST: postSurvey
})
