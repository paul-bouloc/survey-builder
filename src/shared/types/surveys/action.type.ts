import { NodeId } from '@/shared/types/brands.type'

export const ActionType = {
  FLAG: 'flag',
  UNFLAG: 'unflag',
  GOTO: 'goto',
  TOAST: 'toast',
  CONFIRM: 'confirm'
} as const

export type ActionType = (typeof ActionType)[keyof typeof ActionType]

export type Action =
  | FlagAction
  | UnflagAction
  | GotoAction
  | ToastAction
  | ConfirmAction

export interface BaseAction {
  type: ActionType
}

export interface FlagAction extends BaseAction {
  type: typeof ActionType.FLAG
  path: string
  value: unknown
}

export interface UnflagAction extends BaseAction {
  type: typeof ActionType.UNFLAG
  path: string
}

export interface GotoAction extends BaseAction {
  type: typeof ActionType.GOTO
  target: 'NEXT' | 'PREVIOUS' | 'END' | 'NODE'
  nodeId?: NodeId
}

export interface ToastAction extends BaseAction {
  type: typeof ActionType.TOAST
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
  durationMs?: number
}

export interface ConfirmAction extends BaseAction {
  type: typeof ActionType.CONFIRM
  title: string
  message: string
  onCancel: 'stop' | 'noop'
}
