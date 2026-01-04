import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { MySurveysList } from './my-surveys-list.component'
import { RespondedSurveysList } from './responded-surveys-list.component'

interface SurveysTabsProps {
  mySurveys: Survey[]
  respondedSurveys: Survey[]
  responses: SurveyResponse[]
}

export function SurveysTabs({
  mySurveys,
  respondedSurveys,
  responses
}: SurveysTabsProps) {
  const [activeTab, setActiveTab] = useState<'my-surveys' | 'responded'>('my-surveys')

  const descriptions = {
    'my-surveys':
      'Manage and view all the surveys you have created. Track responses and edit your surveys.',
    'responded':
      'View all the surveys you have responded to. Continue incomplete responses or review completed ones.'
  }

  const textVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.p
          key={activeTab}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.15, ease: 'easeInOut' }}
          className="mb-6 text-sm text-muted-foreground"
        >
          {descriptions[activeTab]}
        </motion.p>
      </AnimatePresence>
      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as 'my-surveys' | 'responded')}
        className="w-full"
      >
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="my-surveys" className="flex-1">
            Created
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex-1">
            Responded
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my-surveys" className="mt-1.5">
          <MySurveysList surveys={mySurveys} />
        </TabsContent>
        <TabsContent value="responded" className="mt-1.5">
          <RespondedSurveysList surveys={respondedSurveys} responses={responses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

