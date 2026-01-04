import { NodeId } from '@/shared/types/brands.type'
import { ActionType } from '@/shared/types/surveys/action.type'

export interface IBaseActionSubdoc {
  type: ActionType
}

export interface IFlagActionSubdoc extends IBaseActionSubdoc {
  type: typeof ActionType.FLAG
  path: string
  value: unknown
}

export interface IUnflagActionSubdoc extends IBaseActionSubdoc {
  type: typeof ActionType.UNFLAG
  path: string
}

export interface IGotoActionSubdoc extends IBaseActionSubdoc {
  type: typeof ActionType.GOTO
  target: 'NEXT' | 'PREVIOUS' | 'END' | 'NODE'
  nodeId?: NodeId
}

export interface IToastActionSubdoc extends IBaseActionSubdoc {
  type: typeof ActionType.TOAST
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
  durationMs?: number
}

export interface IConfirmActionSubdoc extends IBaseActionSubdoc {
  type: typeof ActionType.CONFIRM
  title: string
  message: string
  onCancel: 'stop' | 'noop'
}

export type ActionSubdoc =
  | IFlagActionSubdoc
  | IUnflagActionSubdoc
  | IGotoActionSubdoc
  | IToastActionSubdoc
  | IConfirmActionSubdoc
