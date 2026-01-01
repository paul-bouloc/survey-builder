import { createEndpoint } from '@/server/api/create-endpoint'
import { ConflictException } from '@/server/api/errors'
import { User } from '@/server/models'
import {
  RegisterBodySchema,
  RegisterResponseSchema
} from '@/shared/api/contracts/auth.contract'

export const postRegister = createEndpoint(
  {
    body: RegisterBodySchema,
    response: RegisterResponseSchema
  },
  async ({ body }) => {
    const existingUser = await User.findOne({ email: body.email }).select(
      'email'
    )

    if (existingUser) {
      throw new ConflictException('Email already in use')
    }

    const user = await User.create({
      email: body.email,
      name: body.name
    })

    const created = {
      userId: user._id.toString(),
      email: user.email
    }

    return created
  }
)
