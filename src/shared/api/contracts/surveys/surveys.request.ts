import { PageNodeSchema } from '@/shared/api/contracts/surveys/node.schema'
import { z } from 'zod'

export const CreateSurveyBodySchema = z.object({
  title: z
    .string('errors.common.required')
    .trim()
    .min(1, 'errors.common.required')
    .max(200, 'errors.common.max'),
  subtitle: z.string().trim().max(200, 'errors.common.max').optional(),
  description: z.string().trim().max(1000, 'errors.common.max').optional()
})

export type CreateSurveyBody = z.infer<typeof CreateSurveyBodySchema>

export const UpdateSurveyBodySchema = z.object({
  title: z
    .string('errors.common.required')
    .trim()
    .min(1, 'errors.common.required')
    .max(200, 'errors.common.max'),
  subtitle: z.string().trim().max(500, 'errors.common.max').nullish(),
  description: z.string().trim().max(5000, 'errors.common.max').nullish(),
  pages: z.array(PageNodeSchema)
})

export type UpdateSurveyBody = z.infer<typeof UpdateSurveyBodySchema>
