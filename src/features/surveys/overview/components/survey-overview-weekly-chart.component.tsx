'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys/surveys.overview.schema'
import { useFormatter, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

interface SurveyOverviewWeeklyChartProps {
  weeklyData: SurveyOverviewResponse['weeklyData']
}

export function SurveyOverviewWeeklyChart({
  weeklyData
}: SurveyOverviewWeeklyChartProps) {
  const tOverview = useTranslations('surveys.overview.chart')
  const formatter = useFormatter()

  const chartConfig = {
    count: {
      label: tOverview('label'),
      color: 'var(--chart-1)'
    }
  } satisfies ChartConfig

  // Formater les dates pour l'affichage
  const formattedData = weeklyData.data.map(item => {
    const date = new Date(item.date)
    return {
      date: formatter.dateTime(date, {
        day: 'numeric',
        month: 'short'
      }),
      count: item.count
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tOverview('title')}</CardTitle>
        <CardDescription>{tOverview('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
              top: 4,
              bottom: 4
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="count"
              type="natural"
              fill="var(--color-count)"
              fillOpacity={0.4}
              stroke="var(--color-count)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
