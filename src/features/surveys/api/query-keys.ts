export const surveysQueryKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveysQueryKeys.all, 'list'] as const,
  list: () => [...surveysQueryKeys.lists()] as const
} as const
