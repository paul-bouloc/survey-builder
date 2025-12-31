# Modèles Mongoose

Ce dossier contient les modèles Mongoose pour la base de données.

## Structure

- `User.model.ts` - Modèle utilisateur avec authentification
- `index.ts` - Export centralisé des modèles

## Utilisation

### Connexion à la base de données

Avant d'utiliser les modèles, assurez-vous de vous connecter à la base de données :

```typescript
import connectDB from '@/server/database/mongoose'

// Dans votre API route
await connectDB()
```

### Utiliser le modèle User

```typescript
import { User } from '@/server/models'
import connectDB from '@/server/database/mongoose'

// Dans votre API route
await connectDB()

// Créer un utilisateur
const user = await User.create({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'SecurePassword123!',
  acceptTerms: true
})

// Trouver un utilisateur
const user = await User.findOne({ email: 'user@example.com' })

// Vérifier le mot de passe
const isValid = await user.comparePassword('password123')

// Mettre à jour un utilisateur
await User.findByIdAndUpdate(userId, { emailVerified: true })
```

## Schéma User

Le modèle User contient les champs suivants :

- `email` (string, unique, required) - Email de l'utilisateur (normalisé en minuscules)
- `firstName` (string, required) - Prénom (2-50 caractères)
- `lastName` (string, required) - Nom (2-50 caractères)
- `password` (string, required) - Mot de passe hashé (10-128 caractères)
- `emailVerified` (boolean, default: false) - Statut de vérification de l'email
- `acceptTerms` (boolean, required) - Acceptation des conditions
- `createdAt` (Date) - Date de création (automatique)
- `updatedAt` (Date) - Date de mise à jour (automatique)

### Sécurité

- Le mot de passe est automatiquement hashé avec bcrypt avant la sauvegarde
- Le champ `password` n'est pas inclus par défaut dans les requêtes (`select: false`)
- Utilisez `select('+password')` si vous avez besoin du champ password pour la comparaison

### Méthodes

- `comparePassword(candidatePassword: string)` - Compare un mot de passe en clair avec le hash stocké

## Ajouter un nouveau modèle

1. Créez un nouveau fichier `[ModelName].model.ts` dans ce dossier
2. Définissez l'interface TypeScript `I[ModelName]`
3. Créez le schéma Mongoose
4. Exportez le modèle
5. Ajoutez l'export dans `index.ts`

