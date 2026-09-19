# Front — `src/features/` et couche UI

Code métier client, découpé par domaine fonctionnel. Un composant qui porte du métier
va ici ; un composant réutilisable sans métier va dans `src/components/`.

```
features/
  auth/
    api/          client HTTP + hooks TanStack Query + query keys
    components/   formulaire d'authentification
  surveys/
    common/       client, hooks et mappers partagés par les sous-features surveys
    creator/      formulaire de création
    lists/        listes et cartes de questionnaires
    overview/     page d'aperçu d'un questionnaire
    editor/       l'éditeur visuel (la plus grosse feature)
```

## Séparation des responsabilités

| Couche                   | Rôle                                                                   | Ne fait pas                                    |
| ------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `src/pages/`             | Lit `router.query`, choisit le layout, branche les états de chargement | Pas de logique métier, pas d'appel HTTP direct |
| `features/*/api/`        | Appels HTTP et cache serveur                                           | Pas de rendu                                   |
| `features/*/components/` | Rendu et interaction                                                   | Pas d'appel `axios` direct                     |
| `components/ui/`         | Primitives shadcn                                                      | Rien de métier, rien de spécifique à datum     |
| `components/layouts/`    | Chrome de l'app (navbars, structure)                                   | —                                              |

Les pages sont volontairement fines. Regarde `pages/survey/[surveyShortId]/edit.tsx` :
elle synchronise le store et choisit une vue selon la phase, mais tout le rendu est
délégué aux composants de la feature.

## Les deux états, et pourquoi il y en a deux

C'est la règle la plus importante côté client, ne la mélange pas.

**TanStack Query = état serveur.** Tout ce qui vient de l'API : session, liste des
questionnaires, aperçu. Jamais recopié dans Redux.

**Redux Toolkit = état client de l'éditeur, et rien d'autre.** Le store ne contient
qu'un seul slice, `surveyEditor`. Il existe parce que l'éditeur manipule un brouillon
local divergeant du serveur, partagé entre trois panneaux (canvas, sidebar, inspector).
N'ajoute pas de slice pour du state qui appartient à un composant ou au serveur.

### Pattern des appels API

Trois fichiers par domaine, toujours les mêmes :

**`query-keys.ts`** — hiérarchie de clés, pour que l'invalidation soit ciblée :

```ts
export const surveysQueryKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveysQueryKeys.all, 'list'] as const,
  detail: (shortId: string) =>
    [...surveysQueryKeys.all, 'detail', shortId] as const
} as const
```

**`*.client.ts`** — fonctions async, l'instance `http` partagée
(`@/shared/api/http/axios`, `baseURL: '/api'`, `withCredentials: true`), et le passage
par le mapper :

```ts
export const surveysClient = {
  getSurvey: async (shortId: string) => {
    const { data } = await http.get<SurveyResponse>(`/surveys/${shortId}`)
    return surveyMapper.toDomain(data)
  }
}
```

**`*.queries.ts` / `*.mutations.ts`** — les hooks. Convention en place :
`staleTime: 30s` sur les données de questionnaire, `refetchOnWindowFocus: false`
partout, `enabled: Boolean(shortId)` quand le paramètre vient du routeur, et
invalidation de la clé concernée dans `onSuccess`.

N'appelle jamais `axios` ni `fetch` depuis un composant.

## L'éditeur de questionnaire

`features/surveys/editor/` — c'est la partie la plus structurée, et la convention y est
la plus stricte.

```
editor/
  state/
    model/        types du state et des patches
    store/        le slice Redux
    selectors/    accès au state (les composants ne lisent jamais state.surveyEditor)
    factories/    création de nodes
    mappers/      Survey (API) → SurveyDraft (édition)
    sanitizers/   normalisation des patches avant application
    tree/         manipulation de l'arbre — logique pure, sans Redux
  components/
    nodes/        rendu des blocs du canvas
    inspector/    panneau de propriétés
      fields/     champs atomiques réutilisables
      panels/     un panneau par kind / type de question
  config/         contraintes (maxLength)
  lib/            règles métier pures
  views/          états de page (loading, error, forbidden)
```

`state/index.ts` est le point d'entrée : importe depuis
`@/features/surveys/editor/state`, pas depuis les sous-dossiers.

### Forme du state

```ts
{
  data: { draft: SurveyDraft | null },
  ui: { selectedNodeId: NodeId | null },
  status: { phase: EditorPhase, isDirty: boolean }
}
```

