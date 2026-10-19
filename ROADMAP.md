# Roadmap — datum

Suivi du travail restant. Ce fichier est la **source de vérité sur l'avancement** : un
agent doit le lire avant de commencer une tâche, et cocher les cases qu'il termine dans
le même commit que le code.

Conventions : `[ ]` à faire, `[x]` terminé, `[~]` en cours ou partiel.
Une case ne se coche que lorsque la fonctionnalité est utilisable de bout en bout, pas
quand le code compile.

Chaque ticket porte un identifiant `P<phase>-<n>` (`P0-1`, `P3-7`…) à citer dans les
discussions et les messages de commit. **Les identifiants sont figés** : un numéro reste
attaché à son ticket à vie, n'est jamais réutilisé, et un ticket ajouté plus tard prend
le numéro suivant de sa phase même s'il est inséré au milieu. Ne renumérote donc jamais
une phase — une référence dans un vieux commit doit rester valide.

**Le déroulé à suivre pour traiter un ticket est décrit dans
[CLAUDE.md**](CLAUDE.md#traiter-un-ticket-de-la-roadmap) : choix du ticket, analyse de
l'existant, questions, validation du plan, implémentation, vérification. Lis-le avant de
démarrer.

Dernière revue complète de la codebase : 2026-09-19.
**Refonte du design en cours.** Les maquettes arrivent écran par écran et sont intégrées
au fil de l'eau ; les phases concernées portent la mention « maquette v2 » et un lien
vers leur référence. Déjà intégrées à partir de
[Éditeur Questionnaire v2](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Editeur+Questionnaire+v2.dc.html) :
la **phase 1.5** (chrome de l'app : header global, menu utilisateur, header de page) et
la **phase 2.5** (contenu de l'éditeur). D'autres écrans suivront — attends-toi à voir
apparaître de nouvelles phases `X.5`.

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
- **Répondre sans compte.** À ne pas confondre avec l'interrupteur « réponses
  anonymes » (`P4.6-6`), qui est tranché : le compte reste exigé, seule l'identité est
  masquée à l'affichage. La question ici est différente — un questionnaire doit-il
  pouvoir être rempli par quelqu'un qui n'a pas de compte du tout ? Cela rendrait
  `respondentUserId` optionnel et changerait le modèle `SurveyResponse` (phase 6).
- **Seuil d'abandon par défaut.** La règle est tranchée (voir « Décisions produit »), mais
  la valeur par défaut du seuil ne l'est pas : 24 h ? 7 jours ? Elle conditionne le taux
  de complétion affiché partout. À fixer en implémentant `P6-1`.
- **Tracking des ouvertures du lien public.** L'entonnoir de la page de statistiques
  démarre à « Lien ouvert », ce qui suppose de journaliser les consultations. Que
  stocke-t-on — un simple compteur, un horodatage, quelque chose d'identifiant ? Pendant
  combien de temps ? Le faire porte des obligations RGPD que le reste du produit n'a pas
  aujourd'hui. Bloque `P7.5-7`, et l'entonnoir démarre à « Commencé » sans lui.

---

## Décisions produit

Tranchées, et transverses à plusieurs tickets. Ne les remets pas en cause sans en
reparler ; les décisions purement techniques vivent dans
[CLAUDE.md](CLAUDE.md#décisions-darchitecture-prises).

### Ce qu'est une réponse abandonnée

`ResponseStatus` garde **deux états persistés** : `in_progress` et `completed`. L'abandon
n'en est pas un troisième — c'est une **lecture** d'une réponse `in_progress` restée
inactive au-delà d'un seuil :

- **Dérivé, jamais stocké.** Le statut d'abandon se calcule à la lecture, à partir de
  `updatedAt`. Aucun job de fond, aucun champ supplémentaire sur `SurveyResponse`, et
  surtout : changer la règle plus tard ne demande aucune migration.
- **Le seuil est réglable par questionnaire**, donc porté par un champ sur `Survey`. Un
  sondage de deux minutes et un dossier d'admission n'ont pas le même rythme ; un seuil
  global les traiterait mal tous les deux. Le réglage devra apparaître dans l'éditeur.
- **Conséquence à retenir** : une réponse abandonnée peut « redevenir » en cours si le
  répondant revient. C'est voulu — rien ne ferme définitivement une réponse tant qu'elle
  n'est pas soumise.

Concerne `P0.5-5`, `P6-1`, `P7-7`, `P7.5-4` et `P7.5-9`. La **valeur par défaut** du
seuil reste à fixer (voir « Questions ouvertes »).

### Le responsive fait partie de chaque écran

**Toutes les maquettes v2 sont responsive.** Ce n'est donc pas une finition à repasser
plus tard : un écran n'est pas terminé s'il ne tient que sur un grand écran. Un ticket
d'UI inclut son adaptation, sans qu'elle ait besoin d'être répétée à chaque ligne.

Les maquettes emploient trois techniques, à reprendre telles quelles :

- **Espacements et tailles fluides** — `clamp()` sur les marges, les écarts et les
  titres, plutôt que des paliers. C'est le gros du travail et ça ne demande aucune
  logique.
- **Grilles qui se replient seules** — `repeat(auto-fit, minmax(min(150px,100%),1fr))`.
  Le `min(...,100%)` est ce qui évite le débordement sur très petit écran.
- **Adaptations structurelles**, pilotées par un état de largeur : un panneau qui passe
  en colonne unique, une liste latérale qui devient statique, des libellés raccourcis ou
  masqués, un ordre d'éléments modifié.

**Les breakpoints sont ceux de Tailwind** (`sm` 640, `md` 768, `lg` 1024), même là où
les maquettes utilisent des valeurs voisines (720, 900, 980) : le projet est déjà en
Tailwind, et une seconde échelle parallèle serait une source d'incohérence durable.
Adapter légèrement le seuil est sans conséquence visible.

Deux points à surveiller, parce qu'ils vont au-delà du style :

- certaines adaptations **changent ce qui est affiché**, pas seulement sa taille — le
  graphique de l'overview masque les totaux et resserre ses barres en petite largeur ;
- un écran construit autour d'un **split** (réponses, paramètres) doit prévoir dès le
  départ son repli en colonne unique : le rajouter après revient à refaire le layout.

---

## Phase 0 — Corrections avant de construire dessus

Des défauts qui feront échouer les phases suivantes s'ils ne sont pas traités d'abord.

- [x] `P0-1` **Corriger** `SessionResponseSchema` — déclare `createdAt`/`updatedAt` en
      `z.date()`, validé côté serveur sur de vrais `Date`, mais le client reçoit des
      strings ISO typées `Date`. Toute utilisation comme date échoue.
      → `src/shared/api/contracts/auth/auth.schema.ts`
- [x] `P0-2` **Corriger la validation** `children` **du** `GroupNode` — le schéma Mongoose impose
      `arr.length > 0` alors que la factory crée le groupe avec `children: []`. Dès que
      la sauvegarde existera, tout questionnaire contenant un groupe vide sera rejeté.
      → `src/server/models/nodes/group/group.node.schema.ts`
- [x] `P0-3` **Uniformiser les mappers** — `getSurveyOverview` ne passe par aucun mapper,
      contrairement à `getSurvey` : les dates restent des strings et `formatDate` les
      reparse. Fonctionne par chance.
      → `src/features/surveys/common/api/surveys.client.ts`
- [x] `P0-4` **Valider les variables d'environnement avec Zod** — le fallback
      `JWT_SECRET` (`'your-secret-key-change-in-production'`) est supprimé au profit de
      deux schémas : `src/server/config/env.ts` (serveur, `JWT_SECRET` en 32 caractères
      minimum) et `src/shared/config/env.client.ts` (variables `NEXT_PUBLIC_*`). Les deux
      throw au démarrage avec le détail des champs fautifs.
      → `src/server/config/env.ts`, `src/shared/config/env.client.ts`

## Phase 0.4 — Authentification (maquette v2)

Refonte complète de l'authentification. Référence :
[Authentification](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Authentification.dc.html).

Aujourd'hui **saisir l'e-mail d'un tiers suffit à se connecter à son compte** : il n'y a
aucun secret. C'est acceptable en prototype, bloquant dès qu'il y a des données réelles —
et toute la roadmap suppose des comptes qui tiennent (organisations, rôles, réponses
nominatives). D'où le placement ici, avant le reste.

Six écrans dans un gabarit commun : `login`, `signup`, `forgot`, `sent`, `reset`, `done`.
Structure et interactions, **pas les couleurs brutes**.

Remplace `P8-10`.

- [ ] `P0.4-1` **Modèle et politique de mot de passe** — champ de hachage sur `User`,
      choix de la dépendance (`bcryptjs` a été retiré du projet, aucun usage), et la
      politique annoncée par la maquette : **12 caractères minimum, une majuscule et un
      chiffre**. La règle est partagée client/serveur comme les autres policies Zod.
- [ ] `P0.4-2` **Migration des comptes existants** — les comptes créés sans secret
      doivent pouvoir en définir un. Décider du parcours : e-mail de définition au
      premier retour, ou réutilisation du flux « mot de passe oublié ». À traiter avec
      `P0.4-1`, pas après.
- [ ] `P0.4-3` **Gabarit des écrans d'authentification** — deux colonnes : panneau de
      gauche fixe (logo, accroche, arguments produit, liens légaux) et panneau de droite
      variable (kicker, titre, sous-titre, champs, CTA, pied de navigation). Les six
      écrans le partagent : le construire une fois.
- [ ] `P0.4-4` **Écran de connexion** — e-mail, mot de passe avec bascule d'affichage,
      lien « Oublié ? », et lien vers l'inscription. Remplace l'`AuthForm` actuel.
- [ ] `P0.4-5` **Écran d'inscription** — **prénom et nom séparés** (`User` n'a qu'un
      champ `name` : le découper fait partie de ce ticket, et règle le point soulevé en
      `P4.8-2`), e-mail, mot de passe, et acceptation obligatoire des CGU et de la
      politique de confidentialité.
- [ ] `P0.4-6` **Jauge de robustesse du mot de passe** — quatre niveaux calculés depuis
      la longueur, la casse, les chiffres et les caractères spéciaux, avec un libellé
      explicite. Affichée à l'inscription et à la réinitialisation.
- [ ] `P0.4-7` **Mot de passe oublié** — écran de saisie de l'e-mail puis écran de
      confirmation (« lien valable 30 minutes »), avec possibilité de renvoyer le lien.
      **Ne jamais révéler si l'adresse existe** : le message de confirmation est le même
      dans tous les cas.
- [ ] `P0.4-8` **Jeton de réinitialisation** — génération, stockage haché, expiration
      courte, usage unique. L'écran de réinitialisation affiche le temps restant.
- [ ] `P0.4-9` **Écran de réinitialisation** — nouveau mot de passe et confirmation, avec
      comparaison en direct des deux champs, puis écran de succès.
- [ ] `P0.4-10` **Invalidation des sessions** — après un changement de mot de passe, les
      JWT émis avant doivent cesser d'être valables (l'écran final le promet). Un JWT est
      aujourd'hui valable jusqu'à expiration, sans révocation possible : prévoir par
      exemple un compteur de version sur l'utilisateur, vérifié dans `requireAuth`.
- [ ] `P0.4-11` **Envoi d'e-mails** — aucune brique d'envoi n'existe dans le projet. Le
      flux de réinitialisation en dépend entièrement, et les invitations (`P4.7-6`,
      `P4.8-11`) en auront besoin aussi. Choisir le service et poser l'abstraction ici.
- [ ] `P0.4-12` **Connexion Google (OAuth)** — bouton présent sur la connexion et
      l'inscription dans la maquette. À livrer **après** l'auth par mot de passe : le
      bouton reste masqué d'ici là. Points à trancher dans le ticket : liaison avec un
      compte existant de même adresse, et comportement si le compte n'a pas de mot de
      passe.

### Écarts assumés avec la maquette

- Les liens **Confidentialité** et **Support** du panneau de gauche, ainsi que les CGU
  et la politique de confidentialité de l'inscription, pointent vers des pages qui
  n'existent pas. À créer ou à retirer avant toute mise en ligne réelle.

## Phase 0.5 — Refonte de l'accueil (maquette v2)

Page d'accueil (`/`) : listes des questionnaires créés et répondus, avec leurs états
vides. Référence :
[Accueil Questionnaires](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Accueil+Questionnaires.dc.html).

Même principe que les autres phases de refonte : structure et interactions, **pas les
couleurs brutes**.

⚠️ **Le header global vient de la phase 1.5**, qui est numérotée après celle-ci. Les deux
phases sont indépendantes (l'une fait le chrome, l'autre le contenu), mais l'accueil ne
sera cohérent visuellement qu'une fois `P1.5-1` livré. Faire la 1.5 d'abord est
défendable — signale-le plutôt que de dupliquer la navbar actuelle.

- [ ] `P0.5-1` **Layout et en-tête** — largeur 1080px, en-tête avec titre, note
      contextuelle (elle change selon l'onglet), sélecteur de tri et CTA principal
      (`Nouveau questionnaire` / `Ouvrir un questionnaire`).
- [ ] `P0.5-2` **Onglets Créés / Invitations / Répondus** — onglets soulignés avec
      compteur par onglet. Remplace `SurveysTabs`, aujourd'hui en `TabsList` pleine
      largeur. L'onglet `Invitations` est ajouté par la maquette mise à jour ; son
      contenu est en `P0.5-12`.
- [ ] `P0.5-3` **Filtres par statut** — segmented control `Tous` / `Publiés` /
      `Brouillons` / `Archivés` avec compteurs, visible sur le seul onglet Créés.
- [ ] `P0.5-4` **Ligne de questionnaire créé** — format horizontal dense qui remplace
      `SurveyCard` : badge glyphe coloré par statut, titre + badge d'état, sous-titre
      contextuel selon le statut, métrique de réponses à droite, actions `↗` et `⋯`,
      et un pied de ligne (`#CODE`, méta, date de modification).
- [ ] `P0.5-5` **Ligne de questionnaire répondu** — même ossature, contenu différent :
      propriétaire (`Envoyé par …`), barre de progression, et CTA `Continuer` /
      `Voir mes réponses`. Remplace `RespondedSurveyCard`.
      ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`) et de `P7-2`.
- [ ] `P0.5-6` **États vides** — un par onglet, soit **trois** depuis l'ajout des
      invitations (titre, note, CTA, hint), plus une variante distincte quand c'est un
      **filtre** qui ne renvoie rien (« Aucun questionnaire ne correspond au filtre X »).
      Remplace les `Empty` actuels des deux listes.
- [ ] `P0.5-7` **Affichage du** `shortId` **en majuscules** — `generateShortId` produit des
      minuscules et **le stockage ne change pas** : seul l'affichage passe en
      majuscules, plus lisible pour un code à recopier. Vérifier tous les points
      d'affichage (lignes, overview, cartes) et la copie dans le presse-papier.
- [ ] `P0.5-8` **Rejoindre un questionnaire par son code** — champ de saisie à
      6 caractères, en ligne sous la liste des répondus et dans son état vide. Le code
      **est le `shortId`** : il suffit de le résoudre et de rediriger vers la page de
      réponse. Saisie insensible à la casse. Prévoir le cas « code introuvable ».
      ⚠️ La cible `/run/[surveyShortId]` n'existe qu'en phase 6.
- [ ] `P0.5-9` **Compteurs par questionnaire** — `12 blocs · 2 pages · 7 règles` dans le
      pied de ligne. Le contrat de liste renvoie déjà `pages` en entier : les compteurs
      sont calculables côté client, sans extension serveur. Mutualiser le calcul avec
      celui de la card méta de l'éditeur (`P2.5-3`).
- [ ] `P0.5-10` **Sparkline des réponses récentes** — mini-graphique par ligne sur les
      questionnaires publiés. Demande une agrégation temporelle par questionnaire, que
      l'endpoint de liste ne fournit pas. ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`).
- [ ] `P0.5-11` **Tri de la liste** — le sélecteur change de libellé selon l'onglet
      (`Récemment modifiés` / `Échéance la plus proche` / `Plus récents`) mais n'est pas
      câblé dans la maquette. Définir les critères disponibles par onglet et les
      appliquer.
- [ ] `P0.5-12` **Onglet « Invitations »** — les questionnaires auxquels l'utilisateur a
      été invité et **qu'il n'a pas encore ouverts**. Ligne dédiée : badge `✉`, état
      `à faire` quand l'échéance approche ou `invitation` sinon, propriétaire, durée
      estimée comme métrique, méta `n questions · échéance`, et un CTA `Commencer`.
      L'échéance affichée est la **date de fermeture du questionnaire** (`P4.6-9`) :
      aucun champ propre à l'invitation. « Sans date limite » correspond au mode de
      fermeture manuelle.
      Une invitation **se consomme** : dès que la réponse est commencée, la ligne quitte
      cet onglet pour « Répondus ». L'onglet liste donc les invitations sans
      `SurveyResponse` associée.
      ⚠️ Dépend du mécanisme d'invitations (`P4.7-6`) et de `P6-1`.
- [ ] `P0.5-15` **Modale de création d'un questionnaire** — remplace la page
      `/survey/new` : titre (obligatoire, validé à la soumission), description
      facultative, et **choix de l'espace** (organisation ou espace personnel). CTA
      « Créer et ouvrir l'éditeur », mention « créé en brouillon ».
      Ouverte depuis quatre entrées : le bouton du header, le CTA principal, la ligne
      pointillée en fin de liste et le raccourci `N`. Fermeture par `Échap`.
      Réutilise `CreateSurveyForm`, qui devient le contenu de la modale.
      ⚠️ Le sélecteur d'espace dépend de `P4.7-1`.
- [ ] `P0.5-16` **Adaptations responsive propres à l'accueil** — en petite largeur, le
      logo, le libellé « Rechercher », la méta de ligne et la sparkline sont masqués, et
      les filtres passent en défilement horizontal. Le reste suit la règle commune (voir
      « Décisions produit ») et n'a pas à être détaillé ici.
- [ ] `P0.5-13` **Durée estimée d'un questionnaire** — heuristique calculée depuis la
      structure : nombre et type de questions (un texte long coûte plus qu'un choix
      unique). Ne dépend d'aucune réponse, donc livrable tôt. Affichée sur la ligne
      d'invitation, et réutilisable ailleurs (page de réponse, aperçu).
      À ne pas confondre avec la **durée médiane observée** (`P4.5-10`), qui mesure le
      réel une fois les réponses collectées.

### Écarts assumés avec la maquette

- **Pas de sélecteur de workspace** : l'en-tête affiche « Espace atelier-dupont » dans
  la maquette ; il n'existe aucune notion d'espace (voir phase 1.5).

## Phase 1 — Éditeur : persistance

L'éditeur perd tout au rechargement. C'est le blocage le plus grave : en l'état, c'est
une démo.

- [x] `P1-1` **Endpoint** `PUT /api/surveys/[shortId]` — créateur + statut `draft` uniquement.
      Le schéma Zod récursif des nodes vit dans
      `src/shared/api/contracts/surveys/node.schema.ts` et valide le corps du PUT.
      Il est volontairement permissif sur la complétude métier (options vides,
      titres vides) : c'est un brouillon. Les `z.any()` de `SurveySchema` (schéma
      de **réponse**) sont laissés en place, voir `P8-7`.
- [x] `P1-2` **Autosave debounced** — PUT du draft complet (meta + pages) 2 s après la
      dernière modification, via `useSurveyEditorAutosave`. Le draft n'est chargé
      qu'une fois par `shortId` : sans cela, le refetch déclenché par l'invalidation
      de `surveysQueryKeys.detail(shortId)` réécraserait les frappes en cours.
      Un titre vide suspend l'envoi (le PUT le refuse) sans perdre les changements.
- [x] `P1-3` **Statut de sauvegarde réel** — `status.saveStatus` dans le slice, affiché
      dans le header : non enregistré / en cours (avec spinner) / enregistré, ce
      dernier daté par `formatSavedAt`. Le bouton « Enregistrer » a été supprimé —
      l'autosave est le seul chemin d'écriture.
      → `survey-editor-header.component.tsx`
- [x] `P1-4` **Garde anti-perte** — **abandonné, ne pas reprendre.** Avec l'autosave
      debounced à 2 s, la fenêtre de perte est trop étroite pour justifier une
      confirmation au départ : le coût pour l'utilisateur (un dialogue, ou la boîte
      native du navigateur) dépasse le risque couvert. Une implémentation a été écrite
      puis retirée — elle achoppait de toute façon sur le cas nominal, la sauvegarde
      déclenchée au départ n'étant pas garantie d'aboutir après le démontage de la page.
      Le cas où le PUT échoue est traité par le retry de `P1-5`. Reste le titre vide,
      qui suspend l'envoi sans rien perdre : c'est le meta-block qui le signale.
