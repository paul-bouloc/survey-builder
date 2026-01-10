import type {
  AuthCheckBody,
  AuthRegisterBody
} from '@/shared/api/contracts/auth.contract'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from './auth.client'
import { authQueryKeys } from './query-keys'

export function useAuth() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AuthCheckBody | AuthRegisterBody) =>
      authClient.auth(payload),
    onSuccess: async data => {
      if (data.userId && !data.needsRegistration) {
        queryClient.setQueryData(authQueryKeys.session(), {
          userId: data.userId,
          email: data.email,
          name: data.name,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      }
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authClient.logout(),
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: authQueryKeys.session()
      })
    }
  })
}

export function useSession() {
  return useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: () => authClient.getSession(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}
