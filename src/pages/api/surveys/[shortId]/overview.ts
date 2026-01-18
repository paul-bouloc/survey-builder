import { createRoute } from '@/server/api/create-route'
import { getSurveyOverview } from '@/server/api/routes/surveys/overview.get'

export default createRoute({
  GET: getSurveyOverview
})
