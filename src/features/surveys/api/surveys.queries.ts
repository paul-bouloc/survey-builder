import type { CreateSurveyBody } from '@/shared/api/contracts/surveys.contract'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export function useSurvey(shortId: string) {
  return useQuery({
    queryKey: surveysQueryKeys.detail(shortId),
    queryFn: () => surveysClient.getSurvey(shortId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!shortId
  })
}

export function useSurveyOverview(shortId: string) {
  return useQuery({
    queryKey: surveysQueryKeys.overview(shortId),
    queryFn: () => surveysClient.getSurveyOverview(shortId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!shortId
  })
}

export function useCreateSurvey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateSurveyBody) =>
      surveysClient.createSurvey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: surveysQueryKeys.list()
      })
    }
  })
}
