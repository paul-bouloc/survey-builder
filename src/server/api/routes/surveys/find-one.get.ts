import { createEndpoint } from '@/server/api/create-endpoint'
import { NotFoundException } from '@/server/api/errors'
import { Survey } from '@/server/models'
import { SurveySchema } from '@/shared/api/contracts/surveys/surveys.schema'
import { shortIdPolicy } from '@/shared/validation/policies/short-id.policy'
import { z } from 'zod'

const FindOneSurveyQuerySchema = z.object({
  shortId: shortIdPolicy
})

export const findOneSurvey = createEndpoint(
  {
    requireAuth: true,
    query: FindOneSurveyQuerySchema,
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
