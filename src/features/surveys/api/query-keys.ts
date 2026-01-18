export const surveysQueryKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveysQueryKeys.all, 'list'] as const,
  list: () => [...surveysQueryKeys.lists()] as const,
  detail: (shortId: string) =>
    [...surveysQueryKeys.all, 'detail', shortId] as const,
  overview: (shortId: string) =>
    [...surveysQueryKeys.all, 'overview', shortId] as const
} as const
