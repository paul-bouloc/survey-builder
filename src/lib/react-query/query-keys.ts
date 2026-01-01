import { authQueryKeys } from '@/features/auth/api/query-keys'

export const queryKeys = {
  auth: authQueryKeys
} as const

export type QueryKey = typeof queryKeys
