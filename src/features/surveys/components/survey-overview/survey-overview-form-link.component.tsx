import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/components/ui/input-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys/surveys.overview.schema'
import { Copy, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { toast } from 'sonner'

interface SurveyOverviewFormLinkProps {
  survey: SurveyOverviewResponse
}

export function SurveyOverviewFormLink({
  survey
}: SurveyOverviewFormLinkProps) {
  const tFormLink = useTranslations('surveys.overview.formLink')

  const formUrl = useMemo(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '')
    return `${baseUrl}/r/${survey.shortId}`
  }, [survey.shortId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formUrl)
      toast.success(tFormLink('copySuccess'))
    } catch (_error) {
      toast.error(tFormLink('copyError'))
    }
  }

  const handleOpen = () => {
    window.open(formUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tFormLink('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <InputGroup>
          <InputGroupInput
            type="text"
            value={formUrl}
            readOnly
            className="truncate"
          />
          <InputGroupAddon align="inline-end" className="gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  aria-label={tFormLink('copy')}
                  className="w-6! min-w-6!"
                >
                  <Copy />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>{tFormLink('copy')}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleOpen}
                  aria-label={tFormLink('open')}
                  className="w-6! min-w-6!"
                >
                  <ExternalLink />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>{tFormLink('open')}</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </CardContent>
    </Card>
  )
}
