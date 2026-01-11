import type {
  CreateSurveyBody,
  SurveyResponse,
  SurveysListResponse
} from '@/shared/api/contracts/surveys.contract'
import { surveyMapper } from '@/shared/api/contracts/surveys.mapper'
import { http } from '@/shared/api/http/axios'

export const surveysClient = {
  getSurveys: async () => {
    const { data } = await http.get<SurveysListResponse>('/surveys')
    const surveys = data.surveys.map(surveyMapper.toDomain)
    return { surveys }
  },

  getSurvey: async (shortId: string) => {
    const { data } = await http.get<SurveyResponse>(`/surveys/${shortId}`)
    return surveyMapper.toDomain(data)
  },

  createSurvey: async (payload: CreateSurveyBody) => {
    const { data } = await http.post<SurveyResponse>('/surveys', payload)
    return surveyMapper.toDomain(data)
  }
}
