import EdvardMunchIcon from '@/assets/illustrative-icons/edvard-munch.svg'
import PlushIcon from '@/assets/illustrative-icons/plush.svg'
import PottedPlantIcon from '@/assets/illustrative-icons/potted-plant.svg'
import SearchIcon from '@/assets/illustrative-icons/search.svg'

export const illustrativeIcons = {
  plush: PlushIcon,
  pottedPlant: PottedPlantIcon,
  search: SearchIcon,
  edvardMunch: EdvardMunchIcon
} as const

export type IllustrativeIconName = keyof typeof illustrativeIcons

export type StaticSvgImport = string | { src: string }

export function getSvgSrc(value: StaticSvgImport): string {
  return typeof value === 'string' ? value : value.src
}
