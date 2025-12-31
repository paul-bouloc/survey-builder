# Guide Mongoose - Comprendre les fonctionnalités automatiques

## Qu'est-ce que Mongoose ?

Mongoose est un ORM (Object-Relational Mapping) pour MongoDB. Il ajoute une couche d'abstraction qui transforme vos documents MongoDB en objets JavaScript typés avec des fonctionnalités automatiques.

## Fonctionnalités automatiques de Mongoose

### 1. Le champ `_id` (ObjectId)

**Automatique** : Mongoose ajoute automatiquement un champ `_id` de type `ObjectId` à chaque document.

```typescript
// Vous n'avez pas besoin de le définir dans le schéma
const user = await User.create({ email: 'test@example.com', ... })
console.log(user._id) // ObjectId automatiquement généré
console.log(user._id.toString()) // "507f1f77bcf86cd799439011"
```

### 2. Les timestamps (`createdAt` et `updatedAt`)

**Automatique** : Si vous activez `timestamps: true` dans les options du schéma, Mongoose ajoute automatiquement :

```typescript
const UserSchema = new Schema(
  { /* vos champs */ },
  { timestamps: true } // ← Active les timestamps
)

// Résultat automatique :
const user = await User.create({ email: 'test@example.com', ... })
console.log(user.createdAt) // Date de création automatique
console.log(user.updatedAt) // Date de mise à jour automatique

// Quand vous modifiez le document :
await User.findByIdAndUpdate(userId, { email: 'new@example.com' })
// updatedAt est automatiquement mis à jour !
```

### 3. Les hooks (pre/post)

**Automatique** : Les hooks s'exécutent automatiquement à certaines étapes du cycle de vie du document.

#### Hook `pre('save')` - Avant la sauvegarde

```typescript
UserSchema.pre('save', async function () {
  // Cette fonction s'exécute AUTOMATIQUEMENT avant chaque save()
  // ou create()

  if (!this.isModified('password')) {
    return // Si le password n'a pas changé, on sort
  }

  // On hash le password automatiquement
  this.password = await bcrypt.hash(this.password, 12)
})

// Utilisation :
const user = await User.create({
  email: 'test@example.com',
  password: 'MonMotDePasse123!' // ← En clair
})

// Le password est automatiquement hashé avant d'être sauvegardé !
console.log(user.password) // "$2a$12$hashedPassword..."
```

**Autres hooks disponibles :**
- `pre('validate')` - Avant la validation
- `pre('save')` - Avant la sauvegarde
- `post('save')` - Après la sauvegarde
- `pre('remove')` - Avant la suppression
- `pre('findOneAndUpdate')` - Avant findOneAndUpdate
- etc.

### 4. Les méthodes d'instance

**Personnalisées** : Vous pouvez ajouter vos propres méthodes qui s'appliquent à une instance de document.

```typescript
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  // 'this' fait référence à l'instance du document
  return bcrypt.compare(candidatePassword, this.password)
}

// Utilisation :
const user = await User.findOne({ email: 'test@example.com' })
  .select('+password') // On doit explicitement demander le password

const isValid = await user.comparePassword('MonMotDePasse123!')
// comparePassword() est une méthode disponible sur l'instance user
```

### 5. Les méthodes statiques

