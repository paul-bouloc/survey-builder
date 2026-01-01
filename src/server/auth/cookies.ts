import type { NextApiResponse } from 'next'

const COOKIE_NAME = 'auth-token'
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Sets the authentication cookie with the JWT token
 */
export function setAuthCookie(res: NextApiResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production'
  const secureFlag = isProduction ? '; Secure' : ''

  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secureFlag}`
  ])
}

/**
 * Clears the authentication cookie
 */
export function clearAuthCookie(res: NextApiResponse): void {
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`
  ])
}
