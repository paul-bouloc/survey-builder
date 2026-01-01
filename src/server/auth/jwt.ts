import jwt from 'jsonwebtoken'

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as string

export interface JWTPayload {
  userId: string
  email: string
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as string & number
  })
}

/**
 * Vérifie et décode un token JWT
 * @throws {Error} Si le token est invalide ou expiré
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired')
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token')
    }
    throw error
  }
}

/**
 * Extrait le token depuis les cookies de la requête
 */
export function getTokenFromRequest(
  cookies: Record<string, string | undefined>
): string | null {
  return cookies['auth-token'] || null
}