Cette tripartition `data` / `ui` / `status` est délibérée — respecte-la si tu ajoutes
un champ. `EditorPhase` vaut `idle | loading | success | forbidden | error`, et la page
d'édition rend une vue différente par phase.

`SurveyDraft` n'est pas un `Survey` : c'est le sous-ensemble éditable
(`shortId`, `title`, `subtitle`, `description`, `pages`), produit par `surveyToDraft`.
L'éditeur est ainsi découplé du modèle API.

### Règles du slice

- **Immer est actif** (Redux Toolkit) : mute directement `state`, ne recopie pas.
- Toute mutation du draft met `status.isDirty = true`. C'est le signal de sauvegarde.
- Les reducers ne font pas de validation : ils appliquent un patch **déjà sanitizé**.
- Les patches passent par `sanitizeSurveyMetaPatch` / `sanitizeSurveyNodePatch`, qui
  tronquent aux `maxLength` de `config/`. Un champ absent du patch n'est pas touché —
  d'où les tests `!== undefined` systématiques, à conserver (`null` est une valeur
  légitime, `undefined` signifie « ne change rien »).
- La création de node passe **toujours** par une factory : elle génère le `NodeId`
  (`crypto.randomUUID()`) et initialise la config du type.
- Après tout ajout ou suppression, réindexe avec `reindexNodes` / `reindexPages` pour
  que `order` corresponde à l'index.

### Le module `tree/`

Fonctions pures, sans dépendance à Redux — c'est là que vivra la complexité quand le
drag & drop et l'imbrication arriveront, et c'est la cible prioritaire des tests Vitest.

| Fonction                           | Rôle                                                |
| ---------------------------------- | --------------------------------------------------- |
| `findNodeInTree(nodes, id)`        | Recherche récursive dans une liste d'enfants        |
| `findNodeInSurvey(pages, id)`      | Recherche dans tout le questionnaire, page comprise |
| `getPageContainingNode(pages, id)` | Page propriétaire d'un node                         |
| `findNodeParentInTree(nodes, id)`  | Tableau parent + index (pour splice)                |
| `removeNodeFromPages(pages, id)`   | Suppression + réindexation                          |
| `reindexNodes` / `reindexPages`    | Aligne `order` sur l'index                          |

Le parcours traite pages, nodes et sous-nodes uniformément : n'écris pas de cas
particulier pour les pages dans un nouveau helper.

### Composants de l'éditeur

Les composants lisent le state via `useAppSelector` + un sélecteur exporté, et
dispatchent via `useAppDispatch` (hooks typés de `@/store/hooks` — jamais
`useDispatch`/`useSelector` bruts).

L'inspector suit un pattern de routeur : `NodeSettingsRouter` aiguille sur `kind`,
puis `QuestionSettingsRouter` sur `type`. Ajouter un type de question =
ajouter un panneau dans `panels/` et une branche dans le routeur. Les panneaux se
composent à partir des champs atomiques de `fields/`, qui partagent la signature
`{ node, onPatch }` (`SurveyInspectorFieldProps`).

Certains fichiers sont des coquilles assumées (`NodeLogicPanel`,
`SettingsPanelDividerComponent` retournent `null` ou un placeholder) : ce sont les
points d'accroche de la logique conditionnelle à venir.

### Persistance — l'endpoint existe, le branchement reste à faire

L'éditeur ne sauvegarde toujours rien : `isDirty` ne déclenche aucune requête. C'est
l'objet de `P1-2`.

Le transport, lui, est en place (`P1-1`) :

- `PUT /api/surveys/[shortId]` — créateur et statut `draft` uniquement, corps validé
  par `UpdateSurveyBodySchema` (voir `shared/CLAUDE.md`) ;
- `surveysClient.updateSurvey(shortId, payload)` et le hook `useUpdateSurvey(shortId)`,
  qui invalide déjà `surveysQueryKeys.detail(shortId)` au succès.

Le corps attendu est le **draft complet**, pas un patch : `title`, `subtitle`,
`description` et `pages` sont tous requis. Un `SurveyDraft` s'y envoie tel quel, aux
optionnels près (`subtitle`/`description` sont `?: string` côté draft et `nullable`
côté contrat — passe `?? null`).

Reste donc à écrire : le debounce sur `isDirty`, l'indicateur de statut (`P1-3`), la
garde anti-perte (`P1-4`) et le traitement des échecs (`P1-5`).