- [x] `P1-5` **Gestion des échecs de sauvegarde** — retry automatique avec backoff
      exponentiel dans `useSurveyEditorAutosave` : 5 réessais (1/2/4/8/16 s, avec jitter),
      uniquement sur erreur transitoire — panne de transport ou 5xx, via
      `isRetriableApiError`. Un 4xx est la réponse délibérée du serveur à ce corps-là :
      le rejouer redonnerait la même erreur, le statut passe donc directement à `error`.
      Le statut reste `saving` pendant la séquence ; `error` n'apparaît qu'une fois les
      réessais épuisés. Une modification pendant la séquence l'annule et repart du délai
      le plus court. Le verrou « une requête en vol » est libéré au démontage et au
      changement de `shortId` — hors ligne, React Query met la mutation en pause plutôt
      que de la rejeter, et le verrou serait resté fermé à vie ; les retours tardifs sont
      périmés par `generationRef`.
      **La gestion multi-onglets est explicitement abandonnée** : détection de version
      côté serveur et stratégie de résolution, hors de proportion pour un projet à un
      seul éditeur. À rouvrir sous un nouveau numéro si le besoin apparaît.

## Phase 1.5 — Chrome de l'application (maquette v2)

Refonte du cadre commun à tous les écrans : **header global** et **menu utilisateur**,
plus le **header de page** contextuel. Référence :
[Éditeur Questionnaire v2](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Editeur+Questionnaire+v2.dc.html),
qui les montre dans le contexte de l'éditeur.

