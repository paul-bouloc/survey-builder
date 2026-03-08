import { createRoute } from '@/server/api/create-route'
import { findOneSurveyOverview } from '@/server/api/routes/surveys/find-one-overview.get'

export default createRoute({
  GET: findOneSurveyOverview
})
