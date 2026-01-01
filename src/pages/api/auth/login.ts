import { createRoute } from '@/server/api/create-route'
import { postLogin } from '@/server/api/routes/auth/login.post'

export default createRoute({
  POST: postLogin
})
