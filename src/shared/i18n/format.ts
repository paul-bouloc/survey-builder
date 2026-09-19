import type { useFormatter } from 'next-intl'

type Formatter = ReturnType<typeof useFormatter>

/**
 * Format a date using next-intl formatter
 * Returns relative format if date is less than 1 week old, otherwise medium format
 * @returns Object with formatted date and whether it's relative or abs
 */
export function formatDate(
  date: Date | string | number,
  formatter: Formatter
): { value: string; isRelative: boolean } {
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const oneWeekInDays = 7

  if (diffInDays < oneWeekInDays && diffInDays >= 0) {
    // Use relative time for dates less than 1 week old
    // `now` est explicite partout : sans lui, next-intl utilise le `now` du
    // provider, figé au montage de l'app (`_app.tsx`), et le libellé relatif
    // ne se met plus à jour tant qu'on ne recharge pas la page.
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        return {
          value: formatter.relativeTime(dateObj, {
            now,
            unit: 'minute',
            style: 'long'
          }),
          isRelative: true
        }
      }
      return {
        value: formatter.relativeTime(dateObj, {
          now,
          unit: 'hour',
          style: 'long'
        }),
        isRelative: true
      }
    }
    return {
      value: formatter.relativeTime(dateObj, {
        now,
        unit: 'day',
        style: 'long'
      }),
      isRelative: true
    }
  }

  // Use medium date format for older dates
  return {
    value: formatter.dateTime(dateObj, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    isRelative: false
  }
}

/**
 * Date d'un enregistrement, à la granularité utile pour un autosave.
 *
 * Contrairement à `formatDate`, on ne reste pas en relatif au-delà de l'heure :
 * passé ce délai « il y a 3 heures » renseigne moins que l'heure exacte.
 *
 * moins d'une minute → « à l'instant »
 * moins d'une heure  → « il y a 3 minutes »
 * même journée       → « à 14:02 »
 * même année civile  → « le 18 sept. »
 * au-delà            → « le 5 sept. 2025 »
 */
export function formatSavedAt(
  date: Date | string | number,
  formatter: Formatter
): { value: string; kind: 'now' | 'relative' | 'time' | 'date' } {
  const dateObj =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date

  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const oneMinuteInMs = 60 * 1000
  const oneHourInMs = 60 * oneMinuteInMs

  // Une horloge client en avance sur le serveur donnerait un diff négatif,
  // et « dans 2 minutes » pour une sauvegarde qui vient d'aboutir.
  if (diffInMs < oneMinuteInMs) {
    return { value: '', kind: 'now' }
  }

  if (diffInMs < oneHourInMs) {
    return {
      value: formatter.relativeTime(dateObj, {
        // `now` est explicite : sans lui, next-intl retombe sur le `now` du
        // provider, figé au montage de l'app (`_app.tsx`). Une sauvegarde
        // postérieure au chargement se retrouverait alors dans le futur
        // (« dans 0 minute »), et le libellé ne bougerait plus jamais.
        now,
        unit: 'minute',
        style: 'long'
      }),
      kind: 'relative'
    }
  }

  const isSameDay = dateObj.toDateString() === now.toDateString()

  if (isSameDay) {
    return {
      value: formatter.dateTime(dateObj, {
        hour: '2-digit',
        minute: '2-digit'
      }),
      kind: 'time'
    }
  }

  // Année civile plutôt que delta de 12 mois : une sauvegarde de décembre lue en
  // janvier doit porter son année, même si elle a moins d'un an.
  const isSameYear = dateObj.getFullYear() === now.getFullYear()

  return {
    value: formatter.dateTime(dateObj, {
      year: isSameYear ? undefined : 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    kind: 'date'
  }
}
