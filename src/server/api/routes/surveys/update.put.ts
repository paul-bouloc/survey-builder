import { createEndpoint } from '@/server/api/create-endpoint'
import { ForbiddenException, NotFoundException } from '@/server/api/errors'
import { Survey } from '@/server/models'
import {
  SurveySchema,
  UpdateSurveyBodySchema
} from '@/shared/api/contracts/surveys/surveys.contract'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { shortIdPolicy } from '@/shared/validation/policies/short-id.policy'
import { z } from 'zod'

const UpdateSurveyQuerySchema = z.object({
  shortId: shortIdPolicy
})

export const updateSurvey = createEndpoint(
  {
    requireAuth: true,
    query: UpdateSurveyQuerySchema,
    body: UpdateSurveyBodySchema,
    response: SurveySchema
  },
  async ({ query, body, user }) => {
    const survey = await Survey.findOne({ shortId: query.shortId })

    if (!survey) {
      throw new NotFoundException('Survey not found')
    }
    if (survey.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException('Only the creator can update this survey')
    }

    if (survey.status !== SurveyStatus.DRAFT) {
      throw new ForbiddenException('Only a draft survey can be updated')
    }

    survey.set({
      title: body.title,
      subtitle: body.subtitle ?? undefined,
      description: body.description ?? undefined,
      pages: body.pages
    })

    await survey.save()

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
