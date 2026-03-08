import { createRoute } from '@/server/api/create-route'
import { createSurvey } from '@/server/api/routes/surveys/create.post'
import { findAllSurveys } from '@/server/api/routes/surveys/find-all.get'

export default createRoute({
  GET: findAllSurveys,
  POST: createSurvey
})
