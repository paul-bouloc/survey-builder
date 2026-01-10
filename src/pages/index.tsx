import { SurveysTabs } from '@/features/surveys/components/surveys-lists/surveys-tabs.component'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

// Données mockées pour le développement
// TODO: Remplacer par des appels API réels
const mockMySurveys: Survey[] = [
  // {
  //   _id: '507f1f77bcf86cd799439011' as any,
  //   shortId: 'abc123' as any,
  //   createdBy: '507f1f77bcf86cd799439012' as any,
  //   title: 'Satisfaction client 2024',
  //   subtitle: 'Enquête trimestrielle',
  //   description:
  //     'Cette enquête nous permet de mieux comprendre les besoins de nos clients et d\'améliorer nos services.',
  //   status: SurveyStatus.PUBLISHED,
  //   pages: [
  //     {
  //       id: '507f1f77bcf86cd799439013' as any,
  //       kind: NodeKind.PAGE,
  //       order: 0,
  //       title: null,
  //       subtitle: null,
  //       description: null,
  //       code: null,
  //       condition: null,
  //       triggers: [],
  //       children: [],
  //       page: {
  //         skippable: false
  //       }
  //     }
  //   ],
  //   createdAt: new Date('2024-01-15'),
  //   updatedAt: new Date('2024-01-20'),
  //   publishedAt: new Date('2024-01-20'),
  //   archivedAt: null,
  //   responseCount: 42
  // },
  // {
  //   _id: '507f1f77bcf86cd799439014' as any,
  //   shortId: 'def456' as any,
  //   createdBy: '507f1f77bcf86cd799439012' as any,
  //   title: 'Enquête sur les habitudes alimentaires',
  //   description: 'Aidez-nous à comprendre vos préférences alimentaires.',
  //   status: SurveyStatus.DRAFT,
  //   pages: [
  //     {
  //       id: '507f1f77bcf86cd799439015' as any,
  //       kind: NodeKind.PAGE,
  //       order: 0,
  //       title: null,
  //       subtitle: null,
  //       description: null,
  //       code: null,
  //       condition: null,
  //       triggers: [],
  //       children: [],
  //       page: {
  //         skippable: false
  //       }
  //     }
  //   ],
  //   createdAt: new Date('2024-02-01'),
  //   updatedAt: new Date('2024-02-05'),
  //   publishedAt: null,
  //   archivedAt: null,
  //   responseCount: 0
  // },
  // {
  //   _id: '507f1f77bcf86cd799439016' as any,
  //   shortId: 'ghi789' as any,
  //   createdBy: '507f1f77bcf86cd799439012' as any,
  //   title: 'Enquête bien-être au travail',
  //   subtitle: 'Édition 2024',
  //   status: SurveyStatus.ARCHIVED,
  //   pages: [
  //     {
  //       id: '507f1f77bcf86cd799439017' as any,
  //       kind: NodeKind.PAGE,
  //       order: 0,
  //       title: null,
  //       subtitle: null,
  //       description: null,
  //       code: null,
  //       condition: null,
  //       triggers: [],
  //       children: [],
  //       page: {
  //         skippable: false
  //       }
  //     }
  //   ],
  //   createdAt: new Date('2023-12-01'),
  //   updatedAt: new Date('2023-12-31'),
  //   publishedAt: new Date('2023-12-05'),
  //   archivedAt: new Date('2023-12-31'),
  //   responseCount: 156
  // }
]

const mockRespondedSurveys: Survey[] = [
  // {
  //   _id: '507f1f77bcf86cd799439018' as any,
  //   shortId: 'jkl012' as any,
  //   createdBy: '507f1f77bcf86cd799439019' as any,
  //   title: 'Enquête de satisfaction produit',
  //   subtitle: 'Version 2.0',
  //   description: 'Votre avis compte ! Partagez votre expérience avec notre produit.',
  //   status: SurveyStatus.PUBLISHED,
  //   pages: [
  //     {
  //       id: '507f1f77bcf86cd799439020' as any,
  //       kind: NodeKind.PAGE,
  //       order: 0,
  //       title: null,
  //       subtitle: null,
  //       description: null,
  //       code: null,
  //       condition: null,
  //       triggers: [],
  //       children: [],
  //       page: {
  //         skippable: false
  //       }
  //     }
  //   ],
  //   createdAt: new Date('2024-01-10'),
  //   updatedAt: new Date('2024-01-15'),
  //   publishedAt: new Date('2024-01-15'),
  //   archivedAt: null,
  //   responseCount: 89
  // },
  // {
  //   _id: '507f1f77bcf86cd799439021' as any,
  //   shortId: 'mno345' as any,
  //   createdBy: '507f1f77bcf86cd799439022' as any,
  //   title: 'Sondage sur les transports',
  //   description: 'Aidez-nous à améliorer les transports en commun.',
  //   status: SurveyStatus.PUBLISHED,
  //   pages: [
  //     {
  //       id: '507f1f77bcf86cd799439023' as any,
  //       kind: NodeKind.PAGE,
  //       order: 0,
  //       title: null,
  //       subtitle: null,
  //       description: null,
  //       code: null,
  //       condition: null,
  //       triggers: [],
  //       children: [],
  //       page: {
  //         skippable: false
  //       }
  //     }
  //   ],
  //   createdAt: new Date('2024-02-10'),
  //   updatedAt: new Date('2024-02-12'),
  //   publishedAt: new Date('2024-02-12'),
  //   archivedAt: null,
  //   responseCount: 234
  // }
]

const mockResponses: SurveyResponse[] = [
  {
    _id: '507f1f77bcf86cd799439024' as any,
    surveyId: '507f1f77bcf86cd799439018' as any,
    surveyShortId: 'jkl012' as any,
    respondentUserId: '507f1f77bcf86cd799439012' as any,
    status: 'completed',
    currentPageId: '507f1f77bcf86cd799439020' as any,
    answers: {},
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    completedAt: new Date('2026-01-06:23:00')
  },
  {
    _id: '507f1f77bcf86cd799439025' as any,
    surveyId: '507f1f77bcf86cd799439021' as any,
    surveyShortId: 'mno345' as any,
    respondentUserId: '507f1f77bcf86cd799439012' as any,
    status: 'in_progress',
    currentPageId: '507f1f77bcf86cd799439023' as any,
    answers: {},
    createdAt: new Date('2024-02-13'),
    updatedAt: new Date('2024-02-14'),
    completedAt: null
  }
]

export default function HomePage() {
  const t = useTranslations('surveys')
  const tDescriptions = useTranslations('surveys.list.tabs.descriptions')
  const [activeTab, setActiveTab] = useState<'my-surveys' | 'responded'>(
    'my-surveys'
  )

  const descriptions = {
    'my-surveys': tDescriptions('createdSurveys'),
    responded: tDescriptions('responded')
  }

  const textVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">{t('title')}</h1>
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.15, ease: 'easeInOut' }}
              className="text-muted-foreground mb-6 text-sm"
            >
              {descriptions[activeTab]}
            </motion.p>
          </AnimatePresence>
          <SurveysTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            mySurveys={mockMySurveys}
            respondedSurveys={mockRespondedSurveys}
            responses={mockResponses}
          />
        </div>
      </div>
    </div>
  )
}
