import { createRoute } from '@/server/api/create-route'
import { findOneSurvey } from '@/server/api/routes/surveys/find-one.get'

export default createRoute({
  GET: findOneSurvey
})
