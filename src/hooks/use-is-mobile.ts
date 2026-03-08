import { useMediaQuery } from './use-media-query'

/** Breakpoint Tailwind `md` (768px) : en dessous = mobile. */
const MOBILE_BREAKPOINT = '(max-width: 768px)'

/**
 * Hook qui indique si la vue est en mode mobile (< 768px).
 * Utile pour adapter l’UI (ex. panneau en Card vs modale Dialog).
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_BREAKPOINT)
}
