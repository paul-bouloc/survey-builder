# datum — survey-builder

Application de création et de diffusion de questionnaires ("datum" dans l'UI).
Projet personnel, mono-repo Next.js unique (pas de séparation front/back en packages) :
le serveur vit dans `src/server/`, le client dans `src/features/` + `src/pages/`,
et le domaine partagé par les deux dans `src/shared/`.

## Stack

| Domaine         | Choix                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| Framework       | Next.js 16 — **Pages Router** (pas d'App Router, pas de RSC)           |
| Runtime UI      | React 19                                                               |
| Langage         | TypeScript strict, `verbatimModuleSyntax` off, alias `@/*` → `./src/*` |
| Base de données | MongoDB 7 via Mongoose 9 (Docker en local)                             |
| State serveur   | TanStack Query v5                                                      |
| State client    | Redux Toolkit (uniquement l'éditeur de questionnaire)                  |
| Validation      | Zod v4, schémas partagés client/serveur                                |
| UI              | shadcn/ui (style `radix-vega`) + Tailwind CSS v4 + Radix + Base UI     |
| Animation       | framer-motion / motion                                                 |
| i18n            | next-intl, locales `fr` (défaut) et `en`                               |
| Formulaires     | react-hook-form + `@hookform/resolvers/zod`                            |
| Icônes          | lucide-react + icônes illustratives maison                             |
| Toasts          | sonner                                                                 |
| Package manager | **pnpm**                                                               |

## Commandes

```bash
pnpm dev             # serveur de dev (port 3000)
pnpm build           # build de production
pnpm lint            # eslint
pnpm format          # prettier --write .
pnpm format:check    # prettier --check .
pnpm db:start        # docker-compose up -d (MongoDB)
pnpm db:stop         # docker-compose down
pnpm docker:logs     # logs du conteneur mongo
```

Il n'y a **pas encore** de runner de tests installé (voir « Tests » plus bas).

### Version du gestionnaire de paquets

Le repo exige **pnpm >= 12** et **Node >= 20.19.0** (contrainte de Mongoose 9), déclarés
dans `engines`. Le champ `packageManager: "pnpm@12.4.2"` fixe la version exacte : pnpm 12
gère sa propre version, il se résout donc automatiquement à la bonne — d'où les entrées
`packageManagerDependencies` dans le lockfile, qui sont des métadonnées, pas une
installation.

Attention si tu utilises nvm : Node livre un shim **corepack** nommé `pnpm` qui peut
masquer l'installation réelle dans le `PATH` et exposer une version plus ancienne. Le
symptôme est `ERR_PNPM_UNEXPECTED_STORE` (node_modules lié à un store d'une autre version
majeure). Vérifie avec `which -a pnpm` et `pnpm --version` ; la solution est soit de
laisser corepack honorer `packageManager`, soit de placer `~/Library/pnpm/bin` avant le
répertoire nvm dans le `PATH`.

Les scripts de build autorisés sont déclarés dans `pnpm-workspace.yaml` sous `allowBuilds`
(syntaxe pnpm 12, qui remplace `onlyBuiltDependencies`).

## Variables d'environnement

`.env` à la racine, calqué sur `.env.example` :

- `MONGODB_URI` — requis, l'app throw au démarrage sans lui
- `MONGO_DATABASE`, `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD` — utilisés par docker-compose
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `NEXT_PUBLIC_APP_URL`

## Arborescence

```
src/
  pages/            Routes Next (fines : elles orchestrent, elles n'implémentent pas)
    api/            Routes API — délèguent à src/server/api/routes/
  server/           Code serveur uniquement — jamais importé par un composant client
  shared/           Domaine, contrats API, validation, i18n — importable des deux côtés
  features/         Code métier client, découpé par domaine fonctionnel
  components/       UI transverse : primitives shadcn, layouts, icônes
  hooks/            Hooks React génériques
  lib/              Utilitaires purs (cn, string, api-error, safe-redirect)
  config/           routes.ts — source unique des chemins de l'app
  store/            Configuration du store Redux
  styles/           globals.css (design tokens)
```

Des `CLAUDE.md` scopés complètent celui-ci :

- [src/server/CLAUDE.md](src/server/CLAUDE.md) — API, modèles Mongoose, auth
- [src/features/CLAUDE.md](src/features/CLAUDE.md) — features client, éditeur, UI
- [src/shared/CLAUDE.md](src/shared/CLAUDE.md) — types du domaine, contrats, i18n

## Conventions transverses

### Nommage des fichiers

`kebab-case` avec un suffixe qui annonce le rôle. Le suffixe est porteur de sens, il
n'est pas décoratif :

| Suffixe                                        | Contenu                                               |
| ---------------------------------------------- | ----------------------------------------------------- |
| `*.component.tsx`                              | Composant React métier                                |
| `*.type.ts`                                    | Types du domaine (pas de runtime)                     |
| `*.schema.ts`                                  | Schéma Zod **ou** schéma Mongoose selon l'emplacement |
| `*.contract.ts`                                | Barrel de contrat API (request + response)            |
| `*.client.ts`                                  | Client HTTP d'une feature                             |
| `*.queries.ts` / `*.mutations.ts`              | Hooks TanStack Query                                  |
| `*.mapper.ts`                                  | Conversion DTO ↔ domaine                              |
| `*.slice.ts`                                   | Slice Redux Toolkit                                   |
| `*.policy.ts`                                  | Règle de validation Zod réutilisable                  |
| `*.model.ts` / `*.document.ts` / `*.subdoc.ts` | Couche Mongoose (voir server)                         |

Les primitives shadcn dans `components/ui/` gardent leur nom d'origine, sans suffixe
(`button.tsx`, `dialog.tsx`) : elles doivent rester alignables sur l'upstream.

Chaque dossier de rôle expose un `index.ts` barrel qui ré-exporte explicitement
(`export { x } from './y'`), pas de `export *` sauf dans les barrels de modèles serveur.

### Style de code

Prettier fait autorité, ne discute pas son formatage :
pas de point-virgule, guillemets simples, pas de trailing comma, 2 espaces, `arrowParens: avoid`.
Le plugin `prettier-plugin-tailwindcss` trie les classes — ne les réordonne pas à la main.

ESLint impose en plus : `prefer-const`, `prefer-template`, `prefer-destructuring`,
`prefer-object-spread`. Les variables inutilisées doivent être préfixées par `_`
(`catch (_error)`).

- **Identifiants, types et noms de fichiers en anglais.**
- **Commentaires et JSDoc en français** — c'est la convention du projet, y compris
  dans le code neuf. Ne traduis pas les commentaires français existants en anglais.
- Commente le _pourquoi_, pas le _quoi_. La majorité des fonctions n'ont pas besoin
  de commentaire ; celles du moteur (arbre, conditions, sanitizers) en méritent un.

### Enums

Pas de `enum` TypeScript. Le projet utilise systématiquement le pattern
objet-const + type dérivé, qui donne une valeur runtime et un type du même nom :

```ts
export const NodeKind = {
  PAGE: 'page',
  GROUP: 'group'
} as const

export type NodeKind = (typeof NodeKind)[keyof typeof NodeKind]
```

Utilise toujours la constante (`NodeKind.PAGE`) plutôt que le littéral (`'page'`)
dans le code, y compris dans les `switch` et les comparaisons.

### Types brandés

`src/shared/types/brands.type.ts` définit `ObjectId`, `Email`, `ShortId`, `NodeId`.
Ce sont des `string` brandés : ils empêchent de passer un id de node là où on attend
un id de survey. Le cast (`as NodeId`) se fait **uniquement** dans les mappers et les
factories, jamais dispersé dans les composants.

### Routes

Tout chemin de l'app passe par `src/config/routes.ts`. N'écris jamais une URL en dur
dans un composant : utilise `routes.survey.edit.getHref(shortId)`. Chaque entrée porte
`path` (le pattern Next), `labelKey` (clé i18n) et `getHref` (constructeur typé).

Les entités sont adressées publiquement par leur `shortId` (6 caractères alphanumériques
générés par `generateShortId`), jamais par leur `ObjectId`.

### Gestion d'erreur côté client

Les erreurs API sont extraites avec `extractApiError` / `getErrorMessage`
(`src/lib/api-error.ts`), qui lisent la forme `{ error: { code, message, details } }`
renvoyée par le serveur. Les erreurs utilisateur sont affichées via `toast` (sonner),
avec un message issu de l'i18n — pas le message brut de l'API.

## Tests

Aucun test n'existe aujourd'hui et aucun runner n'est installé.

La cible est **Vitest sur la logique pure** — c'est là que les régressions coûtent cher :

- `src/features/surveys/editor/state/tree/` (find, parent, order, remove)
- `src/features/surveys/editor/state/sanitizers/`
- les mappers (`survey.mapper.ts`, `survey-to-draft.mapper.ts`)
- le futur moteur d'évaluation des conditions et triggers

Pas de tests d'API ni de E2E pour l'instant. N'installe pas Vitest ni n'écris de tests
de façon spontanée : attends que ce soit demandé, ou propose-le quand tu touches à l'une
de ces zones.

## État d'avancement

**L'inventaire du travail restant vit dans [ROADMAP.md](ROADMAP.md)**, pas ici. Consulte-le
avant de commencer une tâche, et coche les cases que tu termines dans le même commit que
le code. Il porte aussi une section « Questions ouvertes » : ces points ne se tranchent
pas seul, demande.

Résumé : l'authentification, la création/consultation de questionnaires et l'UI de
l'éditeur fonctionnent. L'éditeur **ne sauvegarde rien** (tout est perdu au
rechargement), et le parcours de réponse, la publication, les résultats et les analytics
sont des placeholders.

### Décisions d'architecture prises

Elles orientent les tickets de la roadmap, ne les remets pas en cause sans raison :

- **Persistance de l'éditeur** — autosave debounced en **PUT du draft complet**
  (meta + `pages`), avec indicateur de statut dans le header.
- **Moteur d'exécution** (conditions / triggers / actions) — code partagé dans
  `src/shared/`, exécuté côté client pour la réactivité **puis rejoué côté serveur** à
  chaque commit, pour que la logique ne soit pas contournable.
- **Répondants** — répondre exige un compte (`respondentUserId` requis) : une réponse par
  utilisateur et par questionnaire, reprise via `status: 'in_progress'` +
  `currentPageId`.
- **Tests** — Vitest sur la logique pure en priorité (voir « Tests » plus haut).

### Valeurs factices en place

À remplacer dès que le modèle `SurveyResponse` existera — ne les recopie pas comme
modèle :

- [find-one-overview.get.ts](src/server/api/routes/surveys/find-one-overview.get.ts) —
  `completedCount`, `inProgressCount`, `completionRate`, `weeklyData` et `questionCount`
  sont codés à `99`.
- [index.tsx](src/pages/index.tsx) — `mockResponses` en dur, et `respondedSurveys`
  toujours vide.

## Traiter un ticket de la roadmap

Quand on te demande de « traiter le prochain point de la roadmap » (ou un ticket
précis), suis ce déroulé. Il vaut pour tout ticket de [ROADMAP.md](ROADMAP.md).

### 1. Choisir le ticket

Le « prochain point » est le **premier `[ ]` non coché dans l'ordre du fichier**, en
partant de la phase la plus basse. Les phases sont ordonnées par dépendance : la phase 0
corrige ce qui ferait échouer le reste, la phase 1 débloque l'éditeur, etc.

Avant de démarrer, vérifie deux choses :

- le ticket n'est pas bloqué par une **question ouverte** en tête de roadmap — si c'est
  le cas, pose la question et attends la réponse plutôt que de trancher ;
- le ticket est encore valide — la codebase a pu bouger depuis sa rédaction. Si le
  constat est obsolète, dis-le et propose la mise à jour.

Si le prochain ticket te semble mal ordonné (une dépendance non satisfaite, un gain à le
faire plus tard), signale-le au lieu de l'exécuter mécaniquement.

### 2. Analyser l'existant

Lis le code concerné **avant** de proposer quoi que ce soit. Le ticket donne des
pointeurs, pas une spec : la ligne `→ fichier` est un point d'entrée, pas le périmètre
complet.

Cherche en particulier :

- ce qui existe déjà et peut être réutilisé (composant, hook, helper, reducer) ;
- les patterns équivalents ailleurs dans le repo — ce projet est très homogène, il y a
  presque toujours un précédent à imiter (voir les `CLAUDE.md` scopés) ;
- les endroits qui devront suivre : i18n `fr` **et** `en`, contrat Zod partagé, mapper,
  barrel `index.ts`, sélecteur, clé de query.

### 3. Poser les questions

Regroupe **toutes** tes questions en une fois, avant d'écrire du code. Une question vaut
la peine d'être posée quand deux réponses raisonnables mènent à un travail différent.
Pour le reste, prends la décision et mentionne-la.

Sont typiquement des questions à poser : un choix d'UX visible, un changement de forme
d'une donnée persistée, l'ajout d'une dépendance, une règle métier non écrite.

### 4. Présenter le plan et attendre le feu vert

Avant d'écrire du code, expose brièvement :

- ce que tu vas faire, dans l'ordre ;
- les fichiers créés ou modifiés ;
- ce que le ticket **n'inclut pas** volontairement ;
- les risques ou effets de bord que tu anticipes.

Puis **attends la validation**. Court et concret : c'est un plan, pas une spec.

### 5. Implémenter

Une fois le plan validé, déroule le ticket en entier sans t'interrompre. Respecte les
conventions de ce fichier et des `CLAUDE.md` scopés. Ne réduis pas le périmètre en
silence : si une partie s'avère bloquée, termine tout le reste et dis explicitement ce
que tu as laissé de côté et pourquoi.

**Hors périmètre.** Si tu découvres un bug ou un manque étranger au ticket :

- si c'est trivial (typo, one-liner évident), corrige-le dans un **commit séparé** ;
- sinon, ajoute une ligne dans la phase appropriée de la ROADMAP et signale-le. Ne
  l'embarque pas dans le ticket en cours.

### 6. Vérifier

Avant d'annoncer que c'est terminé, lance :

```bash
pnpm exec tsc --noEmit   # doit passer sans erreur
pnpm lint                # voir ci-dessous
pnpm build               # doit passer
```

`pnpm lint` remonte **120 erreurs préexistantes** dans six primitives de
`src/components/ui/` (guillemets doubles et classes Tailwind non triées, telles
qu'installées par la CLI shadcn). N'exige pas zéro erreur : vérifie que tu n'en as pas
**ajouté** sur les fichiers que tu as touchés.

Dans ton rapport, énonce ce que tu as vérifié et ce que tu n'as pas pu vérifier.
N'affirme pas qu'une fonctionnalité marche si tu ne l'as pas réellement exercée — dire
« le build passe, je n'ai pas testé le parcours dans le navigateur » est une réponse
correcte.

### 7. Clore le ticket

Coche la case `[x]` dans ROADMAP.md et commite-la **avec** le code, pour que le fichier
reflète toujours l'état réel du repo. Une case ne se coche que si la fonctionnalité est
utilisable de bout en bout, pas si le code compile. Si le ticket n'est que partiellement
traité, utilise `[~]` et précise ce qu'il reste.

Rappel : on travaille directement sur `main`, sans branche par ticket. Voir la section
« Commits » ci-dessous pour le découpage — et ne commite pas de ta propre initiative.

## Commits

**Commite le plus souvent possible.** Un commit par unité de changement cohérente, pas
un gros commit en fin de tâche. Dès qu'un changement se tient tout seul — il compile, il
ne casse rien, il a un sens isolément — il mérite son commit.

Concrètement : sépare toujours un `fix` d'un `refactor`, la documentation du code, une
correction de typo d'une évolution fonctionnelle. Si le message doit dire « et aussi »,
c'est qu'il fallait deux commits. Le but est que chaque commit puisse être lu, relu ou
annulé indépendamment.

Convention : **Conventional Commits**, message en anglais, descriptif plutôt que
télégraphique. Les types en usage dans le repo sont `feat`, `fix`, `refactor`, `chore`,
`style`, `docs`.

```
feat: add updateSurveyMeta and setSelection reducers to survey editor slice
fix: adjust padding in survey editor page header for improved layout consistency
```

Le corps du message sert à expliquer le _pourquoi_ quand il n'est pas évident : une
décision d'architecture, un effet de bord, une contrainte d'environnement. Il n'est pas
nécessaire pour un changement qui parle de lui-même.

**Ne commite pas de ta propre initiative** : attends que ce soit demandé. La règle
ci-dessus porte sur le _découpage_ — une fois le commit demandé, fais-en autant que le
travail en contient, plutôt qu'un seul commit fourre-tout.

## Règles de travail

- Ne migre pas vers l'App Router, ne convertis pas de composants en RSC.
- Utilise `pnpm`, jamais `npm` ni `yarn`, y compris dans les scripts de `package.json`.
- Tout nouveau texte visible passe par next-intl, dans les **deux** locales.
  `en` doit satisfaire `satisfies typeof frMessages` : une clé oubliée casse le typage.
- Avant d'ajouter une dépendance, vérifie que la stack ne couvre pas déjà le besoin
  (Radix, Base UI et shadcn se recouvrent largement).
