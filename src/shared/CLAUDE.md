# Domaine partagé — `src/shared/`

Le seul dossier importable **à la fois** par le serveur et par le client. Tout ce qui
est ici doit donc être isomorphe : pas de Mongoose, pas de `process.env` serveur, pas
d'accès au DOM.

```
shared/
  types/          Types du domaine (aucun runtime, sauf les const-objets d'enum)
  api/
    contracts/    Schémas Zod des requêtes et réponses HTTP
    http/axios.ts Instance axios partagée
  validation/
    policies/     Règles Zod réutilisables (email, name, shortId)
  i18n/           Messages, typage next-intl, helpers de formatage
```

## Le modèle de données

C'est la pièce la plus travaillée du projet, et la plus structurante. Lis-la avant de
toucher à l'éditeur ou au futur moteur.

### Structure d'un questionnaire

```
Survey
  pages: PageNode[]          ← uniquement des nodes de kind `page`
    children: Node[]         ← tout sauf `page`
      children: Node[]       ← récursif
```

`Node` est une union discriminée sur `kind` :

| kind       | Contenu propre                  | Enfants    |
| ---------- | ------------------------------- | ---------- |
| `page`     | `page.skippable`                | oui        |
| `group`    | `group.{title,description}`     | oui        |
| `question` | `type` + `config`               | optionnels |
| `info`     | `info.{type,title,description}` | non        |
| `divider`  | —                               | non        |

Un `group` peut être vide : c'est l'état dans lequel la factory de l'éditeur le crée.
Exiger qu'il porte au moins un enfant est une règle de **publication** (phase 5), pas
une contrainte de persistance du brouillon.

Tous héritent de `BaseNode` : `id` (`NodeId`), `kind`, `order`, `title`, `subtitle`,
`description`, `code`, `condition`, `triggers`. Les trois champs texte sont
`string | null` — `null` signifie « non renseigné », et c'est bien un `null` explicite,
pas un `undefined`.

`code` est un identifiant stable et optionnel, destiné au reporting et aux questions
« spéciales » (par exemple `CONSENT`). Il ne sert à rien aujourd'hui.

### Questions

`QuestionNode` est doublement discriminé : par `kind: 'question'` puis par `type`.
Chaque variante a sa `config` dédiée, elle-même discriminée sur `type` :

`text`, `textarea`, `number`, `date`, `radio`, `checkboxes`, `select`, `scale`.

Le champ `commit` de chaque config (`'change' | 'blur' | 'next'`) dit **quand** la
valeur saisie est considérée comme acquise — c'est ce qui déclenche les triggers de
timing `commit`. Les valeurs autorisées varient selon le type : pas de `blur` sur un
`radio`, par exemple.

### Logique conditionnelle

Trois briques, entièrement typées et **encore non implémentées** :

**`Condition`** — arbre booléen. Opérateurs feuilles (`eq`, `neq`, `in`, `includes`,
`gt`, `gte`, `lt`, `lte`, `exists`) et opérateurs composites (`and`, `or`, `not`).
Le champ `path` désigne ce qui est évalué ; s'il est absent, la condition porte sur la
valeur de la question courante. Convention de chemin prévue :
`answers.<nodeId>`, `flags.<name>`, `derived.<name>`.

**`TriggerRule`** — `{ timing, when?, actions, dedupeKey? }`. Les timings sont
`change`, `commit`, `submit`, `enter`, `exit`. Sans `when`, le trigger part à chaque
occurrence du timing. `dedupeKey` sert à ne pas rejouer une action déjà déclenchée.

**`Action`** — `flag`, `unflag`, `goto` (`NEXT` / `PREVIOUS` / `END` / `NODE`),
`toast`, `confirm`.

**Décision d'architecture pour l'implémentation** : le moteur d'évaluation vit
**dans `src/shared/`** et tourne aux deux bouts — côté client pour la réactivité de
l'UI, puis rejoué côté serveur à chaque commit de réponse pour que la logique ne soit
pas contournable par un client modifié. Écris-le donc sans aucune dépendance au DOM
ni à Mongoose, et couvre-le de tests unitaires (Vitest) : c'est la zone où une
régression est la plus coûteuse.

### Réponses

`SurveyResponse` est typé mais n'a **ni schéma Mongoose, ni endpoint**. Le modèle
retenu : une réponse par utilisateur et par questionnaire (`respondentUserId` est
requis — répondre exige un compte). À chaque commit d'étape on écrase `answers`
entièrement et on met à jour `currentPageId` ; à la soumission on passe
`status: 'completed'` et on date `completedAt`.

