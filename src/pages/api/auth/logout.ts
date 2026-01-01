import { createRoute } from '@/server/api/create-route'
import { postLogout } from '@/server/api/routes/auth/logout.post'

export default createRoute({
  POST: postLogout
})
