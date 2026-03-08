import type { Survey } from '@/shared/types/surveys/survey.type'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'

export interface SessionForEditCheck {
  userId: string
}

/**
 * Vérifie si la survey peut être éditée par l'utilisateur connecté.
 * Règles : status = draft ET createdBy = userId de la session.
 */
export function canEditSurvey(
  survey: Survey,
  session: SessionForEditCheck
): boolean {
  return (
    survey.status === SurveyStatus.DRAFT && survey.createdBy === session.userId
  )
}