Comme pour la phase 2.5 : on reprend la structure et les interactions, **pas les couleurs
brutes** — tout passe par les tokens sémantiques pour préserver le thème clair/sombre.

Le **header global s'applique à toute l'application** (il remplace `RootNavbar` et
`SurveyNavbar`). Le **header de page** est construit ici pour l'éditeur, et sera décliné
sur les autres écrans au fil des maquettes à venir.

- [ ] `P1.5-1` **Header global** — barre sticky : logo + « datum », puis à droite les
      actions (Accueil, Nouveau formulaire) et le menu utilisateur. Remplace
      `RootNavbar` et `SurveyNavbar`, qui divergent aujourd'hui pour rien.
      → `src/components/layouts/`
- [ ] `P1.5-2` **Menu utilisateur** — avatar à initiales dans le header, et panneau
      déroulant : en-tête (initiales, nom, email), réglages en segmented controls
      (thème clair/sombre, langue FR/EN), « Paramètres du compte », « Aide &
      raccourcis », Déconnexion. Le composant `SegmentedControl` existe déjà.
      → `src/components/layouts/user-menu.component.tsx`
- [ ] `P1.5-3` **Header de page contextuel** — barre sticky sous le header global :
      bouton retour, fil d'Ariane (`Questionnaires / Aperçu / <titre>`), statut de
      sauvegarde avec pastille, zone d'actions à droite. Composant générique, décliné
      par écran. L'affichage du statut de sauvegarde existe déjà (`P1-3`,
      `SurveyEditorHeaderComponent`) : il **déménage** ici, il n'est pas à réécrire.
