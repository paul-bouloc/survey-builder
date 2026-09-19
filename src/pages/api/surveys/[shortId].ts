import { createRoute } from '@/server/api/create-route'
import { findOneSurvey } from '@/server/api/routes/surveys/find-one.get'
import { updateSurvey } from '@/server/api/routes/surveys/update.put'

export default createRoute({
  GET: findOneSurvey,
  PUT: updateSurvey
})
