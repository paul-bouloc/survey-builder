import type {
  RegisterBody,
  RegisterResponse
} from '@/shared/api/contracts/auth.contract'
import { http } from '@/shared/api/http/axios'

export const authClient = {
  register: async (payload: RegisterBody) => {
    const { data } = await http.post<RegisterResponse>(
      '/auth/register',
      payload
    )
    return data
  }
}
