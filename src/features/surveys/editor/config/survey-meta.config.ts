export const surveyMetaConfig = {
  title: {
    maxLength: 200
  },
  subtitle: {
    maxLength: 500
  },
  description: {
    maxLength: 5000
  }
} as const

export type SurveyMetaFieldKey = keyof typeof surveyMetaConfig
