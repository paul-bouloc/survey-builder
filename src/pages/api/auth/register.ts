import { createRoute } from '@/server/api/create-route'
import { postRegister } from '@/server/api/routes/auth/register.post'

export default createRoute({
  POST: postRegister
})