**Personnalisées** : Méthodes disponibles directement sur le modèle (pas sur l'instance).

```typescript
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() })
}

// Utilisation :
const user = await User.findByEmail('TEST@EXAMPLE.COM')
// findByEmail() est une méthode disponible sur le modèle User
```

### 6. Les validations

**Automatiques** : Mongoose valide automatiquement les données selon le schéma.

```typescript
const UserSchema = new Schema({
  email: {
    type: String,
    required: true, // ← Validation automatique
    unique: true,  // ← Index unique automatique
    minlength: 5,  // ← Validation automatique
    match: [/regex/] // ← Validation automatique
  }
})

// Si vous essayez de créer un document invalide :
try {
  await User.create({ email: 'bad' }) // email trop court
} catch (error) {
  // Mongoose lance automatiquement une erreur de validation
  console.error(error.errors.email.message) // "Path `email` is shorter than minimum"
}
```

### 7. Les transformations

**Automatiques** : Mongoose peut transformer les données automatiquement.

```typescript
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,  // ← Transforme automatiquement en minuscules
    trim: true         // ← Supprime les espaces automatiquement
  }
})

// Utilisation :
const user = await User.create({ email: '  TEST@EXAMPLE.COM  ' })
console.log(user.email) // "test@example.com" (transformé automatiquement)
```

### 8. Les méthodes de requête

**Automatiques** : Mongoose fournit de nombreuses méthodes pour interagir avec la base.

```typescript
// CREATE
const user = await User.create({ email: 'test@example.com', ... })
// ou
const user = new User({ email: 'test@example.com', ... })
await user.save()

// READ
const user = await User.findById(userId)
const user = await User.findOne({ email: 'test@example.com' })
const users = await User.find({ emailVerified: true })

// UPDATE
await User.findByIdAndUpdate(userId, { emailVerified: true })
await User.updateOne({ email: 'test@example.com' }, { emailVerified: true })
user.emailVerified = true
await user.save()

// DELETE
await User.findByIdAndDelete(userId)
await User.deleteOne({ email: 'test@example.com' })
```

### 9. Le `select: false`

**Automatique** : Les champs avec `select: false` sont exclus par défaut des requêtes.

```typescript
const UserSchema = new Schema({
  password: {
    type: String,
    select: false // ← Exclu par défaut
  }
})

// Par défaut, le password n'est pas inclus :
const user = await User.findOne({ email: 'test@example.com' })
console.log(user.password) // undefined

// Pour l'inclure, il faut le demander explicitement :
const user = await User.findOne({ email: 'test@example.com' })
  .select('+password') // ← On demande explicitement le password
console.log(user.password) // "$2a$12$hashedPassword..."
```

### 10. Les index

**Automatiques ou manuels** : Mongoose peut créer des index automatiquement.

```typescript
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,  // ← Crée automatiquement un index unique
    index: true    // ← Crée automatiquement un index
  }
})

// Ou manuellement :
UserSchema.index({ email: 1 }) // Index sur email (croissant)
UserSchema.index({ email: 1, firstName: 1 }) // Index composé
```

## Cycle de vie d'un document

Quand vous créez ou modifiez un document, voici ce qui se passe automatiquement :

```
1. new User({ ... }) ou User.create({ ... })
   ↓
2. pre('validate') hook (si défini)
   ↓
3. Validation automatique (required, minlength, etc.)
   ↓
4. pre('save') hook (si défini) ← Votre hash de password ici
   ↓
5. Sauvegarde dans MongoDB
   ↓
6. post('save') hook (si défini)
   ↓
7. Document retourné avec _id, createdAt, updatedAt, etc.
```

## Exemple complet dans votre code

```typescript
// 1. Définition du schéma avec validations automatiques
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,      // ← Validation automatique
    unique: true,         // ← Index unique automatique
    lowercase: true,      // ← Transformation automatique
    trim: true            // ← Transformation automatique
  },
  password: {
    type: String,
    required: true,       // ← Validation automatique
    select: false         // ← Exclu par défaut
  }
}, {
  timestamps: true        // ← createdAt/updatedAt automatiques
})

// 2. Hook automatique avant sauvegarde
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12) // ← Hash automatique
  }
})

// 3. Méthode personnalisée sur l'instance
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password)
}

// 4. Utilisation
const user = await User.create({
  email: '  TEST@EXAMPLE.COM  ',  // ← Sera transformé en "test@example.com"
  password: 'MonMotDePasse123!'    // ← Sera hashé automatiquement
})

// Résultat :
// - user._id : ObjectId automatique
// - user.email : "test@example.com" (transformé)
// - user.password : "$2a$12$..." (hashé)
// - user.createdAt : Date automatique
// - user.updatedAt : Date automatique
// - user.comparePassword() : Méthode disponible
```

## Résumé

Mongoose ajoute automatiquement :
- ✅ `_id` (ObjectId)
- ✅ `createdAt` / `updatedAt` (si timestamps: true)
- ✅ Validations (required, minlength, etc.)
- ✅ Transformations (lowercase, trim, etc.)
- ✅ Index (unique, index: true)
- ✅ Hooks (pre/post) pour exécuter du code automatiquement
- ✅ Méthodes de requête (find, create, update, delete)

Vous pouvez personnaliser :
- ✅ Méthodes d'instance (user.comparePassword())
- ✅ Méthodes statiques (User.findByEmail())
- ✅ Hooks (pre('save'), post('save'), etc.)
- ✅ Virtuals (propriétés calculées)
- ✅ Middleware (pour les requêtes)

