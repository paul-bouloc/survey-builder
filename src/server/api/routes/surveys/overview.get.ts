import { createEndpoint } from '@/server/api/create-endpoint'
import { ForbiddenException, NotFoundException } from '@/server/api/errors'
import { Survey } from '@/server/models'
import { SurveyOverviewResponseSchema } from '@/shared/api/contracts/surveys/surveys.overview.schema'
import { z } from 'zod'

const GetSurveyOverviewQuerySchema = z.object({
  shortId: z.string().length(6, 'ShortId must be exactly 6 characters')
})

export const getSurveyOverview = createEndpoint(
  {
    requireAuth: true,
    query: GetSurveyOverviewQuerySchema,
    response: SurveyOverviewResponseSchema
  },
  async ({ query, user }) => {
    const survey = await Survey.findOne({
      shortId: query.shortId
    }).lean()

    if (!survey) {
      throw new NotFoundException('Survey not found')
    }

    // Vérifier que l'utilisateur est le créateur
    if (survey.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenException(
        'Only the creator can access survey overview'
      )
    }

    // Calculer les statistiques
    // Pour l'instant, on utilise responseCount comme nombre total de réponses
    // Quand le modèle de réponses sera créé, on pourra calculer :
    // - completedCount: nombre de réponses avec status='completed'
    // - inProgressCount: nombre de réponses avec status='in_progress'
    const totalResponses = survey.responseCount
    // TODO: Remplacer par une vraie requête quand le modèle de réponses sera disponible
    const completedCount = 99 // Mock - À implémenter quand le modèle de réponses sera disponible
    const inProgressCount = 99 // Mock - À implémenter quand le modèle de réponses sera disponible
    const completionRate =
      totalResponses > 0
        ? Math.round((completedCount / totalResponses) * 100)
        : 99 // Mock

    // Générer les données mockées pour les 7 derniers jours
    const weeklyData = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      weeklyData.push({
        date: date.toISOString().split('T')[0], // Format YYYY-MM-DD
        count: 99 // Mock - À implémenter quand le modèle de réponses sera disponible
      })
    }

    // Compter les pages et questions
    const pageCount = survey.pages?.length || 0

    // TODO: Compter les questions
    const questionCount = 99

    return {
      _id: survey._id.toString(),
      shortId: survey.shortId,
      title: survey.title,
      subtitle: survey.subtitle ?? null,
      description: survey.description ?? null,
      status: survey.status,
      publishedAt: survey.publishedAt ?? null,
      archivedAt: survey.archivedAt ?? null,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      stats: {
        totalResponses,
        completedCount,
        inProgressCount,
        completionRate
      },
      weeklyData: {
        data: weeklyData
      },
      pageCount,
      questionCount
    }
  }
)
