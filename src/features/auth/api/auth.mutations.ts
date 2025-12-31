import type { RegisterBody } from '@/shared/api/contracts/auth.contract'
import { useMutation } from '@tanstack/react-query'
import { authClient } from './auth.client'

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterBody) => authClient.register(payload)
  })
}
