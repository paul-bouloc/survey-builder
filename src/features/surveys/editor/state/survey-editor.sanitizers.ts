import { surveyMetaConfig } from '../config/survey-meta.config'
import { surveyNodeConfig } from '../config/survey-node.config'
import type { SurveyMetaPatch, SurveyNodePatch } from './survey-editor.types'

/**
 * Sanitize un patch meta du survey (titre, sous-titre, description).
 * Applique les maxLength de la config et retourne un patch prêt à être appliqué au state.
 */
export function sanitizeSurveyMetaPatch(
  patch: SurveyMetaPatch
): SurveyMetaPatch {
  const result: SurveyMetaPatch = {}
  if (patch.title !== undefined) {
    result.title = patch.title.slice(0, surveyMetaConfig.title.maxLength)
  }
  if (patch.subtitle !== undefined) {
    result.subtitle = patch.subtitle.slice(
      0,
      surveyMetaConfig.subtitle.maxLength
    )
  }
  if (patch.description !== undefined) {
    result.description = patch.description.slice(
      0,
      surveyMetaConfig.description.maxLength
    )
  }
  return result
}

/**
 * Sanitize un patch de node (titre, sous-titre, description).
 * Applique les maxLength de la config, conserve null si fourni, et retourne un patch prêt à être appliqué au state.
 */
export function sanitizeSurveyNodePatch(
  patch: SurveyNodePatch
): SurveyNodePatch {
  const result: SurveyNodePatch = {}
  if (patch.title !== undefined) {
    result.title =
      patch.title === null
        ? null
        : patch.title.slice(0, surveyNodeConfig.title.maxLength)
  }
  if (patch.subtitle !== undefined) {
    result.subtitle =
      patch.subtitle === null
        ? null
        : patch.subtitle.slice(0, surveyNodeConfig.subtitle.maxLength)
  }
  if (patch.description !== undefined) {
    result.description =
      patch.description === null
        ? null
        : patch.description.slice(0, surveyNodeConfig.description.maxLength)
  }
  return result
}
