export const toTitleCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const toSentenceCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const toCamelCase = (str: string) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export const toUppercase = (str: string) => {
  return str.toUpperCase()
}

export const normalizeEmail = (v: string) => v.trim().toLowerCase()
