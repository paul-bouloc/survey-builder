import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { useTranslations } from 'next-intl'
import { CreatedSurveysList } from './created-surveys-list.component'
import { RespondedSurveysList } from './responded-surveys-list.component'

interface SurveysTabsProps {
  activeTab: 'my-surveys' | 'responded'
  onTabChange: (value: 'my-surveys' | 'responded') => void
  mySurveys: Survey[]
  respondedSurveys: Survey[]
  responses: SurveyResponse[]
}

export function SurveysTabs({
  activeTab,
  onTabChange,
  mySurveys,
  respondedSurveys,
  responses
}: SurveysTabsProps) {
  const t = useTranslations('surveys.list.tabs')

  return (
    <Tabs
      value={activeTab}
      onValueChange={value => onTabChange(value as 'my-surveys' | 'responded')}
      className="w-full"
    >
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="my-surveys" className="flex-1">
          {t('created')}
        </TabsTrigger>
        <TabsTrigger value="responded" className="flex-1">
          {t('responded')}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-surveys" className="mt-1.5">
        <CreatedSurveysList surveys={mySurveys} />
      </TabsContent>
      <TabsContent value="responded" className="mt-1.5">
        <RespondedSurveysList
          surveys={respondedSurveys}
          responses={responses}
        />
      </TabsContent>
    </Tabs>
  )
}
