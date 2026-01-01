# Système d'authentification

Ce système d'authentification utilise JWT (JSON Web Tokens) stockés dans des cookies HTTP-only pour sécuriser l'application.

## Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
JWT_SECRET=votre-secret-jwt-tres-securise-changez-en-production
JWT_EXPIRES_IN=7d
```

- `JWT_SECRET` : Secret utilisé pour signer les tokens JWT (obligatoire en production)
- `JWT_EXPIRES_IN` : Durée de validité du token (défaut: 7 jours)

## Fonctionnement

### 1. Connexion/Inscription

L'utilisateur entre son email sur la page `/auth/login`. Deux cas possibles :

- **Utilisateur existant** : Il est connecté automatiquement (cookie JWT créé)
- **Nouvel utilisateur** : On lui demande son nom, puis il est inscrit et connecté

### 2. Vérification de session

Chaque requête API peut vérifier l'authentification en utilisant le middleware `requireAuth` :

```typescript
import { createEndpoint } from '@/server/api/create-endpoint'
import { requireAuth } from '@/server/auth/middleware'
import type { AuthenticatedRequest } from '@/server/auth/middleware'

export const getProtectedData = createEndpoint(
  {
    requireAuth: true, // Active la vérification du token
    response: SomeResponseSchema
  },
  async ({ req }) => {
    const authenticatedReq = req as AuthenticatedRequest
    // authenticatedReq.user contient { userId, email }
    // ...
  }
)
```

### 3. Protection des routes côté client

Utilisez le composant `ProtectedRoute` pour protéger une page :

```typescript
import { ProtectedRoute } from '@/features/auth/components/protected-route.component'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Contenu protégé</div>
    </ProtectedRoute>
  )
}
```

## API Endpoints

### POST `/api/auth/login`

Authentifie un utilisateur ou crée un compte.

**Body (vérification email)** :
```json
{
  "email": "user@example.com"
}
```

**Body (inscription)** :
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response** :
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "isNewUser": false,
  "needsRegistration": false
}
```

### GET `/api/auth/session`

Récupère la session de l'utilisateur connecté.

**Response** :
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Hooks React

### `useAuth()`

Mutation pour authentifier un utilisateur :

```typescript
import { useAuth } from '@/features/auth/api/auth.mutations'

function MyComponent() {
  const auth = useAuth()

  const handleLogin = async () => {
    const result = await auth.mutateAsync({ email: 'user@example.com' })
    // ...
  }
}
```

### `useSession()`

Query pour récupérer la session de l'utilisateur :

```typescript
import { useSession } from '@/features/auth/api/auth.mutations'

function MyComponent() {
  const { data: session, isLoading } = useSession()

  if (isLoading) return <div>Chargement...</div>
  if (!session) return <div>Non connecté</div>

  return <div>Bonjour {session.name}!</div>
}
```

## Sécurité

- Les tokens JWT sont stockés dans des cookies HTTP-only (non accessibles depuis JavaScript)
- Les cookies sont sécurisés en production (flag `Secure`)
- Les cookies utilisent `SameSite=Lax` pour protéger contre les attaques CSRF
- Le secret JWT doit être fort et unique en production


