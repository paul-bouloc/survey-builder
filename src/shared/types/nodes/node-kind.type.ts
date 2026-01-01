export const NodeKind = {
  PAGE: 'page',
  GROUP: 'group',
  QUESTION: 'question',
  INFO: 'info',
  DIVIDER: 'divider'
} as const

export type NodeKind = (typeof NodeKind)[keyof typeof NodeKind]
