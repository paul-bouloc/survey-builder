# Roadmap — datum

Suivi du travail restant. Ce fichier est la **source de vérité sur l'avancement** : un
agent doit le lire avant de commencer une tâche, et cocher les cases qu'il termine dans
le même commit que le code.

Conventions : `[ ]` à faire, `[x]` terminé, `[~]` en cours ou partiel.
Une case ne se coche que lorsque la fonctionnalité est utilisable de bout en bout, pas
quand le code compile.

**Le déroulé à suivre pour traiter un ticket est décrit dans
[CLAUDE.md](CLAUDE.md#traiter-un-ticket-de-la-roadmap)** : choix du ticket, analyse de
l'existant, questions, validation du plan, implémentation, vérification. Lis-le avant de
démarrer.

Dernière revue complète de la codebase : 2026-09-19.

---

## Questions ouvertes

À trancher **avant** d'implémenter les tickets concernés. Un agent ne décide pas ces
points seul : il pose la question.

- **Cycle de vie après publication.** `canEditSurvey` exige `status === 'draft'`, donc
  publier verrouille l'édition définitivement. Faut-il une dépublication ? Une édition
  en place sur un questionnaire publié ? Un versioning pour ne pas corrompre les
  réponses déjà collectées ? Bloque les tickets de publication (phase 5).
- **Ordre des phases 3 et 5.** Construire d'abord le moteur de rendu et l'aperçu
  (phase 5) permettrait de voir le résultat de ce qu'on édite et validerait le modèle
  plus tôt, quitte à décaler l'édition fine des propriétés (phase 3).
- **Robustesse de l'authentification.** Saisir l'email d'un tiers suffit à se connecter
  à son compte. Acceptable en prototype, bloquant dès qu'il y a des données réelles.
  Lien magique par email ? Code à usage unique ? Décision de design, pas simple ajout
  de dépendance.
- **Anonymat des réponses.** Le modèle actuel exige un compte (`respondentUserId`
  requis). Si un questionnaire doit pouvoir être diffusé publiquement sans inscription,
  c'est une décision à prendre avant d'écrire le modèle `SurveyResponse` (phase 6).

---

## Phase 0 — Corrections avant de construire dessus

Des défauts qui feront échouer les phases suivantes s'ils ne sont pas traités d'abord.

- [ ] **Corriger `SessionResponseSchema`** — déclare `createdAt`/`updatedAt` en
      `z.date()`, validé côté serveur sur de vrais `Date`, mais le client reçoit des
      strings ISO typées `Date`. Toute utilisation comme date échoue.
      → `src/shared/api/contracts/auth/auth.schema.ts`
- [ ] **Corriger la validation `children` du `GroupNode`** — le schéma Mongoose impose
      `arr.length > 0` alors que la factory crée le groupe avec `children: []`. Dès que
      la sauvegarde existera, tout questionnaire contenant un groupe vide sera rejeté.
      → `src/server/models/nodes/group/group.node.schema.ts`
- [ ] **Uniformiser les mappers** — `getSurveyOverview` ne passe par aucun mapper,
      contrairement à `getSurvey` : les dates restent des strings et `formatDate` les
      reparse. Fonctionne par chance.
      → `src/features/surveys/common/api/surveys.client.ts`
- [ ] **Supprimer le fallback `JWT_SECRET`** — vaut
      `'your-secret-key-change-in-production'` si la variable est absente. Doit throw au
      démarrage comme `MONGODB_URI`.
      → `src/server/auth/jwt.ts`

## Phase 1 — Éditeur : persistance

L'éditeur perd tout au rechargement. C'est le blocage le plus grave : en l'état, c'est
une démo.

- [ ] **Endpoint `PUT /api/surveys/[shortId]`** — créateur + statut `draft` uniquement.
      Nécessite un schéma Zod récursif des nodes, qui remplacera les `z.any()` du
      contrat actuel.
- [ ] **Autosave debounced** — PUT du draft complet (meta + pages), branché sur
      `isDirty`, avec invalidation de `surveysQueryKeys.detail(shortId)`.
- [ ] **Statut de sauvegarde réel** — le header affiche du texte français en dur et le
      bouton « Enregistrer » est `disabled`.
      → `survey-editor-header.component.tsx`
- [ ] **Garde anti-perte** — confirmation avant de quitter avec des changements non
      sauvegardés.
- [ ] **Gestion des échecs de sauvegarde** — comportement si le PUT échoue, et si deux
      onglets éditent le même questionnaire.

## Phase 2 — Éditeur : manipulation des blocs

- [ ] **Réordonner les nodes** — drag & drop, reducer `moveNode`. `reindexNodes` existe
      déjà mais n'est appelé qu'à l'ajout/suppression.
- [ ] **Réordonner les pages** — reducer `movePage`.
- [ ] **Supprimer une page** — aucune UI n'existe : le header de page n'a qu'un bouton
      « Paramètres ». La clé i18n `pages.deletePage` est déjà écrite et inutilisée.
- [ ] **Dupliquer un node** — le bouton existe mais `onDuplicateClick` n'est jamais
      passé : cliquer ne fait rien. Prévoir la regénération récursive des `NodeId`.
- [ ] **Dupliquer une page**
- [ ] **Rendu récursif des enfants** — `page.children.map()` est plat : un `group`
      s'affiche mais ses enfants sont invisibles et inaccessibles.
      → `survey-editor-page-block.component.tsx`
- [ ] **Ajouter un node dans un group** — le bouton d'ajout n'existe qu'au niveau page.
- [ ] **Déplacer un node entre pages ou dans un group**

## Phase 3 — Éditeur : édition des propriétés

Le modèle définit une vingtaine de propriétés éditables ; **sept le sont réellement**.
C'est la phase la plus volumineuse de l'éditeur.

- [ ] **Options des questions à choix** — `radio`, `select` et `checkboxes` retournent
      `null`. Composant partagé d'édition d'options (label, value, description,
      disabled, réordonnancement). Ce sont les types les plus utilisés en pratique.
- [ ] **Branches manquantes du routeur** — `CHECKBOXES` et `DATE` n'ont aucun panneau.
      → `question-settings-router.component.tsx`
- [ ] **Champ `required`** — propriété de base d'une question, modélisée, jamais
      éditable.
- [ ] **`page.skippable`** — modélisé, clé i18n écrite, aucune UI.
- [ ] **Sous-titre et description sur tous les panneaux** — seuls `text` et `textarea`
      les exposent.
- [ ] **Panneau `group`** — `group.title` et `group.description` (distincts du titre du
      node) ne sont pas éditables.
- [ ] **Panneau `info`** — type d'alerte (info/warning/error/success/neutral), titre et
      description : rien n'est éditable.
- [ ] **Configs avancées par type** — `text` (maxLength, minLength, pattern),
      `textarea` (rows), `number` (integer, unit), `date` (min, max), `checkboxes`
      (minChecked, maxChecked, layout), `scale` (labels), `radio`/`select` (layout,
      searchable), et `commit` sur tous les types.
- [ ] **Champ `code`** — identifiant stable destiné au reporting, modélisé et non
      exposé.
- [ ] **Onglet « Logique »** — `NodeLogicPanel` retourne `<div>Logic</div>`. Éditeur de
      conditions et de triggers : c'est la partie la plus riche du modèle et elle est à
      0 % côté UI. Gros morceau, probablement à découper.

## Phase 4 — Éditeur : confort

- [ ] **Sidebar** — c'est littéralement `<div>Sidebar</div>`. Plan du questionnaire,
      navigation, réordonnancement des pages.
- [ ] **Undo / redo** — absent, alors que Redux le rend accessible.
- [ ] **Raccourcis clavier** — aucun listener dans tout l'éditeur.
- [ ] **Confirmation de suppression** — un node se supprime sans avertissement ni
      annulation possible.
- [ ] **Navigation clavier entre blocs** — sélection au clavier seulement partielle.
- [ ] **Validation en direct** — signaler les blocs incomplets (choix sans options,
      titre vide) avant d'arriver à la publication.
- [ ] **États vides** — un questionnaire sans page n'offre aucun guidage.

## Phase 5 — Aperçu et publication

- [ ] **Moteur de rendu des questions** — un composant par type (8 types), partagé
      entre l'aperçu et le parcours réel. Brique centrale du produit, rien n'existe.
- [ ] **Page `/preview`** — placeholder. Aperçu fidèle sans persistance, accessible
      depuis l'éditeur.
- [ ] **Bascule aperçu desktop / mobile** — un questionnaire se remplit surtout au
      téléphone.
- [ ] **Validation avant publication** — titre requis, au moins une page non vide,
      options non vides sur les questions à choix.
- [ ] **Endpoints publish / archive / republish** — trois TODO dans l'overview, boutons
      `disabled`. ⚠️ Dépend de la question ouverte sur le cycle de vie.
      → `survey-overview-header.component.tsx`

## Phase 6 — Répondre

- [ ] **Modèle `SurveyResponse`** — schéma Mongoose (le type existe déjà), index unique
      `(surveyId, respondentUserId)`.
- [ ] **Moteur d'évaluation** — conditions, triggers, actions. Dans `src/shared/`, sans
      dépendance au DOM ni à Mongoose : exécuté côté client pour l'UX puis rejoué côté
      serveur à chaque commit. À couvrir de tests.
- [ ] **Parcours `/run/[surveyShortId]`** — rendu des pages, navigation, validation,
      reprise via `currentPageId`.
- [ ] **API de réponse** — création/reprise, commit d'étape (écrase `answers`),
      soumission (`completed` + `completedAt`), revalidation serveur, incrément de
      `responseCount`.
- [ ] **Page de fin `/run/[surveyShortId]/done`**
- [ ] **Restreindre `find-one`** — la route est volontairement ouverte à tout
      utilisateur connecté (c'est la route de consultation pour répondre), mais elle
      expose aussi les questionnaires en `draft` à qui devine le `shortId`.
- [ ] **Questionnaire archivé ou dépublié** — comportement côté répondant.

## Phase 7 — Exploiter les réponses

- [ ] **Dé-mocker l'overview** — `completedCount`, `inProgressCount`, `completionRate`,
      `weeklyData` et `questionCount` sont codés à `99`.
      → `src/server/api/routes/surveys/find-one-overview.get.ts`
- [ ] **Onglet « Répondus »** — `mockResponses` en dur et `respondedSurveys` toujours
      vide ; l'endpoint correspondant n'existe pas.
      → `src/pages/index.tsx`
- [ ] **Liste `/results`** — tableau, filtres par statut, pagination.
- [ ] **Détail `/results/[responseShortId]`**
- [ ] **Analytics `/analytics`** — agrégats par question selon le type (répartition pour
      les choix, distribution pour les échelles). recharts est déjà installé.
- [ ] **Export CSV** — bouton présent et `disabled`.

## Phase 8 — Reste

- [ ] **Suppression d'un questionnaire** — aucun endpoint `DELETE`.
- [ ] **Partage** — bouton `share` de l'overview en TODO.
- [ ] **Tests Vitest** — aucun runner installé. Cibles prioritaires :
      `editor/state/tree/`, les sanitizers, les mappers, puis le moteur d'évaluation.
- [ ] **i18n** — namespaces `surveys.questions`, `surveys.analytics` et `surveys.run`
      vides ; textes en dur dans le header de l'éditeur et les onglets de l'inspector.
- [ ] **Lint** — 120 erreurs Prettier préexistantes dans 6 primitives `components/ui/`
      (guillemets doubles, classes Tailwind non triées), telles qu'installées par la CLI
      shadcn.
- [ ] **README** — encore le boilerplate `create-next-app` ; `README copy.md` à
      supprimer.

---

## Ce qui est déjà solide

À ne pas refaire, et à réutiliser comme référence de style :

- **Modèle de données** — arbre récursif polymorphe, conditions/triggers/actions
  entièrement typés, discriminators Mongoose alignés sur les types TS. La partie la plus
  aboutie du projet.
- **Infrastructure API** — `createEndpoint` gère validation Zod, auth, connexion DB et
  normalisation des erreurs de façon déclarative.
- **Authentification** — JWT en cookie httpOnly, `SessionGuard` côté client, redirection
  avec `?redirect=` revalidé.
- **i18n** — fr/en en parité stricte, vérifiée par typage (`satisfies typeof
frMessages`).
- **Design system** — shadcn/Tailwind v4, tokens oklch, thème clair/sombre.
- **Architecture de l'éditeur** — découpage `state/tree/selectors/factories/sanitizers`
  propre et testable ; canvas, meta-block, inspector avec Drawer mobile et palette cmdk.
