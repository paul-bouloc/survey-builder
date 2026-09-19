# Backend — `src/server/`

Code exécuté **uniquement** côté serveur. Rien ici ne doit être importé par un composant
client : ces modules touchent Mongoose, les cookies et `process.env`.

Seule exception tolérée : les types d'erreur (`ApiErrorResponse`, `ApiErrorCode`) sont
importés par `src/lib/api-error.ts` pour typer la réponse d'erreur côté client. C'est du
type pur, effacé à la compilation.

```
server/
  api/
    create-endpoint.ts    Fabrique d'endpoint (validation + auth + DB + erreurs)
    create-route.ts       Dispatch par méthode HTTP
    errors/               Exceptions HTTP et normalisation
    routes/               Un fichier par endpoint
  auth/                   JWT, cookies, garde d'authentification
  database/mongoose.ts    Connexion avec cache global (hot-reload safe)
  models/                 Schémas et modèles Mongoose
```

## Le pattern d'endpoint

Deux couches, à respecter systématiquement.

**1. Dans `src/pages/api/` — routage seul.** Le fichier ne contient que le mapping
méthode → handler. Aucune logique :

```ts
import { createRoute } from '@/server/api/create-route'
import { createSurvey } from '@/server/api/routes/surveys/create.post'
import { findAllSurveys } from '@/server/api/routes/surveys/find-all.get'

export default createRoute({
  GET: findAllSurveys,
  POST: createSurvey
})
```

`createRoute` répond automatiquement 405 avec l'en-tête `Allow` pour les méthodes
non déclarées.

**2. Dans `src/server/api/routes/` — l'implémentation.** Un fichier par endpoint, nommé
`<action>.<méthode>.ts` (`create.post.ts`, `find-one-overview.get.ts`), exportant une
const nommée.

```ts
export const createSurvey = createEndpoint(
  {
    requireAuth: true,
    body: CreateSurveyBodySchema,
    response: SurveySchema,
    status: 201
  },
  async ({ body, user }) => {
    // `body` est typé et déjà validé, `user` est garanti non-null
  }
)
```

### Ce que `createEndpoint` prend en charge

Tu n'as pas à le refaire dans le handler :

- parse `body` et `query` avec les schémas Zod fournis (une `ZodError` devient un 400
  `validation_error` avec le détail par champ) ;
- connecte la DB (`withDb`, défaut `true`) ;
- applique `requireAuth` (**défaut `true`** — il faut écrire `requireAuth: false`
  explicitement pour un endpoint public) et injecte `user` dans le contexte ;
- valide la réponse contre `response` si fourni ;
- renvoie `status` (défaut 200) ;
- capture toute exception via `handleApiError`.

Le contexte du handler est `{ req, res, body, query }`, plus `user: IUserDocument`
quand `requireAuth` n'est pas `false`. Le typage est conditionnel : avec
`requireAuth: false`, `user` n'existe pas sur le contexte.

### Erreurs

Lève une exception, ne construis jamais une réponse d'erreur à la main :

```ts
throw new NotFoundException('Survey not found')
throw new ForbiddenException('Only the creator can access survey overview')
```

Disponibles dans `server/api/errors` : `BadRequestException` (400),
`UnauthorizedException` (401), `ForbiddenException` (403), `NotFoundException` (404),
`ConflictException` (409), `InternalServerException` (500). Toutes dérivent de
`HttpException` (`status`, `code`, `message`, `details`).

`handleApiError` normalise aussi ce qui n'est pas une `HttpException` :

- `ZodError` → 400 `validation_error`, avec `{ messages, fieldErrors }`
- Mongoose `ValidationError` / `CastError` → 400
- MongoDB duplicate key (11000) → 409 `conflict`
- tout le reste → 500 `internal_error`, loggé côté serveur

La forme de réponse d'erreur est toujours `{ error: { code, message, details? } }`.

### Autorisation

`requireAuth` authentifie, il **n'autorise pas**. La vérification de propriété est à
la charge du handler, explicitement :

```ts
if (survey.createdBy.toString() !== user._id.toString()) {
  throw new ForbiddenException('Only the creator can access survey overview')
}
```

Le périmètre d'autorisation se décide **endpoint par endpoint**, selon ce que la route
sert. Les deux routes de lecture d'un questionnaire illustrent les deux cas, et cette
asymétrie est voulue :

| Route                      | Portée                    | Pourquoi                                                                                                                                                           |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `find-one.get.ts`          | Tout utilisateur connecté | C'est la route de **consultation pour répondre** : n'importe qui de connecté doit pouvoir ouvrir un questionnaire par son `shortId`. Pas de contrôle de propriété. |
| `find-one-overview.get.ts` | Créateur uniquement       | C'est le **tableau de bord** : nombre de réponses, statistiques, métadonnées. Réservé au créateur, `ForbiddenException` sinon.                                     |