- [ ] `P1.5-4` **Header de page de l'éditeur** — l'instancie avec ses actions propres :
      onglets `Structure` / `Réponses`, repli global des règles, accès aux
      **`Paramètres`** du questionnaire (phase 4.6), bouton `Publier` — qui **ouvre la
      modale de publication** (`P5-6`) plutôt que de publier directement.
      Les onglets sont de la **navigation** entre pages existantes (`/edit` et
      `/results`), pas une bascule interne. Le bouton `Publier` dépend de la phase 5 :
      le câbler ou le laisser désactivé selon l'avancement.
      Recouvre `P2.5-2` (barre d'actions), dont les boutons remontent ici.
- [ ] `P1.5-5` **Pages « Paramètres du compte » et « Aide & raccourcis »** — les deux
      entrées du menu utilisateur ne pointent nulle part. Décider de leur contenu
      (l'utilisateur n'a aujourd'hui que `name` et `email`) ou retirer les entrées.
- [ ] `P1.5-6` **Recherche globale** `⌘K` — champ dans le header : chercher un
      questionnaire par titre ou `shortId`. cmdk est déjà installé (palette d'ajout de
      blocs). Endpoint de recherche à prévoir.

### Écarts assumés avec la maquette

- **Pas de sélecteur de workspace** (`atelier-dupont` dans la maquette) : il n'existe ni
  organisation, ni équipe, ni appartenance dans le modèle. À rouvrir si le
  multi-utilisateur devient une direction produit.
- **Pas de badge** `PRO` : aucune notion de plan ou d'abonnement, et en inventer une
  serait prématuré.

## Phase 2 — Éditeur : manipulation des blocs

- [ ] `P2-1` **Réordonner les nodes** — drag & drop, reducer `moveNode`. `reindexNodes` existe
      déjà mais n'est appelé qu'à l'ajout/suppression.
- [ ] `P2-2` **Réordonner les pages** — reducer `movePage`.
- [ ] `P2-3` **Supprimer une page** — ~~recouvert par~~ `P2.5-4` : l'action arrive avec le
      nouvel en-tête de page. Ne pas traiter séparément.
- [ ] `P2-4` **Dupliquer un node** — le bouton existe mais `onDuplicateClick` n'est jamais
      passé : cliquer ne fait rien. Prévoir la regénération récursive des `NodeId`.
- [ ] `P2-5` **Dupliquer une page**
- [ ] `P2-6` **Rendu récursif des enfants** — ~~recouvert par~~ `P2.5-7`, qui en donne la
      forme visuelle (indentation, connecteurs). Ne pas traiter séparément.
- [ ] `P2-7` **Ajouter un node dans un group** — ~~recouvert par~~ `P2.5-7` (ligne
      « Ajouter dans le groupe »). Ne pas traiter séparément.
- [ ] `P2-8` **Déplacer un node entre pages ou dans un group**

## Phase 2.5 — Refonte de l'éditeur (maquette v2)

Refonte structurelle : **les deux panneaux latéraux disparaissent** (sidebar et
inspector) et tout devient éditable en ligne, dans la card du bloc. Référence :
[Éditeur Questionnaire v2](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Editeur+Questionnaire+v2.dc.html).

La maquette est une intention, pas un pixel à reproduire. **On en reprend la structure,
l'anatomie des cards et les interactions — pas les couleurs brutes** : tout passe par nos
tokens sémantiques existants (`bg-card`, `text-muted-foreground`, `border-border`…) pour
que le thème clair/sombre continue de fonctionner. Les ajustements se font en cours de
développement.

Cette phase précède la phase 3 : elle installe le contenant, la phase 3 remplit les
champs.

- [ ] `P2.5-1` **Layout une colonne** — supprimer `SurveyEditorSidebarComponent` et
      `SurveyEditorInspectorComponent` de la page d'édition, passer le canvas en colonne
      unique centrée (~880px). Le `Drawer` mobile de l'inspector disparaît avec lui.
      → `src/pages/survey/[surveyShortId]/edit.tsx`
- [ ] `P2.5-2` **Barre d'actions de l'éditeur** — ~~recouvert par~~ `P1.5-4` : dans la
      maquette à jour, le repli des règles et les actions sont remontés dans le header
      de page. Il ne reste au-dessus de la card méta qu'un libellé « Formulaire » suivi
      d'un filet — à traiter avec `P2.5-3`.
- [ ] `P2.5-3` **Card méta du questionnaire** — titre, sous-titre et description
      éditables en ligne, plus un bandeau « Réf. » en pied de card avec le `shortId`
      **en lecture seule**, les compteurs (blocs, règles, pages) et la date de création.
      Le statut du questionnaire n'y est plus : il vit dans le header de page.
      Remplace `SurveyEditorMetaBlock`.
- [ ] `P2.5-4` **En-tête de page en pilule** — numéro, titre éditable, compteur de blocs,
      et action « Supprimer la page » (recouvre `P2-3`, à traiter ici).
      → `survey-editor-page-header.component.tsx`
- [ ] `P2.5-5` **Anatomie de la card de bloc** — poignée de drag, badge coloré par type,
      intitulé et description éditables en ligne, badges d'état (`requis`, `n enfants`),
      actions `dupliquer` / `ajouter un enfant` / `supprimer`. Remplace
      `SurveyEditorNodeBlock` et `SurveyEditorNodeKindBadge`.
- [ ] `P2.5-6` **Variante** `divider` — card réduite à une seule ligne (glyphe, libellé
      « séparateur », trait, actions), sans bandeaux.
- [ ] `P2.5-7` **Imbrication visuelle** — indentation par niveau avec connecteurs en L,
      card plus discrète et badge plus petit en profondeur, ligne « Ajouter dans le
      groupe » sous chaque groupe. Recouvre `P2-6` et `P2-7`.
- [ ] `P2.5-8` **Bandeau « Paramètres »** — pied de card, chips `label + input` ou
      `label + select` selon le type, et interrupteurs (`obligatoire`, `lecture seule`).
      C'est le contenant ; le détail par type est en phase 3.
- [ ] `P2.5-9` **Bandeau « Règles »** — pied de card, phrases éditables en ligne :
      `Si <champ> <opérateur> <valeur> → afficher ce bloc`,
      `Quand la réponse <opérateur> <valeur> → <action>`, et `Pose <flag>`.
      Remplace l'onglet « Logique » ; recouvre `P3-10`, qui n'avait aucune UI.
- [ ] `P2.5-10` **Bandeau « Réf. » du bloc** — `code` du node éditable et action
      « + enfant ». **Pas de champ `défaut`** : `defaultValue` n'existe pas dans le
      modèle et n'est pas retenu. Recouvre `P3-9`.
- [ ] `P2.5-11` **Barre d'ajout de bloc** — bouton large « Ajouter un bloc » plus des
      raccourcis d'un clic par type courant. Remplace ou complète la palette cmdk
      existante.
- [ ] `P2.5-12` **Densité d'affichage** — réglage compact / équilibré / aéré appliqué via
      variables CSS. Optionnel, à garder si le coût reste faible.
- [ ] `P2.5-13` **Étendre** `ChoiceConfig.other` — champ libre sur `radio`, `checkboxes`
      et `select` : type partagé, schéma Mongoose, schéma Zod du PUT. À faire avant
      l'UI qui l'édite.
- [ ] `P2.5-14` **Étendre** `TextareaConfig.counter` — compteur de caractères affiché ou
      masqué : type partagé, schéma Mongoose, schéma Zod du PUT.

### Écarts assumés avec la maquette

Décidés, ne pas les réintroduire sans en reparler :

- **Pas de** `defaultValue` par node, alors que la maquette montre un champ `défaut`
  dans le bandeau « Réf. ».
- **Pas de flag par option de choix** (la maquette montre `vérif_doc` sur une option) :
  les flags restent des **actions** de trigger, conformément au modèle.
- **Pas de slug éditable** : le bandeau affiche le `shortId` en lecture seule.
- **Configs non retenues** : `repeat`/`maxRep` sur un groupe, `format`/`mask` sur un
  texte, `granularité` sur une date. Seuls `other` et `counter` sont ajoutés.

## Phase 3 — Éditeur : édition des propriétés

**Réécrite pour la maquette v2.** L'inspector n'existe plus : chaque propriété s'édite
**en ligne dans la card**, via le bandeau « Paramètres » posé par `P2.5-8`. Les tickets
ci-dessous décrivent donc le contenu des chips et des zones d'édition, pas des panneaux.

Le modèle définit une vingtaine de propriétés éditables ; **sept le sont réellement**.

- [ ] `P3-1` **Options des questions à choix** — édition en ligne dans la card : une ligne
      par option (puce ronde pour `radio`/`select`, carrée pour `checkboxes`), label
      éditable, suppression, et `+ option`. Plus le champ libre `other` posé par
      `P2.5-13`. Ce sont les types les plus utilisés en pratique.
- [ ] `P3-2` **Types sans chips de paramètres** — `checkboxes` et `date` n'exposent aucun
      réglage. Définir leur jeu de chips dans le bandeau « Paramètres ».
- [ ] `P3-3` **Champ** `required` — interrupteur `obligatoire` du bandeau « Paramètres ».
      Le badge `requis` de l'en-tête de card en dépend.
- [ ] `P3-4` `page.skippable` — modélisé, clé i18n écrite, aucune UI. À placer sur
      l'en-tête de page (`P2.5-4`).
- [ ] `P3-5` **Sous-titre et description sur tous les types** — la card expose un intitulé
      et une description ; vérifier que `subtitle` et `description` sont bien câblés pour
      tous les kinds, pas seulement `text` et `textarea`.
- [ ] `P3-6` **Contenu d'un** `group` — `group.title` et `group.description` (distincts du
      titre du node) ne sont pas éditables.
- [ ] `P3-7` **Contenu d'un** `info` — type d'alerte (info/warning/error/success/neutral),
      titre et description : rien n'est éditable.
- [ ] `P3-8` **Configs avancées par type** — chips du bandeau « Paramètres » :
      `text` (maxLength, minLength, pattern), `textarea` (rows, `counter` de `P2.5-14`),
      `number` (integer, unit), `date` (min, max), `checkboxes` (minChecked, maxChecked,
      layout), `scale` (labels), `radio`/`select` (layout, searchable), et `commit` sur
      tous les types.
- [ ] `P3-9` **Champ** `code` — ~~recouvert par~~ `P2.5-10` (bandeau « Réf. » de la card).
      Ne pas traiter séparément.
- [ ] `P3-10` **Onglet « Logique »** — ~~recouvert par~~ `P2.5-9` : l'onglet disparaît avec
      l'inspector, les règles deviennent un bandeau de la card. Ne pas traiter séparément.

## Phase 4 — Éditeur : confort

- [ ] `P4-1` **Sidebar** — ~~caduc~~ : la maquette v2 supprime les deux panneaux latéraux
      (`P2.5-1`). Ne pas construire de sidebar. Si un plan du questionnaire redevient
      utile plus tard, ce sera un nouveau ticket, pas celui-ci.
- [ ] `P4-2` **Undo / redo** — absent, alors que Redux le rend accessible.
- [ ] `P4-3` **Raccourcis clavier** — aucun listener dans tout l'éditeur.
- [ ] `P4-4` **Confirmation de suppression** — un node se supprime sans avertissement ni
      annulation possible.
- [ ] `P4-5` **Navigation clavier entre blocs** — sélection au clavier seulement partielle.
- [ ] `P4-6` **Validation en direct** — signaler les blocs incomplets (choix sans options,
      titre vide) avant d'arriver à la publication.
- [ ] `P4-7` **États vides** — un questionnaire sans page n'offre aucun guidage.

## Phase 4.5 — Refonte de l'overview (maquette v2)

Page d'aperçu d'un questionnaire (`/survey/[surveyShortId]`) et sa **modale d'export**.
Référence :
[Overview Questionnaire](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Overview+Questionnaire.dc.html).

Même principe que les autres phases de refonte : structure et interactions, **pas les
couleurs brutes** — tout passe par les tokens sémantiques.

Le header global et le header de page viennent de la **phase 1.5** : cette phase ne
traite que le contenu. Attention, une bonne partie des données affichées n'existe pas
encore — les tickets qui en dépendent le disent.

- [ ] `P4.5-1` **Layout de la page** — largeur 1180px, en-tête (libellé, titre,
      sous-titre + `shortId`), puis grille : stats en haut, et en dessous deux colonnes
      (graphique et liste à gauche, tuiles et détails à droite).
      Les deux colonnes **s'empilent en petite largeur**, et la grille de stats se replie
      d'elle-même : prévoir ce repli dès le départ.
- [ ] `P4.5-2` **Header de page de l'overview** — décline `P1.5-3` avec ses actions :
      statut du questionnaire, `Aperçu`, `Modifier`, **`Paramètres`** (point d'entrée
      vers la phase 4.6) et `Publier` — qui **ouvre la modale de publication** (`P5-6`).
      Le fil d'Ariane est `Questionnaires / <titre>`.
- [ ] `P4.5-3` **Cards de statistiques** — quatre cards avec valeur, unité, libellé, et
      un pied de card portant une variation. Les valeurs elles-mêmes restent celles du
      contrat actuel tant que `P4.5-7` et `P4.5-8` ne sont pas faits.
- [ ] `P4.5-4` **Tuiles d'actions** — grille 2×2 (Statistiques, Réponses, Modifier,
      Exporter) : icône, badge ou raccourci clavier en haut à droite, titre, sous-titre,
      et un pied de card contextuel (`12 blocs · 7 règles`, `dernier export le…`).
      Remplace `SurveyOverviewQuickActions`.
- [ ] `P4.5-5` **Bloc « Détails du formulaire »** — lignes label/valeur avec puce de
      temps relatif, et une barre d'actions en pied.
      **Mis à jour par la maquette des paramètres** : la ligne `Lien` devient `Code`
      (le `shortId` en majuscules, avec une action « copier »), et deux lignes
      s'ajoutent — `Diffusion` (audience · règle de réponse · nombre de personnes) et
      `Abandon` (le délai configuré). Ces deux lignes **dépendent de la phase 4.6**
      (paramètres) : sans elle, il n'y a rien à afficher.
      Le pied s'ouvre sur `Tous les paramètres ▸`, puis `Archiver` et `Supprimer`.
- [ ] `P4.5-6` **Archiver un questionnaire** — action du bloc Détails. Transition de
      statut, à coordonner avec les endpoints de `P5-5`.
- [ ] `P4.5-7` **Sélecteur de période (7 / 14 / 30 j)** — étend le contrat overview et
      l'agrégation serveur ; `weeklyData` est aujourd'hui figé à 7 jours.
      ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`).
- [ ] `P4.5-8` **Graphique empilé complètes / partielles** — le graphique actuel n'a
      qu'une série `count`. Légende, quadrillage, total au-dessus de chaque barre.
      ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`).
