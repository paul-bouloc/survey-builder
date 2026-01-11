import { createRoute } from '@/server/api/create-route'
import { getSurvey } from '@/server/api/routes/surveys/get-one'

export default createRoute({
  GET: getSurvey
})
