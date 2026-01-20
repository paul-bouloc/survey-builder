import { createEndpoint } from '@/server/api/create-endpoint'
import { setAuthCookie } from '@/server/auth/cookies'
import { generateToken } from '@/server/auth/jwt'
import { User } from '@/server/models'
import {
  AuthCheckBodySchema,
  AuthRegisterBodySchema,
  AuthResponseSchema
} from '@/shared/api/contracts/auth/auth.contract'
import { z } from 'zod'

export const postLogin = createEndpoint(
  {
    requireAuth: false,
    body: z.union([AuthRegisterBodySchema, AuthCheckBodySchema]),
    response: AuthResponseSchema
  },
  async ({ body, res }) => {
    const isRegister = 'name' in body

    if (isRegister) {
      const { email, name } = body

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        const token = generateToken({
          userId: existingUser._id.toString(),
          email: existingUser.email
        })

        setAuthCookie(res, token)

        return {
          userId: existingUser._id.toString(),
          email: existingUser.email,
          name: existingUser.name,
          isNewUser: false
        }
      }

      const user = await User.create({
        email,
        name
      })

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      })

      setAuthCookie(res, token)

      return {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        isNewUser: true
      }
    } else {
      const { email } = body

      const user = await User.findOne({ email })

      if (!user) {
        return {
          userId: '',
          email: email,
          name: '',
          isNewUser: true,
          needsRegistration: true
        }
      }

      const token = generateToken({
        userId: user._id.toString(),
        email: user.email
      })

      setAuthCookie(res, token)

      return {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        isNewUser: false
      }
    }
  }
)
