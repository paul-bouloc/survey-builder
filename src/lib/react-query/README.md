# Gestion centralisée des Query Keys React Query

Ce système permet de gérer proprement les query keys de React Query, avec chaque feature définissant ses propres query keys.

## Structure

### Query Keys par feature

Chaque feature définit ses query keys dans son propre fichier :

**`src/features/auth/api/query-keys.ts`** :
```typescript
export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const
} as const
```

**`src/lib/react-query/query-keys.ts`** :
Agrège toutes les query keys de chaque feature :

```typescript
import { authQueryKeys } from '@/features/auth/api/query-keys'

export const queryKeys = {
  auth: authQueryKeys
  // surveys: surveyQueryKeys (depuis '@/features/surveys/api/query-keys')
} as const
```

**Avantages :**
- ✅ Décentralisé : chaque feature gère ses propres query keys
- ✅ Type-safe : TypeScript vérifie les types
- ✅ Hiérarchique : structure claire par feature
- ✅ Facile à invalider : `authQueryKeys.all` invalide toutes les queries auth
- ✅ Maintenable : les query keys sont proches du code qui les utilise

### `query-invalidation.ts`

Hook pour invalider les queries de manière centralisée :

```typescript
const { invalidateSession, refetchSession } = useQueryInvalidation()

// Invalider la session (déclenche un refetch)
await invalidateSession()

// Refetch immédiatement la session
await refetchSession()
```

## Utilisation

### 1. Créer le fichier de query keys dans votre feature

**`src/features/maFeature/api/query-keys.ts`** :
```typescript
export const maFeatureQueryKeys = {
  all: ['maFeature'] as const,
  list: (filters?: Filters) => [...maFeatureQueryKeys.all, 'list', filters] as const,
  detail: (id: string) => [...maFeatureQueryKeys.all, 'detail', id] as const,
} as const
```

### 2. Ajouter les query keys dans `src/lib/react-query/query-keys.ts`

```typescript
import { maFeatureQueryKeys } from '@/features/maFeature/api/query-keys'

export const queryKeys = {
  auth: authQueryKeys,
  maFeature: maFeatureQueryKeys
} as const
```

### 3. Utiliser dans les queries

```typescript
import { maFeatureQueryKeys } from './query-keys'

export function useMaListe(filters?: Filters) {
  return useQuery({
    queryKey: maFeatureQueryKeys.list(filters),
    queryFn: () => maClient.getList(filters)
  })
}
```

### 4. Utiliser dans les mutations pour invalider

```typescript
import { useQueryInvalidation } from '@/lib/react-query/query-invalidation'

export function useCreateItem() {
  const { invalidateMaFeature } = useQueryInvalidation()

  return useMutation({
    mutationFn: (data: CreateData) => maClient.create(data),
    onSuccess: () => {
      // Invalider toutes les queries de maFeature
      invalidateMaFeature()
    }
  })
}
```

### 5. Ajouter une méthode d'invalidation dans `query-invalidation.ts`

```typescript
import { maFeatureQueryKeys } from '@/features/maFeature/api/query-keys'

export function useQueryInvalidation() {
  const queryClient = useQueryClient()

  return {
    // ... méthodes existantes

    invalidateMaFeature: () => {
      return queryClient.invalidateQueries({
        queryKey: maFeatureQueryKeys.all
      })
    }
  }
}
```

## Exemple complet : Feature Auth

### Query Keys (`src/features/auth/api/query-keys.ts`)

```typescript
export const authQueryKeys = {
  all: ['auth'] as const,
  session: () => [...authQueryKeys.all, 'session'] as const
} as const
```

### Query

```typescript
import { authQueryKeys } from './query-keys'

export function useSession() {
  return useQuery({
    queryKey: authQueryKeys.session(),
    queryFn: () => authClient.getSession()
  })
}
```

### Mutation avec invalidation

```typescript
import { useQueryInvalidation } from '@/lib/react-query/query-invalidation'

export function useAuth() {
  const { refetchSession } = useQueryInvalidation()

  return useMutation({
    mutationFn: (payload) => authClient.auth(payload),
    onSuccess: async () => {
      // Refetch la session après connexion
      await refetchSession()
    }
  })
}
```

## Bonnes pratiques

1. **Toujours utiliser les query keys centralisées** : Ne pas créer de query keys en dur dans les composants
2. **Invalider après les mutations** : Utiliser `onSuccess` dans les mutations pour invalider les queries concernées
3. **Structure hiérarchique** : Utiliser `all` pour invalider toutes les queries d'une feature
4. **Type-safe** : Utiliser `as const` pour préserver les types TypeScript