- [ ] `P4.5-9` **Deltas vs période précédente** — les variations affichées en pied des
      cards de stats (`+18 %`, `−3 pts`). Demande de comparer deux fenêtres temporelles.
      ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`).
- [ ] `P4.5-10` **Durée médiane de réponse** — quatrième card de stats. Le modèle n'a
      aucune notion de durée : il faudra un `startedAt` sur `SurveyResponse`, à décider
      en même temps que le modèle. ⚠️ Dépend de `P6-1`.
- [ ] `P4.5-11` **Modale d'export** — remplace `P7-6` : choix du format, portée (toutes /
      complètes / filtre courant), contenu à inclure (flags, métadonnées, réponses
      partielles), séparateur pour le CSV, aperçu des deux premières lignes du fichier,
      et résumé (`n lignes · n colonnes`). Livrée avec l'**export CSV**, qui n'a besoin
      d'aucune dépendance. ⚠️ Dépend du modèle `SurveyResponse` (`P6-1`).

### Écarts assumés avec la maquette

- **Pas de duplication de questionnaire** (la maquette montre `Dupliquer` dans le bloc
  Détails) : écarté pour l'instant.
- **Pas de sélecteur de workspace ni de badge** `PRO` — voir phase 1.5.
- Le lien public utilise le `shortId`, pas un slug éditable.

## Phase 4.6 — Paramètres d'un questionnaire (maquette v2)

Nouvelle page (`/survey/[surveyShortId]/settings`), accessible depuis le header de
l'éditeur (`P1.5-4`) **et** de l'overview (`P4.5-2`). Référence :
[Paramètres Questionnaire](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Parametres+Questionnaire.dc.html).

Quatre sections : diffusion, cycle de vie des réponses, accès de l'équipe, zone
sensible. **La section « Accès de l'équipe » n'est pas ici** : elle dépend entièrement du
modèle d'organisation et vit en phase 4.7.

Les réglages s'enregistrent en **autosave**, comme l'éditeur : le header affiche le
statut, il n'y a pas de bouton « Enregistrer ».

- [ ] `P4.6-1` **Layout et navigation de section** — largeur 1080px, colonne de
      navigation sticky à gauche (avec un badge de valeur courante par section), contenu
      à droite. Header de page dédié (fil d'Ariane, `shortId`, statut de sauvegarde).
      En largeur réduite, la navigation passe au-dessus du contenu et perd son `sticky`.
      Même repli que `P4.8-1` : mutualiser les deux layouts de réglages.
- [ ] `P4.6-2` **Modèle des réglages** — étendre `Survey` avec l'objet de configuration
      (audience, délai d'abandon, mode de fermeture, interrupteurs), plus le contrat Zod
      et l'endpoint de sauvegarde. À faire avant les tickets d'UI.
- [ ] `P4.6-3` **Diffusion : audience** `Public` — toute personne connectée peut ouvrir
      le questionnaire. C'est le comportement actuel : ce ticket pose surtout le
      sélecteur d'audience et sa mécanique d'options exclusives.
      Ce sélecteur est **réutilisé tel quel par la modale de publication** (`P5-6`) :
      en faire un composant autonome dès maintenant, pas un bloc de la page.
- [ ] `P4.6-4` **Diffusion : audience** `Domaines autorisés` — champ à chips avec
      validation (`@exemple.fr`), ajout par Entrée/virgule/espace, collage en masse,
      détection et retrait groupé des entrées invalides. Le filtrage se fait sur le
      domaine de l'e-mail du compte — **aucune organisation requise**.
      Contrôle à appliquer aussi **côté serveur** à l'ouverture du questionnaire, pas
      seulement dans l'UI.
- [ ] `P4.6-5` **Interrupteur « Une seule réponse par personne »** — rend configurable ce
      qui est aujourd'hui une règle fixe. Quand il est désactivé, plusieurs réponses du
      même utilisateur sont permises : l'index unique `(surveyId, respondentUserId)`
      prévu en `P6-1` doit donc être **conditionnel**, à décider en écrivant `P6-1`.
- [ ] `P4.6-6` **Interrupteur « Réponses anonymes »** — **le compte reste exigé** et
      `respondentUserId` reste stocké en base : seule sa **diffusion vers le front** est
      coupée. C'est une règle de sérialisation, pas un changement de modèle. Concerne
      toutes les surfaces qui affichent un répondant (listes, tableau, fiches, export).
- [ ] `P4.6-7` **Interrupteur « Reprise possible plus tard »** — autorise ou non de
      revenir sur une réponse en cours.
- [ ] `P4.6-8` **Délai d'abandon** — segmented control (6 h / 24 h / 72 h / 7 j /
      personnalisé avec valeur et unité), texte d'explication, et estimation de l'impact
      du changement. C'est l'UI du seuil décidé dans « Décisions produit » ; le champ
      côté `Survey` vient de `P6-1`.
- [ ] `P4.6-9` **Fermeture de la collecte** — manuelle, à une date et heure, ou sur
      quota de réponses complètes. La fermeture automatique demande une vérification à
      l'ouverture du questionnaire et au dépôt d'une réponse.
- [ ] `P4.6-10` **Zone sensible** — dépublier (lié à `P5-5`), transférer la propriété
      (⚠️ dépend de la phase 4.7), supprimer le questionnaire (`P8-1`), avec le nombre de
      réponses détruites annoncé et une confirmation explicite.
- [ ] `P4.6-12` **Réglage du consentement avant envoi** — présence de la case à cocher
      sur l'écran de récapitulatif et texte associé (`P6-16`). Certains questionnaires
      en ont besoin, d'autres non.
- [ ] `P4.6-11` **Point d'entrée depuis l'overview** — bouton `Paramètres` du header et
      lien `Tous les paramètres ▸` du bloc Détails, plus les deux nouvelles lignes
      `Diffusion` et `Abandon` de ce bloc (voir `P4.5-5`).

### Écarts assumés avec la maquette

- **Audiences** `Organisation` **et** `Liste d'invités` : reportées en phase 4.7, faute de
  modèle d'organisation et de mécanisme d'invitation.

## Phase 4.7 — Organisation, membres et permissions

Les mécaniques de collaboration que la maquette des paramètres suppose, et qu'aucune
partie du produit ne porte aujourd'hui. **Phase à étoffer** quand les maquettes des
espaces de travail arriveront — les tickets ci-dessous sont le strict nécessaire déduit
de la page de paramètres.

C'est le plus gros ajout produit de toute la roadmap : il touche l'authentification, le
modèle de données, chaque endpoint et chaque écran.

- [ ] `P4.7-1` **Modèle d'organisation** — entité, appartenance d'un questionnaire à une
      organisation, rattachement des utilisateurs.
      **Le multi-organisation est tranché** par la maquette des paramètres : un
      utilisateur appartient à plusieurs organisations, **avec un rôle différent dans
      chacune**. L'appartenance est donc une entité à part entière
      (utilisateur × organisation × rôle), pas un champ sur `User`.
      **L'espace personnel est une organisation** dont l'utilisateur est seul membre,
      créée d'office à l'inscription. La maquette de création l'offre comme destination
      au même titre qu'une organisation : un questionnaire appartient donc **toujours**
      à un espace, et il n'y a pas de cas `organizationId: null` à gérer partout.
      Les questionnaires existants sont rattachés à l'espace personnel de leur créateur
      lors de la migration.
- [ ] `P4.7-2` **Membres et rôles** — les cinq rôles de la maquette (Propriétaire, Admin,
      Éditeur, Analyste, Membre), leur attribution et la gestion des membres.
- [ ] `P4.7-3` **Matrice de permissions** — deux niveaux, articulés ainsi :
      **l'organisation définit le défaut, le questionnaire surcharge**.
      Les permissions d'organisation (`P4.8-10`) fixent ce qu'un rôle peut faire par
      défaut ; un questionnaire peut ensuite restreindre ou étendre au cas par cas.
      **Mais toutes les permissions ne descendent pas au questionnaire** : « créer des
      questionnaires », « gérer les membres » et « modifier l'organisation » n'ont de
      sens qu'au niveau organisation et n'apparaissent pas dans la matrice d'un
      questionnaire. Distinguer les deux familles dans le modèle dès le départ.
      Les sept capacités de questionnaire : voir le questionnaire, modifier la
      structure, voir les réponses, voir les statistiques, marquer une réponse traitée,
      exporter, publier. Propriétaire et Admin sont verrouillés à « tout ».
- [ ] `P4.7-4` **Application des permissions côté serveur** — chaque endpoint doit
      vérifier la capacité requise. Aujourd'hui le seul contrôle est
      `createdBy === user._id` : c'est une refonte de l'autorisation, pas un ajout.
- [ ] `P4.7-5` **Application des permissions côté client** — masquer ou désactiver ce que
      l'utilisateur ne peut pas faire, sur tous les écrans.
- [ ] `P4.7-6` **Invitations** — inviter par e-mail une personne à rejoindre
      l'organisation ou à répondre à un questionnaire, avec le cycle de vie associé
      (envoi, acceptation, expiration). Côté destinataire, les invitations en attente
      s'affichent dans l'onglet dédié de l'accueil (`P0.5-12`) : une invitation est
      « en attente » tant qu'aucune réponse n'a été commencée.
      S'appuie sur la brique d'envoi d'e-mails de `P0.4-11`.
- [ ] `P4.7-7` **Sélecteur d'organisation dans le header** — écarté en phase 1.5 faute de
      modèle ; spécifié par la maquette des paramètres : liste des organisations avec
      badge, nom, rôle et nombre de membres, marque sur l'organisation courante, mention
      `invitation` sur celles en attente, et une entrée « Créer une organisation »
      (`P4.8-12`). L'organisation sélectionnée détermine ce qu'affichent l'accueil et la
      page de paramètres.
- [ ] `P4.7-8` **Diffusion : audience** `Organisation` — restreindre aux membres.
- [ ] `P4.7-9` **Diffusion : audience** `Liste d'invités` — champ à chips d'adresses
      e-mail, avec ajout depuis les membres de l'organisation.
- [ ] `P4.7-10` **Section « Accès de l'équipe » des paramètres** — la matrice de
      `P4.7-3` rendue dans la page de paramètres, plus le lien « gérer les membres ».
- [ ] `P4.7-11` **Transférer la propriété d'un questionnaire** — action de la zone
      sensible.

## Phase 4.8 — Paramètres du compte et de l'organisation (maquette v2)

Nouvelle page (`/settings`), accessible depuis le menu utilisateur. Référence :
[Paramètres](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Parametres.dc.html).

Quatre pages derrière une navigation latérale groupée : **Mon compte**, puis
**Général**, **Membres** et **Rôles & permissions** pour l'organisation sélectionnée
dans le header. Ce qui est visible et modifiable dépend du rôle de l'utilisateur dans
cette organisation.

⚠️ Tout ce qui touche à l'organisation dépend de la **phase 4.7**. Les tickets de compte
sont, eux, faisables indépendamment.

