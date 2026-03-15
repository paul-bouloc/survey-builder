import type { Survey } from '@/shared/types/surveys/survey.type'
import type { SurveyDraft } from '../model/survey-draft.type'

/**
 * Transforme un Survey (modèle API) en SurveyDraft (modèle d'édition).
 * Ne conserve que les champs utiles à l'éditeur.
 */
export function surveyToDraft(survey: Survey): SurveyDraft {
  return {
    shortId: survey.shortId,
    title: survey.title,
    subtitle: survey.subtitle,
    description: survey.description,
    pages: survey.pages
  }
}
