import type {
  AuthCheckBody,
  AuthRegisterBody,
  AuthResponse,
  SessionResponse
} from '@/shared/api/contracts/auth/auth.contract'
import { http } from '@/shared/api/http/axios'

export const authClient = {
  auth: async (payload: AuthCheckBody | AuthRegisterBody) => {
    const { data } = await http.post<AuthResponse>('/auth/login', payload)
    return data
  },

  getSession: async () => {
    const { data } = await http.get<SessionResponse>('/auth/session')
    return data
  },

  logout: async () => {
    const { data } = await http.post<{ success: boolean }>('/auth/logout')
    return data
  }
}
