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
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        return {
          value: formatter.relativeTime(dateObj, {
            unit: 'minute',
            style: 'long'
          }),
          isRelative: true
        }
      }
      return {
        value: formatter.relativeTime(dateObj, { unit: 'hour', style: 'long' }),
        isRelative: true
      }
    }
    return {
      value: formatter.relativeTime(dateObj, { unit: 'day', style: 'long' }),
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
