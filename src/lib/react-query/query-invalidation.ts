import { authQueryKeys } from '@/features/auth/api/query-keys'
import { useQueryClient } from '@tanstack/react-query'

export function useQueryInvalidation() {
  const queryClient = useQueryClient()

  return {
    invalidateAuth: () => {
      return queryClient.invalidateQueries({
        queryKey: authQueryKeys.all
      })
    },

    invalidateSession: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.session()
      })
    },

    refetchSession: async () => {
      await queryClient.refetchQueries({
        queryKey: authQueryKeys.session()
      })
    }
  }
}
