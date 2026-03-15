import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { Copy, Settings, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SurveyEditorNodeBlockActionsProps {
  isSelected: boolean
  onSettingsClick: () => void
  onDuplicateClick?: () => void
  onDeleteClick: (e: React.MouseEvent) => void
}

export function SurveyEditorNodeBlockActions({
  isSelected,
  onSettingsClick,
  onDuplicateClick,
  onDeleteClick
}: SurveyEditorNodeBlockActionsProps) {
  const t = useTranslations('surveys.edit.common')
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={t('settings')}
        className="text-muted-foreground hover:text-foreground absolute top-1 right-1"
        onClick={onSettingsClick}
        disabled={isSelected}
      >
        <Settings strokeWidth={1.5} />
      </Button>
    )
  }

  return (
    <div className="bg-card absolute -top-3 right-0 rounded-lg opacity-0 transition-all group-hover/node:right-3 group-hover/node:opacity-100">
      <ButtonGroup aria-label={t('actions')}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label={t('settings')}
              onClick={onSettingsClick}
              disabled={isSelected}
            >
              <Settings strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('settings')}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              aria-label={t('duplicate')}
              onClick={onDuplicateClick}
            >
              <Copy strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('duplicate')}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={onDeleteClick}
              aria-label={t('delete')}
              className="hover:text-destructive"
            >
              <Trash2 strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('delete')}</p>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
    </div>
  )
}
