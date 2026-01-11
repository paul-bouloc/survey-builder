import { useSurveys } from '@/features/surveys/api/surveys.queries'
import { SurveysTabs } from '@/features/surveys/components/surveys-lists/surveys-tabs.component'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useState } from 'react'

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
  const tRoutes = useTranslations('routes')
  const tCommon = useTranslations('common')
  const tDescriptions = useTranslations('surveys.list.tabs.descriptions')
  const [activeTab, setActiveTab] = useState<'my-surveys' | 'responded'>(
    'my-surveys'
  )

  const { data: surveysData, isLoading, error } = useSurveys()

  const descriptions = {
    'my-surveys': tDescriptions('createdSurveys'),
    responded: tDescriptions('responded')
  }

  const textVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }

  const mySurveys = surveysData?.surveys ?? []
  const respondedSurveys: typeof mySurveys = []

  return (
    <>
      <Head>
        <title>{tRoutes('home')}</title>
      </Head>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">
                  {tCommon('loading')}...
                </p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-destructive text-sm">
                  {t('list.error.loadError')}
                </p>
              </div>
            ) : (
              <SurveysTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mySurveys={mySurveys}
                respondedSurveys={respondedSurveys}
                responses={mockResponses}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