La règle à retenir pour un nouvel endpoint : ce qui expose des données agrégées, des
réponses ou de l'administration est scopé au créateur ; ce qui sert le parcours de
réponse est ouvert aux utilisateurs connectés. Les mutations sur un questionnaire
(sauvegarde de l'éditeur, publication, archivage) sont évidemment réservées au créateur.

### Sérialisation

Les handlers renvoient des objets plats, jamais des documents Mongoose :
`_id` et `createdBy` sont convertis via `.toString()`, les optionnels sont normalisés
en `null` (`survey.subtitle ?? null`). Utilise `.lean()` sur les lectures.

Le schéma de réponse Zod décrit des `Date` (`z.date()`) : la sérialisation JSON les
transforme en chaînes ISO, et c'est le mapper côté client qui les reconstruit en `Date`.

## Authentification

Authentification **par email seul, sans mot de passe** — il n'y a pas de vérification
de secret. `POST /api/auth/login` accepte deux formes de corps (union Zod) :

- `{ email }` — si l'utilisateur existe, il est connecté ; sinon la réponse porte
  `needsRegistration: true` et le client affiche le second champ ;
- `{ email, name }` — crée le compte (ou connecte si l'email existe déjà).

Le JWT (`{ userId, email }`) est posé dans un cookie `auth-token` : `HttpOnly`,
`SameSite=Lax`, `Secure` en production, 7 jours. Il n'y a **pas** de middleware Next :
la protection se fait par `requireAuth` côté API et par `SessionGuard` côté client.

Il n'y a **aucune dépendance de hachage** dans le projet (`bcryptjs` a été retiré) :
c'est cohérent avec l'authentification sans mot de passe. Si un facteur de vérification
est ajouté un jour (lien magique, code à usage unique), c'est une décision de design à
prendre explicitement, pas un simple ajout de dépendance.

## Modèles Mongoose

Chaque entité suit une décomposition en trois ou quatre fichiers :

| Fichier         | Rôle                                                  |
| --------------- | ----------------------------------------------------- |
| `*.schema.ts`   | Le `Schema` Mongoose                                  |
| `*.document.ts` | L'interface `Document` et le type `Model`             |
| `*.model.ts`    | Le modèle, avec la garde hot-reload                   |
| `*.subdoc.ts`   | L'interface d'un sous-document (pas de modèle propre) |

La garde hot-reload est obligatoire, sinon Next recompile et Mongoose throw sur un
modèle déjà déclaré :

```ts
export const Survey: SurveyModel =
  (models.Survey as SurveyModel) ||
  model<ISurveyDocument, SurveyModel>('Survey', SurveySchema)
```

Même logique pour la connexion : `database/mongoose.ts` met en cache la promesse sur
`global.mongoose`. Ne la contourne pas, appelle toujours `connectDB()` (ce que
`createEndpoint` fait déjà).

### Discriminators

C'est le cœur du modèle de données. L'arbre du questionnaire est **polymorphe**, et
Mongoose le représente avec des discriminators sur un schéma de base :

- `NodeSchema` (clé `kind`) → discriminators `page`, `group`, `question`, `info`, `divider`
- `QuestionConfigSchema` (clé `type`) → un discriminator par type de question
- `ConditionSchema` (clé `op`) → un par opérateur
- `ActionSchema` (clé `type`) → un par type d'action

Conséquences pratiques :

- Le schéma de base est **muté** par l'appel `.discriminator()`. L'ordre d'import
  compte : importer un node enregistre son discriminator sur `NodeSchema`. Les barrels
  `index.ts` de `models/` existent pour garantir que tout est chargé — garde-les
  exhaustifs et importe les modèles depuis `@/server/models`.
- `NodeSchema` est récursif : `children: [NodeSchema]`. Un node peut contenir des nodes
  de n'importe quel kind, **sauf `page`** — c'est validé par un `validate` sur chaque
  schéma porteur d'enfants, et `Survey.pages` valide symétriquement que tous ses
  éléments sont bien des `page`.
- Pour ajouter un type de node ou de question : ajoute la valeur dans le const-objet
  de `shared/types`, le type discriminé, le `*.subdoc.ts`, le discriminator, et
  l'entrée dans le barrel. Les cinq, sinon ça casse silencieusement.

### Identité

Deux identifiants coexistent, ne les confonds pas :

- `_id` (`ObjectId`) — clé interne, jamais exposée dans une URL ;
- `shortId` — 6 caractères générés par `generateShortId`, `unique` + `index`, c'est
  l'identifiant public utilisé par toutes les routes.

`UserSchema` a un hook `pre('save')` qui retente la génération du `shortId` jusqu'à
10 fois en cas de collision. `SurveySchema` n'a pas cet équivalent : il compte sur
l'index unique et remonterait un 409. Un `NodeId` est un `crypto.randomUUID()` généré
côté client par les factories de l'éditeur.

## Quand tu ajoutes un endpoint

1. Le schéma de request/response va dans `src/shared/api/contracts/` — **pas ici**.
   Le client doit pouvoir l'importer.
2. Crée `src/server/api/routes/<domaine>/<action>.<méthode>.ts` avec `createEndpoint`.
3. Branche-le dans `src/pages/api/` via `createRoute`.
4. Vérifie la propriété de la ressource dans le handler si elle est privée.
5. Ajoute le client et le hook correspondants côté feature
   (voir [src/features/CLAUDE.md](../features/CLAUDE.md)).
