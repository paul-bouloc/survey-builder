# Gestion des erreurs API

Ce document explique comment les erreurs sont gérées dans les endpoints API.

## Flux de gestion des erreurs

```
Endpoint Handler
    ↓
try/catch dans createEndpoint
    ↓
handleApiError()
    ↓
1. ZodError → validation_error (400)
2. HttpException → code personnalisé (status personnalisé)
3. MongooseError → conflict/bad_request (409/400)
4. Autre → internal_error (500)
```

## Types d'erreurs gérées

### 1. Erreurs de validation Zod

Quand la validation Zod échoue (body, query, response) :

```typescript
// Erreur retournée :
{
  error: {
    code: 'validation_error',
    message: 'Validation error',
    details: {
      messages: ['Email is required', 'Password too short'],
      fieldErrors: {
        email: ['Email is required'],
        password: ['Password too short']
      }
    }
  }
}
// Status: 400
```

### 2. Erreurs HTTP personnalisées (HttpException)

Quand vous lancez une exception personnalisée :

```typescript
throw new ConflictException('Email already in use')

// Erreur retournée :
{
  error: {
    code: 'conflict',
    message: 'Email already in use',
    details: undefined
  }
}
// Status: 409
```

**Exceptions disponibles :**
- `BadRequestException` (400, 'bad_request')
- `UnauthorizedException` (401, 'unauthorized')
- `ForbiddenException` (403, 'forbidden')
- `NotFoundException` (404, 'not_found')
- `ConflictException` (409, 'conflict')
- `HttpException` (personnalisable)

### 3. Erreurs Mongoose/MongoDB

#### Erreur de validation Mongoose

Quand une validation du schéma échoue :

```typescript
// Exemple : email invalide selon le schéma
await User.create({ email: 'invalid', firstName: 'John', ... })

// Erreur retournée :
{
  error: {
    code: 'bad_request',
    message: 'Validation error',
    details: {
      messages: ['Please provide a valid email address'],
      fieldErrors: {
        email: ['Please provide a valid email address']
      }
    }
  }
}
// Status: 400
```

#### Erreur de duplicate key (MongoDB)

Quand une contrainte unique est violée (ex: email déjà existant) :

```typescript
// Si deux requêtes créent le même email en même temps (race condition)
await User.create({ email: 'existing@example.com', ... })

// Erreur retournée :
{
  error: {
    code: 'conflict',
    message: 'Email "existing@example.com" already exists',
    details: {
      field: 'email',
      value: 'existing@example.com'
    }
  }
}
// Status: 409
```

#### Erreur de cast (type invalide)

Quand un type est incorrect (ex: ObjectId invalide) :

```typescript
await User.findById('invalid-id')

// Erreur retournée :
{
  error: {
    code: 'bad_request',
    message: 'Invalid ObjectId for field _id',
    details: {
      path: '_id',
      kind: 'ObjectId',
      value: 'invalid-id'
    }
  }
}
// Status: 400
```

### 4. Erreurs inattendues

Toute autre erreur non gérée :

```typescript
// Erreur retournée :
{
  error: {
    code: 'internal_error',
    message: 'Internal server error'
  }
}
// Status: 500
// L'erreur est loggée dans la console
```

## Exemples d'utilisation

### Dans un endpoint

```typescript
import { createEndpoint } from '@/server/api/create-endpoint'
import { ConflictException, NotFoundException } from '@/server/api/errors'
import { User } from '@/server/models'

export default createEndpoint(
  {
    method: 'POST',
    body: RegisterBodySchema,
    response: RegisterResponseSchema
  },
  async ({ body }) => {
    // Vérification manuelle avec exception personnalisée
    const existing = await User.findOne({ email: body.email })
    if (existing) {
      throw new ConflictException('Email already in use')
    }

    // Si une erreur Mongoose se produit (race condition, validation, etc.),
    // elle sera automatiquement transformée en erreur HTTP appropriée
    const user = await User.create({ ... })

    return { userId: user._id.toString(), email: user.email }
  }
)
```

### Gestion des erreurs Mongoose automatique

Vous n'avez pas besoin de gérer manuellement toutes les erreurs Mongoose. Le système les transforme automatiquement :

```typescript
// ✅ Pas besoin de try/catch pour les erreurs Mongoose
// Elles sont automatiquement transformées en erreurs HTTP

// Erreur de validation → BadRequestException (400)
// Erreur de duplicate key → ConflictException (409)
// Erreur de cast → BadRequestException (400)
// Autre erreur Mongoose → InternalError (500)
```

## Ordre de traitement

Le gestionnaire d'erreurs vérifie les erreurs dans cet ordre :

1. **ZodError** - Erreurs de validation Zod
2. **HttpException** - Exceptions personnalisées
3. **MongooseError** - Erreurs Mongoose/MongoDB
4. **Autre** - Erreurs inattendues

## Bonnes pratiques

1. **Utilisez les exceptions HTTP personnalisées** pour les erreurs métier :
   ```typescript
   throw new ConflictException('Email already in use')
   ```

2. **Laissez Mongoose gérer les validations** du schéma :
   ```typescript
   // Les erreurs de validation seront automatiquement transformées
   await User.create({ email: 'invalid' })
   ```

3. **Ne pas utiliser try/catch** pour les erreurs Mongoose standard :
   ```typescript
   // ❌ Pas nécessaire
   try {
     await User.create({ ... })
   } catch (error) {
     // handleApiError le fait déjà
   }

   // ✅ Laissez le système gérer
   await User.create({ ... })
   ```

4. **Utilisez try/catch** uniquement pour des cas spéciaux :
   ```typescript
   try {
     await complexOperation()
   } catch (error) {
     // Transformation personnalisée si nécessaire
     throw new BadRequestException('Custom message', { details: error })
   }
   ```

