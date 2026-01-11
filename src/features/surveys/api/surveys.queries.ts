import { useQuery } from '@tanstack/react-query'
import { surveysQueryKeys } from './query-keys'
import { surveysClient } from './surveys.client'

export function useSurveys() {
  return useQuery({
    queryKey: surveysQueryKeys.list(),
    queryFn: () => surveysClient.getSurveys(),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}