## Contrats API

`src/shared/api/contracts/<domaine>/` regroupe pour chaque domaine :

- `*.request.ts` — schémas des corps de requête
- `*.schema.ts` — schémas des réponses
- `*.contract.ts` — barrel qui ré-exporte les deux

Le **même** schéma Zod sert au serveur (validation dans `createEndpoint`) et au client
(résolveur react-hook-form). C'est tout l'intérêt de l'emplacement : ne duplique jamais
un schéma d'un côté ou de l'autre.

Les types sont dérivés, jamais écrits deux fois :

```ts
export type CreateSurveyBody = z.infer<typeof CreateSurveyBodySchema>
```

### Messages d'erreur = clés i18n

Les messages Zod ne sont pas du texte affichable, ce sont des **clés de traduction** :

```ts
z.string('errors.common.required').max(200, 'errors.common.max')
```

Côté client, `translateFieldErrors` (`shared/i18n/zod-error.ts`) les passe au
traducteur `formError`. Si tu ajoutes un message, ajoute la clé dans
`messages/fr/form-error.json` **et** `messages/en/form-error.json`.

Les `policies` (`validation/policies/`) sont les règles réutilisables :
`emailPolicy` (valide + normalise en minuscules), `namePolicy` (2–100 caractères +
title case), `shortIdPolicy` (exactement 6 caractères). Réutilise-les plutôt que de
réécrire la contrainte.

### Le décalage contrat / domaine

`SurveySchema` (contrat Zod) et `Survey` (type domaine) ne sont pas identiques, et c'est
voulu :

- le contrat décrit ce qui transite en JSON — les `pages` y sont typées en
  `z.any()` faute de schéma Zod récursif ;
- le domaine décrit ce que le code manipule — `PageNode[]` complet, `Date`, ids brandés.

Le pont est `surveyMapper.toDomain` (`features/surveys/common/mappers/`). Toute réponse
API passe par un mapper avant d'entrer dans le code client. Si tu ajoutes un champ,
mets à jour les deux plus le mapper.

### Le schéma Zod récursif des nodes

`contracts/surveys/node.schema.ts` décrit l'arbre complet : conditions (récursives),
triggers, actions, les huit configs de question, et `NodeSchema` / `PageNodeSchema`.
Il valide le **corps du PUT** de sauvegarde de l'éditeur.

Deux principes à respecter si tu le modifies :

- **Permissif sur la complétude métier, strict sur la structure.** Un brouillon en
  cours d'édition contient des questions à choix sans options et des titres vides :
  il doit pouvoir être sauvegardé. Ce qui est vérifié, c'est `kind`, `type`, la
  présence des sous-objets et le type des champs. La complétude est une règle de
  publication (phase 5).
- **`page` n'apparaît que dans `PageNodeSchema`.** `NodeSchema` est l'union des nodes
  imbricables, `page` en est exclu — c'est ce qui interdit une page dans une page,
  comme le `validate` Mongoose côté serveur.

La cohérence entre `type` et `config.type` d'une question est assurée par un `refine`
au runtime : les deux sont discriminés séparément, rien au niveau du typage ne les lie.

`SurveySchema` (schéma de **réponse**) garde ses `z.any()` pour l'instant : le brancher
ferait valider toutes les lectures, et un document déjà en base légèrement hors-schéma
ferait échouer un GET. C'est le ticket `P8-7`.

## i18n

next-intl, `fr` par défaut et `en`, configuré dans `next.config.ts` (routage par locale
Next natif).

Les messages sont découpés par namespace, un fichier JSON par namespace et par locale :
`common`, `nav`, `routes`, `form`, `formError`, `auth`, `surveys`.

`messages/index.ts` les assemble. Note la contrainte de typage :

```ts
export const enMessages = { ... } satisfies typeof frMessages
```

**`fr` est la source de vérité.** Une clé présente en `fr` et absente en `en` casse la
compilation — c'est délibéré. Ajoute toujours les deux.

`intl.d.ts` branche ce type sur `AppConfig` de next-intl : les clés passées à
`useTranslations` sont donc autocomplétées et vérifiées.

### Usage

```ts
const t = useTranslations('surveys.edit')
t('pages.pageNumber', { number: 1 })
```

Pour les dates, utilise `formatDate` (`shared/i18n/format.ts`) qui retourne
`{ value, isRelative }` : relatif en deçà d'une semaine, format moyen au-delà.
Le fuseau est fixé à `Europe/Paris` dans `_app.tsx`.

Les titres de page (`<Head>`) viennent du namespace `routes`, suffixés `| datum`.
