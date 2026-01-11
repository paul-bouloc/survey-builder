import { createRoute } from '@/server/api/create-route'
import { getSurveys } from '@/server/api/routes/surveys/get'

export default createRoute({
  GET: getSurveys
})
