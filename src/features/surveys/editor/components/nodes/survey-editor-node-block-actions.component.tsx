import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
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

  return (
    <div className="bg-card absolute right-3 rounded-lg transition-all group-hover/node:right-3 group-hover/node:opacity-100 md:-top-3 md:right-0 md:opacity-0">
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
              <Settings />
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
              <Copy />
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
              <Trash2 />
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
