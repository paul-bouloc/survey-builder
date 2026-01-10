import type { ParsedUrlQuery } from 'querystring'

const DEFAULT_REDIRECT = '/'

function isSafeInternalPath(path: string) {
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes('://')) return false
  if (/[^\S\r\n]*[\r\n]/.test(path)) return false
  return true
}

export function getSafeRedirectFromQuery(
  query: ParsedUrlQuery,
  fallback: string = DEFAULT_REDIRECT
) {
  const raw = query.redirect
  const redirect = typeof raw === 'string' ? raw : fallback

  return isSafeInternalPath(redirect) ? redirect : fallback
}
