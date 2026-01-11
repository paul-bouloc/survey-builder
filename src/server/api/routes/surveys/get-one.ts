import { createEndpoint } from '@/server/api/create-endpoint'
import { NotFoundException } from '@/server/api/errors'
import { Survey } from '@/server/models'
import { SurveySchema } from '@/shared/api/contracts/surveys.contract'
import { z } from 'zod'

const GetSurveyQuerySchema = z.object({
  shortId: z.string().length(6, 'ShortId must be exactly 6 characters')
})

export const getSurvey = createEndpoint(
  {
    requireAuth: true,
    query: GetSurveyQuerySchema,
    response: SurveySchema
  },
  async ({ query }) => {
    const survey = await Survey.findOne({
      shortId: query.shortId
    }).lean()

    if (!survey) {
      throw new NotFoundException('Survey not found')
    }

    return {
      _id: survey._id.toString(),
      shortId: survey.shortId,
      createdBy: survey.createdBy.toString(),
      title: survey.title,
      subtitle: survey.subtitle ?? null,
      description: survey.description ?? null,
      status: survey.status,
      pages: survey.pages,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      publishedAt: survey.publishedAt ?? null,
      archivedAt: survey.archivedAt ?? null,
      responseCount: survey.responseCount
    }
  }
)
