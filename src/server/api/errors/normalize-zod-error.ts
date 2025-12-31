import type { ZodError } from 'zod'

function pathToKey(path: (string | number)[]) {
  return path.map(String).join('.')
}

export function normalizeZodError(error: ZodError) {
  const messages = error.issues.map(i => i.message)

  const fieldErrors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = pathToKey(issue.path as (string | number)[])
    if (!key) continue
    fieldErrors[key] ??= []
    fieldErrors[key].push(issue.message)
  }

  const uniq = (arr: string[]) => Array.from(new Set(arr))

  return {
    messages: uniq(messages),
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).map(([k, v]) => [k, uniq(v)])
    )
  }
}
