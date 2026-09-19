import { useEffect, useRef, useState } from 'react'

/**
 * Retarde la valeur affichée pour qu'aucune ne reste moins de `minDurationMs`.
 *
 * Sert à empêcher le clignotement quand une valeur transite trop vite pour être
 * lue — typiquement un statut « en cours » entre deux états stables. Les
 * changements sont mis en file : aucun n'est perdu, chacun attend son tour.
 */
export function useMinDurationValue<T>(value: T, minDurationMs: number): T {
  const [displayedValue, setDisplayedValue] = useState(value)
  // `Date.now()` est impur : il n'est lu que dans les effets, jamais au rendu.
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (shownAtRef.current === null) {
      shownAtRef.current = Date.now()
    }
  }, [])

  useEffect(() => {
    if (value === displayedValue) return

    const shownAt = shownAtRef.current ?? Date.now()
    const remaining = minDurationMs - (Date.now() - shownAt)

    const apply = () => {
      shownAtRef.current = Date.now()
      setDisplayedValue(value)
    }

    // La valeur courante n'a pas encore fait son temps : on la laisse finir.
    // `value` étant dans les dépendances, un changement pendant l'attente
    // reprogramme le timer sur la plus récente.
    const timer = setTimeout(apply, Math.max(remaining, 0))

    return () => clearTimeout(timer)
  }, [value, displayedValue, minDurationMs])

  return displayedValue
}
