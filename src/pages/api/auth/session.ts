import { createRoute } from '@/server/api/create-route'
import { getSession } from '@/server/api/routes/auth/session.get'

export default createRoute({
  GET: getSession
})