- [ ] `P4.8-1` **Layout et navigation** — navigation latérale sticky avec groupes et
      badges, contenu à droite, autosave comme les autres pages de réglages.
      Même structure et même repli que `P4.6-1` (paramètres d'un questionnaire) :
      construire un seul layout de réglages pour les deux.
- [ ] `P4.8-2` **Mon compte : identité et mot de passe** — prénom, nom, e-mail, et le
      bloc de changement de mot de passe (« modifié il y a n mois »). Le découpage de
      `name` en prénom/nom est fait par `P0.4-5` ; le changement de mot de passe
      réutilise la politique et la jauge de la phase 0.4.
- [ ] `P4.8-3` **Mon compte : préférences** — thème et langue, persistés sur le compte.
      Ils vivent aujourd'hui côté navigateur (`next-themes`, locale Next) : les stocker
      côté serveur est un ajout, à arbitrer.
- [ ] `P4.8-4` **Mon compte : liste des organisations** — celles dont l'utilisateur est
      membre, avec son rôle, le nombre de membres et la date d'arrivée ; les invitations
      en attente y figurent aussi. ⚠️ Dépend de `P4.7-1`.
- [ ] `P4.8-5` **Supprimer mon compte** — zone sensible. Définir le sort des
      questionnaires créés et des réponses données : suppression, anonymisation ou
      transfert. Question produit à trancher dans le ticket.
- [ ] `P4.8-6` **Organisation : général** — nom, identifiant, domaines rattachés, et
      **diffusion par défaut**. Ce défaut est une **valeur initiale** : il s'applique à
      la création d'un questionnaire et ne modifie jamais un questionnaire existant.
      ⚠️ Dépend de `P4.7-1`.
- [ ] `P4.8-7` **Organisation : liste des membres** — rôle, dernière activité, filtres,
      et les invitations en attente affichées dans la liste. ⚠️ Dépend de `P4.7-2`.
- [ ] `P4.8-8` **Organisation : inviter des membres** — saisie de plusieurs adresses et
      choix du rôle attribué. ⚠️ Dépend de `P4.8-11`.
- [ ] `P4.8-9` **Organisation : changer le rôle d'un membre, le retirer** — avec les
      garde-fous qui vont avec : on ne retire pas le dernier propriétaire, on ne se
      rétrograde pas soi-même sans transfert.
- [ ] `P4.8-10` **Organisation : matrice de permissions** — les **8 permissions
      d'organisation** de la maquette (créer des questionnaires, voir tous les
      questionnaires, modifier tous les questionnaires, voir les réponses, marquer
      traitées, exporter, gérer les membres, modifier l'organisation) × 5 rôles.
      ⚠️ Dépend de `P4.7-3`.
- [ ] `P4.8-11` **Invitations à rejoindre une organisation** — mécanique **distincte** de
      l'invitation à répondre à un questionnaire (`P4.7-6`) : envoi avec un rôle,
      acceptation ou refus par le destinataire, expiration. Les invitations en attente
      apparaissent dans le sélecteur d'organisation et dans la page « Mon compte ».
- [ ] `P4.8-12` **Créer une organisation** — depuis le sélecteur du header.
      ⚠️ Dépend de `P4.7-1`.

### Écarts assumés avec la maquette

- Le bloc **mot de passe** de « Mon compte » n'a de sens qu'une fois l'authentification
  par mot de passe en place (phase 0.4) : à livrer avec elle, pas avant. Il réutilise la
  politique de `P0.4-1`, la jauge de `P0.4-6` et l'invalidation de `P0.4-10`.

## Phase 5 — Aperçu et publication

- [ ] `P5-1` **Moteur de rendu des questions** — un composant par type (8 types), partagé
      entre l'aperçu (`P5-2`) et le parcours réel (phase 6). Brique centrale du produit,
      rien n'existe.
      La maquette du parcours en donne le rendu attendu : libellé numéroté, marque
      d'obligation, description, aide, état d'erreur, et les variantes d'affichage des
      choix (liste, boutons, pastilles) prévues par `ChoiceConfig.layout`. Prévoir aussi
      le champ libre « autre » (`P2.5-13`) et les états désactivé / lecture seule.
- [ ] `P5-2` **Page** `/preview` — placeholder. Aperçu fidèle sans persistance, accessible
      depuis l'éditeur. **Page distincte** du parcours réel (décision prise), mais elle
      en partage le rendu : la maquette de `Répondre` décrit le comportement attendu —
      champs désactivés, pas d'historique de tentatives, et le bouton d'envoi remplacé
      par « Fin de l'aperçu · retour à l'éditeur ».
      Veiller à ce que les deux écrans ne divergent pas : le rendu vient de `P5-1`,
      seuls les états et les actions changent.
- [ ] `P5-3` **Bascule aperçu desktop / mobile** — un questionnaire se remplit surtout au
      téléphone.
- [ ] `P5-4` **Validation avant publication** — titre requis, au moins une page non vide,
      options non vides sur les questions à choix.
- [ ] `P5-5` **Endpoints publish / archive / republish** — trois TODO dans l'overview, boutons
      `disabled`. ⚠️ Dépend de la question ouverte sur le cycle de vie.
      → `survey-overview-header.component.tsx`
- [ ] `P5-6` **Modale de publication** — le bouton `Publier` n'agit plus directement : il
      ouvre une modale, **strictement identique depuis l'overview et depuis l'éditeur**
      (un seul composant, monté par `P4.5-2` et `P1.5-4`).
      Contenu : récapitulatif de structure, sélection de l'audience, interrupteurs
      « une réponse par personne » et « réponses anonymes », lien public avec action
      copier, puis `Tous les paramètres` / `Annuler` / `Publier maintenant`.
      **Les réglages de diffusion sont ceux de la page de paramètres** (`P4.6-3` à
      `P4.6-6`) : réutiliser les mêmes composants et la même mutation, ne pas réécrire
      une seconde UI sur la même donnée — deux implémentations divergeraient.
      Les audiences `Organisation` et `Invités` restent affichées mais inactives tant que
      la phase 4.7 n'existe pas ; elles renvoient aux paramètres pour la gestion des
      listes.
      Le lien affiché est l'URL réelle de `routes.run` (`/run/<shortId>`), avec le code
      en majuscules (`P0.5-7`) — pas le `/r/` raccourci de la maquette.
      ⚠️ Dépend de `P4.6-2` (modèle des réglages) et de `P5-5` (endpoint de publication).

## Phase 6 — Répondre

Le parcours de réponse est **le cœur du produit** et la seule partie qui n'a aucune
implémentation. Référence pour tous les tickets d'UI :
[Répondre Questionnaire](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Repondre+Questionnaire.dc.html).

Quatre écrans : **intro**, **page de questions**, **récapitulatif**, **confirmation**.
Structure et interactions, **pas les couleurs brutes**.

- [ ] `P6-1` **Modèle** `SurveyResponse` — schéma Mongoose (le type existe déjà), index
      `(surveyId, respondentUserId)` — **unique seulement si** le questionnaire impose
      une réponse par personne, ce réglage étant devenu configurable (`P4.6-5`).
      **Quatre champs sont à trancher ici**, parce que les ajouter après serait une
      migration : un `startedAt` pour la durée de réponse (`P4.5-10`), de quoi situer
      l'abandon — dernière question atteinte, pas seulement `currentPageId` (`P7.5-9`) —
      la persistance des `flags` posés par le moteur (`P7.5-8`, `P7.5-5`), et un statut
      de **traitement** si la notion est retenue (`P7.6-12`).
      L'abandon lui-même **n'est pas un statut persisté** : il se dérive de `updatedAt`
      et d'un seuil porté par `Survey` (voir « Décisions produit »). Ajouter ce champ de
      seuil au modèle `Survey` fait partie de ce ticket ; fixer sa valeur par défaut est
      une question ouverte.
- [ ] `P6-2` **Moteur d'évaluation** — conditions, triggers, actions. Dans `src/shared/`, sans
      dépendance au DOM ni à Mongoose : exécuté côté client pour l'UX puis rejoué côté
      serveur à chaque commit. À couvrir de tests.
- [ ] `P6-3` **Parcours** `/run/[surveyShortId]` **: coquille et navigation** — layout du
      parcours (en-tête minimal, largeur de lecture ~660-880 px), barre de progression,
      navigation entre pages, reprise via `currentPageId`, et statut d'enregistrement
      permanent (« Enregistré il y a un instant »).
      Le rendu des questions vient de `P5-1`, les écrans dédiés des tickets ci-dessous.
- [ ] `P6-4` **API de réponse** — création/reprise, commit d'étape (écrase `answers`),
      soumission (`completed` + `completedAt`), revalidation serveur, incrément de
      `responseCount`.
- [ ] `P6-5` **Page de fin** `/run/[surveyShortId]/done`
- [ ] `P6-6` **Restreindre** `find-one` — la route est volontairement ouverte à tout
      utilisateur connecté (c'est la route de consultation pour répondre), mais elle
      expose aussi les questionnaires en `draft` à qui devine le `shortId`.
- [ ] `P6-7` **Questionnaire archivé ou dépublié** — comportement côté répondant.
- [ ] `P6-8` **Écran d'intro** — badge, date de fermeture, titre, sous-titre,
      description, et une grille de méta : nombre de pages, nombre de questions, **durée
      estimée** (`P0.5-13`) et possibilité de reprise. Bouton de démarrage dont le
      libellé s'adapte (commencer / reprendre).
- [ ] `P6-9` **Historique des tentatives sur l'intro** — liste des réponses du répondant
      à ce questionnaire, avec statut (en cours / envoyée / abandonnée), date,
      progression, et l'action adaptée (`Reprendre`, `Modifier`, `Repartir de zéro`).
      Cohérent avec le multi-réponses de `P4.6-5`. L'état « abandonnée » est **dérivé**
      du seuil d'inactivité (voir « Décisions produit »).
- [ ] `P6-10` **Verrouillage « une seule réponse »** — quand le questionnaire l'impose
      (`P4.6-5`) et qu'une réponse a déjà été envoyée : bouton de démarrage désactivé,
      encart d'explication, et accès en lecture seule à la réponse envoyée.
- [ ] `P6-11` **Mention de confidentialité sur l'intro** — qui verra les réponses, durée
      de conservation, et identité sous laquelle on répond. Le contenu doit être
      paramétrable ou déduit des réglages (`P4.6-6` pour l'anonymat) plutôt qu'écrit en
      dur : c'est une information juridique.
- [ ] `P6-12` **Indice d'affichage conditionnel** — sous une question apparue par
      condition, expliquer pourquoi (« affiché car "âge" est inférieur à 18 »).
      Généré depuis la `Condition` du node ; demande une mise en mots des opérateurs.
      La maquette en fait un réglage activable.
- [ ] `P6-13` **Numérotation des questions** — numéro courant affiché à côté de chaque
      question, en ignorant les blocs statiques (info, séparateur). Activable.
- [ ] `P6-14` **Champ en lecture seule** — une question pré-remplie et non modifiable
      (l'e-mail issu de l'invitation dans la maquette). Demande un moyen de marquer un
      node comme non éditable et de l'alimenter : à spécifier avant d'implémenter.
- [ ] `P6-15` **Écran de récapitulatif** — dernière étape avant envoi : toutes les
      réponses regroupées par page, les manquantes signalées, un lien `Modifier` par
      page qui ramène à la bonne étape.
- [ ] `P6-16` **Consentement avant envoi** — case à cocher obligatoire avec son texte, et
      l'avertissement que l'envoi est définitif. **Le texte et la présence de la case
      sont configurables par questionnaire** (certains en ont besoin, d'autres non) :
      réglage à ajouter en phase 4.6.
- [ ] `P6-17` **Validation à la soumission** — avant d'envoyer, revalider **toutes** les
      pages, pas seulement la courante : à la première en erreur, y ramener le répondant
      avec les champs fautifs signalés.
- [ ] `P6-18` **Écran de confirmation** — accusé de réception avec la date d'envoi et un
      récapitulatif téléchargeable. Selon le réglage, proposer de modifier sa réponse.
- [ ] `P6-19` **Contraintes de complétion par question** — `maxSel` sur un choix
      multiple, `min`/`max` sur un nombre, longueur d'un texte : les faire respecter à la
      saisie et à la validation, avec un message clair. Les configs existent déjà dans le
      modèle (`P3-8` les rend éditables).

### Écarts assumés avec la maquette

- **Pas de groupes répétables** (`repeat`, `max`, « Ajoutez jusqu'à trois postes ») :
  ni `GroupNode` ni le format `answers` ne les portent. ⚠️ Rouvrir cette décision plus
  tard coûtera cher — le format des réponses devra changer, avec migration des réponses
  déjà collectées.
- **Pas de référence de réponse visible** (`ATLR-24-0391`) : le répondant n'a pas
  d'identifiant à citer. Si le besoin apparaît, ce sera un `shortId` sur
  `SurveyResponse`, à ajouter au modèle.

## Phase 7 — Exploiter les réponses

- [ ] `P7-1` **Dé-mocker l'overview** — `completedCount`, `inProgressCount`, `completionRate`,
      `weeklyData` et `questionCount` sont codés à `99`. Porte sur les champs **déjà au
      contrat** ; les stats ajoutées par la maquette v2 (période, deltas, durée médiane,
      graphique empilé) ont leurs propres tickets en phase 4.5.
      → `src/server/api/routes/surveys/find-one-overview.get.ts`
- [ ] `P7-2` **Onglet « Répondus »** — `mockResponses` en dur et `respondedSurveys` toujours
      vide ; l'endpoint correspondant n'existe pas. Il doit renvoyer, en plus du
      questionnaire, la réponse de l'utilisateur (progression, statut, dates) et le
      **nom du créateur** (`populate` sur `createdBy`), affiché en `Envoyé par …` dans
      la ligne de `P0.5-5`.
      → `src/pages/index.tsx`
- [ ] `P7-3` **Liste** `/results` — ~~recouvert par la phase 7.6~~, qui reprend la page
      entière à partir de la maquette v2. Ne pas traiter séparément.
- [ ] `P7-4` **Détail** `/results/[responseShortId]` — ~~recouvert par~~ `P7.6-3` : la
      maquette v2 remplace la page de détail par la vue « Par répondant », un panneau
      dans la page de liste. La route dédiée reste utile pour un lien direct vers une
      réponse — à décider en traitant `P7.6-3`.
- [ ] `P7-5` **Analytics** `/analytics` — ~~recouvert par la phase 7.5~~, qui reprend la
      page entière à partir de la maquette v2. Ne pas traiter séparément.
- [ ] `P7-6` **Export CSV** — ~~recouvert par~~ `P4.5-11` : la modale d'export et le CSV
      sont livrés ensemble. Ne pas traiter séparément.
- [ ] `P7-7` **Tableau des derniers répondants (overview)** — bloc de la maquette v2 de
      l'overview : avatar à initiales, nom et email, flags posés, barre de progression
      (`9/14`), durée, date relative, état (complète / en cours / abandon), filtres
      `Tous` / `Complètes` / `En cours`, et un lien « Voir les n réponses ».
      Placé ici et non en phase 4.5 : il n'a de sens qu'une fois les réponses réelles
      disponibles. Une bonne partie du rendu sera commune avec la vue Tableau de
      `P7.6-2` — mutualiser plutôt que dupliquer.
      L'état affiché est **dérivé** : « abandon » n'existe pas en base, il se calcule
      depuis `updatedAt` et le seuil du questionnaire (voir « Décisions produit »).
      Ce calcul est le même partout — en faire un helper partagé plutôt que de le
      réécrire dans chaque liste.
- [ ] `P7-8` **Export Excel** — format `.xlsx` de la modale `P4.5-11`. Demande une
      librairie (aucune dans la stack) : à valider avant de l'ajouter.
- [ ] `P7-9` **Export PDF** — rapport imprimable. Demande aussi une librairie.
- [ ] `P7-10` **Export JSON** — structure complète des réponses. Aucune dépendance.

## Phase 7.5 — Refonte des statistiques (maquette v2)

Page de statistiques d'un questionnaire (`/survey/[surveyShortId]/analytics`) et sa
**modale d'export**. Référence :
[Statistiques Questionnaire](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Statistiques+Questionnaire.dc.html).

Remplace `P7-5`. Structure et interactions, **pas les couleurs brutes**.

⚠️ **Toute la phase dépend du modèle** `SurveyResponse` **(**`P6-1`**)** : sans réponses en base,
aucun de ces blocs n'a de données. Plusieurs tickets dépendent en plus du moteur
d'évaluation (`P6-2`) pour les flags. C'est pourquoi elle est placée ici et non avec les
autres phases de refonte.

- [ ] `P7.5-1` **Layout et header de page** — largeur 1080px, header contextuel avec fil
      d'Ariane (`Aperçu / Statistiques — <titre>`), `shortId`, onglets
      `Réponses` / `Statistiques` (navigation vers `/results`), et bouton `Exporter`.
      Décline `P1.5-3`.
- [ ] `P7.5-2` **Sélecteur de période** — `7 j` / `30 j` / `Tout`. Mutualiser avec celui
      de l'overview (`P4.5-7`), qui pose le même besoin côté agrégation.
- [ ] `P7.5-3` **KPI de la page** — quatre cards (réponses envoyées, taux de complétion,
      durée médiane, flags par réponse) avec variation en pied. Même composant que
      `P4.5-3` : mutualiser.
- [ ] `P7.5-4` **Segments par statut** — `Tous` / `Complets` / `Abandons` avec compteurs.
      Le segment sélectionné recalcule **toute la page**. Prévoir cette dimension dans
      l'agrégation dès le départ, la rajouter après serait coûteux.
      « Abandons » se dérive du seuil d'inactivité, il ne se filtre pas sur un statut en
      base (voir « Décisions produit ») : l'agrégation doit donc comparer `updatedAt` au
      seuil du questionnaire.
- [ ] `P7.5-5` **Segments par flag** — segments dynamiques construits sur les flags
      réellement posés (`Flag mineur`…). ⚠️ Dépend du moteur (`P6-2`).
- [ ] `P7.5-6` **Entonnoir de complétion** — étapes successives avec barre proportionnelle
      et taux de perte entre chaque. **Démarre à « Commencé »** tant que `P7.5-7` n'est
      pas fait : les étapes calculables sont commencé → progression → envoyé.
- [ ] `P7.5-7` **Tracking des ouvertures du lien public** — nécessaire pour l'étape
      « Lien ouvert » de l'entonnoir. ⚠️ **Question à trancher avant d'implémenter** :
      que journalise-t-on exactement (compteur seul ? horodatage ? rien d'identifiant ?),
      et pour combien de temps. C'est une décision produit et RGPD, pas un détail
      technique — voir « Questions ouvertes ».
- [ ] `P7.5-8` **Bloc « Flags posés »** — fréquence de chaque flag, barre de proportion
      et part des réponses concernées. ⚠️ Dépend du moteur (`P6-2`).
- [ ] `P7.5-9` **Abandons par question** — part des répondants qui quittent sur chaque
      question, avec mise en évidence de la pire. Demande de **situer l'abandon** :
      `SurveyResponse` ne garde que `currentPageId`, pas la dernière question atteinte.
      À décider **en écrivant `P6-1`**, pas après — ce serait une migration.
      Le périmètre est celui des réponses abandonnées au sens du seuil d'inactivité : une
      réponse en cours depuis dix minutes n'est pas un abandon, et une réponse abandonnée
      peut sortir du calcul si son auteur revient (voir « Décisions produit »).
- [ ] `P7.5-10` **Résultats par question : choix** — barres horizontales par option avec
      effectif et pourcentage, pour `radio`, `checkboxes` et `select`.
- [ ] `P7.5-11` **Résultats par question : échelle** — histogramme de distribution, plus
      moyenne, médiane, écart-type et part des notes hautes.
- [ ] `P7.5-12` **Résultats par question : nombre** — cards min / médiane / moyenne / max
      et histogramme de répartition.
- [ ] `P7.5-13` **Résultats par question : texte** — nuage de mots pondéré, quelques
      réponses citées avec leur auteur, et un lien vers toutes les réponses textuelles.
      Le calcul des mots fréquents demande une normalisation (casse, accents, mots
      vides) : la définir explicitement.
- [ ] `P7.5-14` **Pied de card de question** — `code` de la question, couverture
      (`n sans réponse · n % de couverture`), mention `conditionnelle` quand le node
      porte une condition, et lien « voir les réponses ».
- [ ] `P7.5-15` **Modale d'export des statistiques** — modale **dédiée**, distincte de
      celle des réponses (`P4.5-11`) : formats PDF (rapport mis en page), CSV (une ligne
      par question), Excel (un onglet par question), PNG (un graphique par fichier).
      Livrer d'abord le format sans dépendance ; PDF, Excel et PNG imposent chacun une
      librairie à valider.

### Écarts assumés avec la maquette

- Les **types** `date` n'ont pas de rendu défini dans la maquette : à traiter au moment
  de `P7.5-10` à `P7.5-13` (probablement une distribution temporelle).

## Phase 7.6 — Refonte des réponses (maquette v2)

Page de consultation des réponses d'un questionnaire (`/survey/[surveyShortId]/results`).
Référence :
[Réponses Questionnaire](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Reponses+Questionnaire.dc.html).

Remplace `P7-3` et `P7-4`. C'est la page la plus riche des maquettes : **trois vues** du
même jeu de données, un système de filtres et de recherche commun, et une sélection
multiple avec actions groupées.

⚠️ **Toute la phase dépend du modèle** `SurveyResponse` **(**`P6-1`**).**

### L'ossature commune

Les trois vues partagent la barre d'outils (sélecteur de vue, recherche, filtres de
statut) et le même jeu de données filtré. Les vues « Par répondant » et « Par question »
partagent en plus un **gabarit split** identique — liste à gauche, panneau à droite —
dont seul le contenu du panneau change. Construire ce gabarit une fois, pas deux.

- [ ] `P7.6-1` **Layout, header et barre d'outils** — largeur 1240px, header contextuel
      (fil d'Ariane, `shortId`, onglets `Réponses` / `Statistiques`, bouton `Exporter`),
      puis la barre commune : sélecteur de vue, champ de recherche, filtres de statut
      avec compteurs. Le placeholder de recherche change selon la vue.
- [ ] `P7.6-2` **Vue Tableau** — en-tête de colonnes, lignes avec avatar, nom et e-mail,
      cellules typées (chip d'état, barre de progression, flags, texte), pagination, et
      un état vide « Aucune réponse ne correspond » avec réinitialisation des filtres.
- [ ] `P7.6-3` **Gabarit split** — coquille partagée par les deux vues suivantes : liste
      sticky à gauche, panneau à droite, navigation ▲▼ entre éléments. Le panneau est
      **polymorphe** (avatar, état, distribution et recherche interne sont optionnels) :
      prévoir cette variabilité dès le départ.
      En largeur réduite, le split passe en **colonne unique** : la liste latérale perd
      son `sticky`, se limite en hauteur et passe au-dessus du panneau. À concevoir avec
      le reste, pas après.
      Décider ici du sort de la route `/results/[responseShortId]` (voir `P7-4`).
- [ ] `P7.6-4` **Vue « Par répondant »** — liste des répondants à gauche ; à droite, la
      fiche : en-tête (avatar, nom, état, méta, flags), réponses **groupées par page du
      questionnaire**, et actions en pied.
- [ ] `P7.6-5` **Vue « Par question »** — l'axe s'inverse : liste des questions à gauche ;
      à droite, toutes les réponses à cette question, avec **distribution** pour les
      types catégoriels, **recherche interne** à la question, et taux de couverture.
- [ ] `P7.6-6` **Bandeau « hors filtre »** — quand le répondant ouvert ne correspond plus
      au filtre courant, le garder affiché avec un avertissement et un lien « Aller au
      premier résultat », plutôt que de vider le panneau.
- [ ] `P7.6-7` **Sélection multiple** — cases par ligne, case « tout sélectionner » dans
      l'en-tête, et barre d'actions groupées qui apparaît dès qu'il y a une sélection.
- [ ] `P7.6-8` **Colonnes configurables : métadonnées** — menu de sélection des colonnes
      (état, progression, durée, date, flags) avec compteur de colonnes actives.
- [ ] `P7.6-9` **Colonnes configurables : questions** — une colonne optionnelle par
      question (`#age`, `#statut`…). Demande d'**aplatir des réponses de types
      hétérogènes** en cellules : définir un rendu par type (un texte long tronqué, une
      échelle en valeur, un choix multiple en liste…).
- [ ] `P7.6-10` **Recherche côté serveur** — sur le nom, l'e-mail **et le contenu des
      réponses**. Doit être serveur : avec la pagination, un filtrage client ne verrait
      que la page courante. Choisir la stratégie d'indexation (index text MongoDB ou
      autre) en traitant le ticket.
- [ ] `P7.6-11` **Supprimer des réponses** — action groupée. Suppression définitive :
      prévoir une confirmation explicite.
- [ ] `P7.6-12` **Marquer une réponse comme traitée** — action groupée. **Ajoute une
      notion de suivi** qui n'existe pas : champ sur `SurveyResponse`, à décider en
      écrivant `P6-1`. Questions à trancher : qui a traité, quand, et ce statut
      apparaît-il comme filtre et comme colonne ?
- [ ] `P7.6-13` **Modale d'export depuis les réponses** — reprend la modale de
      `P4.5-11`, avec une portée supplémentaire : la **sélection courante**, et un
      résumé qui reflète les filtres et les colonnes visibles.
- [ ] `P7.6-14` **Actions de la fiche répondant** — « Ajouter un flag » et « Relancer ».
      Aucune des deux n'est couverte par le modèle : poser un flag manuellement sort de
      la logique du moteur, et relancer suppose un canal de contact. À spécifier avant
      d'implémenter, ou à écarter.

### Écarts assumés avec la maquette

- Le **tri** n'est pas exposé dans la maquette (le pied de tableau mentionne « tri par
  date décroissante » sans contrôle) : tri fixe pour l'instant.

## Phase 8 — Reste

- [ ] `P8-1` **Suppression d'un questionnaire** — aucun endpoint `DELETE`.
- [ ] `P8-2` **Partage** — bouton `share` de l'overview en TODO.
- [ ] `P8-3` **Tests Vitest** — aucun runner installé. Cibles prioritaires :
      `editor/state/tree/`, les sanitizers, les mappers, puis le moteur d'évaluation.
- [ ] `P8-4` **i18n** — namespaces `surveys.questions`, `surveys.analytics` et `surveys.run`
      vides ; textes en dur dans le header de l'éditeur et les onglets de l'inspector.
- [ ] `P8-5` **Lint** — 120 erreurs Prettier préexistantes dans 6 primitives `components/ui/`
      (guillemets doubles, classes Tailwind non triées), telles qu'installées par la CLI
      shadcn.
- [ ] `P8-6` **README** — encore le boilerplate `create-next-app` ; `README copy.md` à
      supprimer.
- [ ] `P8-7` **Remplacer les** `z.any()` **du schéma de réponse** — `SurveySchema.pages` décrit
      encore `condition`, `triggers` et `children` en `z.any()`. Le schéma récursif
      écrit pour `P1-1` peut les remplacer, mais `createEndpoint` valide la réponse :
      un document déjà en base légèrement hors-schéma ferait échouer un GET en 500.
      À faire avec une vérification des documents existants.
      → `src/shared/api/contracts/surveys/surveys.schema.ts`
- [ ] `P8-8` **Aligner les longueurs de** `CreateSurveyBodySchema` — la création limite
      `subtitle`/`description` à 200/1000 alors que l'éditeur et le PUT admettent
      500/5000 (les valeurs de `editor/config/survey-meta.config.ts`). Un même champ
      a donc deux limites selon le point d'entrée.
      → `src/shared/api/contracts/surveys/surveys.request.ts`
- [ ] `P8-9` `scale.labels` **est perdu à la relecture** — le champ est une `Map` Mongoose ;
      `find-one.get.ts` lit en `.lean()`, qui rend une `Map` JS native, et
      `JSON.stringify` la sérialise en `{}`. Le PUT renvoie bien les libellés (document
      hydraté) mais le GET suivant les rend vides. Sans effet aujourd'hui — aucune UI
      n'édite `labels` — mais bloquant dès `P3-8`.
      → `src/server/api/routes/surveys/find-one.get.ts`
- [ ] `P8-10` **Authentification par e-mail et mot de passe** — ~~recouvert par la
      phase 0.4~~, qui reprend le chantier à partir de la maquette. Ne pas traiter
      séparément.
- [ ] `P8-11` **Gabarit des états d'erreur** — écran centré commun à tous les cas :
      pastille d'icône teintée, kicker, titre, corps de texte, actions principale et
      secondaire, et un pied optionnel portant une référence copiable. Référence :
      [États d'erreur](https://claude.ai/design/p/8790fa9e-ee68-4dea-8013-a6dded01d5d2?file=Etats+Erreur.dc.html).
      Quatre teintes selon la gravité (neutre, ambre, rouge, bleu). Remplace la page
      `404.tsx` actuelle.
- [ ] `P8-12` **Pages d'erreur HTTP** — `404` (avec un champ de saisie de code, puisque
      l'utilisateur cherche souvent un questionnaire), `500` (avec une **référence de
      requête copiable**, à faire remonter par le serveur), `403` (carte du
      propriétaire, « Demander l'accès », « Changer de compte ») et `401` (session
      expirée, avec la mention que les réponses en cours sont enregistrées).
      Le `403` dépend des permissions (`P4.7-5`) ; les autres non.
- [ ] `P8-13` **États métier** — **questionnaire fermé** (date de clôture et contact du
      propriétaire, voir `P4.6-9` et `P6-7`) et **lien expiré** (réinitialisation ou
      invitation, avec demande d'un nouveau lien — voir `P0.4-8`).
      Ce sont des situations prévues par le produit, pas des pannes : elles doivent
      expliquer et proposer une suite, pas seulement constater.
- [ ] `P8-14` **États techniques** — **maintenance** (avec page de statut) et **hors
      ligne** (détection de la perte de connexion). Le texte hors ligne promet que les
      réponses saisies restent sur l'appareil : ne l'afficher que si c'est vrai, sinon
      reformuler.

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
- **i18n** — fr/en en parité stricte, vérifiée par typage (`satisfies typeof frMessages`).
- **Design system** — shadcn/Tailwind v4, tokens oklch, thème clair/sombre.
- **Architecture de l'éditeur** — découpage `state/tree/selectors/factories/sanitizers`
  propre et testable ; canvas, meta-block, inspector avec Drawer mobile et palette cmdk.
