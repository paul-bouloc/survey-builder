import { useEffect, useState } from 'react'

/**
 * Hook qui écoute une media query et renvoie si elle est vérifiée.
 * Sur le serveur (SSR) et au premier rendu client, renvoie `defaultMatch`
 * pour limiter les écarts d’hydratation.
 */
export function useMediaQuery(query: string, defaultMatch = false): boolean {
  const [matches, setMatches] = useState(defaultMatch)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    queueMicrotask(() => setMatches(mediaQuery.matches))
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