Note `canEditSurvey` (`editor/lib/`) : l'édition exige `status === 'draft'`
**et** `createdBy === session.userId`. Cette règle est vérifiée côté client pour l'UI ;
elle devra l'être aussi côté serveur au moment du PUT.

## UI et design

### Design system

shadcn/ui, style `radix-vega`, base `neutral`, icônes lucide. Les primitives vivent dans
`components/ui/`. Ajoute-les via la CLI shadcn quand c'est possible, et ne les
personnalise que si nécessaire — elles doivent rester alignables sur l'upstream.

Certaines variantes sont extraites dans des fichiers dédiés
(`button-variants.tsx`, `badge-variants.tsx`, `tabs-variants.tsx`) pour satisfaire
`eslint-plugin-react-refresh`, qui interdit d'exporter autre chose que des composants
depuis un fichier de composant. Respecte ce découpage.

### Tokens et thème

Toutes les couleurs sont des variables CSS en **oklch**, définies dans
`styles/globals.css` pour `:root` et `.dark`. La primaire est un ambre/or.

N'écris **jamais** une couleur en dur (`#fff`, `bg-blue-500`). Utilise les tokens
sémantiques : `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`,
`border-border`, `bg-card`, `text-destructive`, `bg-primary`, `--chart-1..5`.

Le thème est géré par `next-themes` (`attribute="class"`, défaut système). Tout
composant doit rendre correctement en clair et en sombre — c'est automatique si tu
t'en tiens aux tokens.

Autres conventions visuelles observées : `strokeWidth={1.5}` sur les icônes lucide,
tailles en `size-4` / `size-8`, rayon dérivé de `--radius` (`rounded-lg`, `rounded-xl`).

Fusionne toujours les classes avec `cn()` (`@/lib/utils`) plutôt que par concaténation,
et laisse `prettier-plugin-tailwindcss` les trier.

### Layouts

Trois layouts dans `components/layouts/` : `root` (app connectée), `auth` (connexion),
`survey` (parcours de réponse). Une page choisit le sien via la propriété statique
`getLayout` ; `root` est le défaut.

```tsx
const LoginPage: NextPageWithLayout = () => {
  /* ... */
}

LoginPage.getLayout = page => <AuthLayout>{page}</AuthLayout>
LoginPage.public = true
```

`public = true` sort la page du `SessionGuard`. Sans ce flag, toute page est protégée :
`SessionGuard` redirige vers la connexion en conservant la destination dans `?redirect=`,
que `getSafeRedirectFromQuery` revalide (chemins internes uniquement) avant usage.
`_document.tsx` fixe `h-screen w-full overflow-hidden` sur le `body` — le scroll est
géré par les `ScrollArea` des layouts, pas par la page.

### Formulaires

react-hook-form + `zodResolver`, avec le schéma Zod **partagé** venant de
`shared/api/contracts/`. Le pattern en place utilise `<Controller>` et les primitives
`Field` :

```tsx
<Controller
  name="title"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="survey-title">
        {tForm('inputs.title.label')}
      </FieldLabel>
      <Input {...field} id="survey-title" aria-invalid={fieldState.invalid} />
      {fieldState.invalid && (
        <FieldError
          errors={translateFieldErrors(fieldState.error, tFormError)}
        />
      )}
    </Field>
  )}
/>
```

Toujours `noValidate` sur le `<form>` (la validation est la nôtre), `aria-invalid` sur
le champ, et les erreurs traduites via `translateFieldErrors` — les messages Zod sont
des clés i18n, pas du texte.

Les mutations sont appelées en `mutateAsync` dans un `try/catch`, avec un `toast.success`
ou `toast.error` traduit. Le bouton reçoit `isLoading={mutation.isPending}`.

### Animations

framer-motion, avec des objets `variants` déclarés dans le composant. Les valeurs en
usage : entrée `{ opacity: 0, y: -40 }` → `{ opacity: 1, y: 0 }` sur 0.5s pour un bloc,
transitions courtes (0.15–0.2s, `easeInOut`) pour les changements de contenu.
`AnimatePresence mode="wait"` pour les échanges de contenu, avec une `key` distincte.

Reste sobre : l'animation sert la lisibilité du changement, elle n'est pas décorative.

### Responsive

Hooks disponibles : `useIsMobile`, `useMediaQuery`, `useAutoResize` (`src/hooks/`).
L'inspector de l'éditeur bascule en `Drawer` (vaul) sur mobile et en panneau latéral sur
desktop — reprends ce pattern plutôt que de masquer du contenu.
