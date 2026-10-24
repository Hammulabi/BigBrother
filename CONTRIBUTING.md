# BigBrother — Règles du projet et conventions de collaboration

**Version :** 1.0 (proposition à ratifier lors de la réunion d'équipe)  
**Portée :** les quatre membres du PFE, les Pull Requests, les prototypes expérimentaux et la documentation.  
**Références :** [README](./README.md) · [Plan hebdomadaire](./PLAN_PROJET.md).

> L'objectif est de construire un prototype **reproductible, traçable et sûr**. Aucun membre ne fusionne un outil ou une fonctionnalité sensible sans tests, revue et justification documentée.

## 1. Gouvernance d'équipe

1. **Quatre référents**, chacun responsable d'un domaine : E1 laboratoire/collecte, E2 backend/données, E3 détection/IA, E4 frontend/UX. Les noms seront définis ensemble ; ce partage n'exclut pas les contributions croisées.
2. **Un responsable par Issue**, une personne de secours identifiée pour les tâches critiques, et un relecteur d'un autre domaine pour chaque PR.
3. **Décisions structurantes** (architecture, librairies, données, droits, sécurité, périmètre) : discussion enregistrée dans une Issue + ADR et accord d'au moins **3 personnes sur 4**, dont la personne responsable de la sécurité du composant. Une décision liée à une action dangereuse requiert l'approbation des quatre et de l'encadrant lorsque nécessaire.
4. **Désaccord :** noter les options, les mesures et les risques ; expérimenter si possible ; demander l'arbitrage de l'encadrant si un choix de sécurité reste contesté.
5. **Rythme commun :** point de coordination lundi (30 min), revue/merge des PR en continu, démonstration et rétrospective vendredi (45–60 min). Absences et blocages signalés avant la revue de sprint.

## 2. Stratégie Git et branches

### Branches permanentes

| Branche | Rôle | Règles |
|---|---|---|
| `main` | État stable, démontrable et versionnable | **Protégée**, pas de push direct ; fusion uniquement après validation et tests ; tags `v0.x.y` |
| `develop` | Base commune d'intégration | **Protégée**, pas de push direct ; PR depuis branches courtes ; CI verte |

**État du dépôt à la rédaction :** seule la branche `main` existe ; elle n'est pas protégée. `develop` et les protections sont **à créer par l'équipe**, pas déjà configurées.

### Branches temporaires (issues de `develop`)

| Type | Modèle | Exemple |
|---|---|---|
| Fonctionnalité | `feat/<numero>-<sujet>` | `feat/42-kanban-incidents` |
| Correction | `fix/<numero>-<sujet>` | `fix/55-filtre-actifs` |
| Documentation | `docs/<numero>-<sujet>` | `docs/12-matrice-outils` |
| Expérience | `spike/<numero>-<outil-ou-hypothese>` | `spike/18-react-flow-vs-cytoscape` |
| Refactorisation | `refactor/<numero>-<sujet>` | `refactor/61-service-incidents` |
| Tests / CI | `test/<numero>-<sujet>`, `ci/<numero>-<sujet>` | `test/74-rollback-a1` |
| Correction urgente après livraison | `hotfix/<numero>-<sujet>` créée depuis `main` | `hotfix/88-audit-manquant` |

Caractères minuscules ASCII, tirets, nom descriptif, numéro d'Issue obligatoire. Une branche = une intention principale. Éviter les branches ouvertes plus d'une semaine si elles peuvent être découpées.

### Cycle de travail

```text
main (stable) <---- PR de livraison depuis develop, après recette
  ^
  |
develop (intégration) <--- PR relue + tests <- feat/42-exemple
                                      <- spike/18-comparaison
```

1. Créer une Issue avec besoin, périmètre, critères d'acceptation, responsable et risques.
2. Partir de `develop` à jour : `git switch develop && git pull --ff-only`.
3. Créer sa branche : `git switch -c feat/42-kanban-incidents`.
4. Commiter souvent, par ensembles cohérents et testables ; ne jamais inclure de secrets.
5. Ouvrir une **Draft PR** tôt si le travail dure plus d'un jour ; la passer en « Ready for review » une fois prête.
6. Fusionner dans `develop` en **Squash and merge** après approbation et contrôles. Supprimer la branche une fois fusionnée.
7. Préparer les versions stables par PR `develop → main` après recette complète, puis tag annoté `v0.x.y`.
8. En cas de `hotfix`, appliquer le correctif sur `main`, puis **répercuter la correction dans `develop`** par PR pour éviter les divergences.

Pas de force-push sur `main` ou `develop` ; ne jamais réécrire une branche partagée sans coordination.

### Protections GitHub à configurer

- Imposer une PR sur `main` et `develop` ; interdire la suppression et les force-pushs.
- Exiger **1 approbation minimale** pour `develop`, **2 approbations** pour `main` (hors auteur).
- Exiger les contrôles CI configurés, conversations résolues et branche à jour avant fusion.
- Empêcher l'auto-approbation et l'auto-fusion par l'auteur ; ne pas utiliser d'exception administrateur hors urgence tracée.
- Activer la détection de secrets, les alertes de dépendances et l'analyse de code **si disponibles** sur le dépôt/plan GitHub.
- Privilégier le *squash merge* pour les PR ordinaires ; conserver un historique clair et des messages conventionnels.

## 3. Commits — Conventional Commits

**Format obligatoire :**

```text
<type>(<scope>): <description courte à l'impératif>
```

**Types autorisés :** `feat` (fonction), `fix` (correction), `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, `revert`.

**Scopes conseillés :** `infra`, `collect`, `backend`, `db`, `detection`, `ai`, `frontend`, `graph`, `kanban`, `security`, `audit`, `docs`.

Exemples :

```text
feat(kanban): afficher les incidents par statut
fix(backend): refuser une transition non autorisee
test(security): verifier le rejet des actions A3
docs(architecture): comparer vector et fluent-bit
chore(infra): ajouter une configuration locale sans secrets
```

**Règles :**

- Une première ligne idéalement **≤ 72 caractères**, claire et sans point final.
- Un commit = un changement logique ; pas de messages `update`, `wip`, `final`, `test123` sur une PR finale.
- Expliquer le **pourquoi** dans le corps si nécessaire, et mentionner l'Issue (`Refs #42`, `Closes #42` dans la PR ou le squash final).
- Indiquer `BREAKING CHANGE:` lorsqu'une interface ou un contrat se rompt ; fournir migration et tests.
- Ne jamais commiter `.env`, tokens, clés, identifiants, IP réelles sensibles, journaux bruts, captures contenant des secrets, données personnelles ou poids de modèles non autorisés.
- Utiliser des **données fictives/anonymisées** dans les tests, captures et exemples.

## 4. Issues, projet et revues

### Format minimal d'une Issue

```markdown
## Pourquoi ?
[Problème ou besoin]
## Travail attendu
[Découpage fonctionnel ou expérimental]
## Critères d'acceptation
- [ ] Test concret 1
- [ ] Test concret 2
## Dépendances et risques
[Issues, sécurité, données, matériel]
## Livrables
[Code, tests, documentation, preuve]
```

Labels recommandés : `type:feature`, `type:bug`, `type:spike`, `type:docs`, `area:infra`, `area:data`, `area:ai`, `area:frontend`, `priority:p0/p1/p2`, `blocked`, `security`, `needs-decision`.

Tableau **GitHub Projects** : `Backlog → Ready → In progress → In review → Test/validation → Done` ; placer les comparatifs en tâches explicites.

### Format minimal d'une Pull Request

```markdown
## Issue liée
Closes #XX
## Objectif / changements
[Ce qui a changé et pourquoi]
## Validation
- [ ] Tests automatisés ajoutés et passés
- [ ] Tests manuels / démonstration documentés
- [ ] Sécurité, provenance des données et droits vérifiés
- [ ] Documentation et ADR mis à jour si nécessaire
## Preuves
[Résultats, capture anonymisée ou logs synthétiques]
## Risques et retour arrière
[Impact, procédure]
```

Une PR doit être **petite et relisible**, sans fonctionnalités indépendantes mélangées ; une PR de type `spike` ne devient pas automatiquement une intégration de production. Une PR importante a au moins un test du chemin nominal et un test de refus ou d'échec pertinent.

## 5. Règle obligatoire : comparer les outils AVANT d'en choisir un

### 5.1 Principe de décision

**Aucun outil, framework, bibliothèque, moteur IA, base de données ou composant structurant ne devient un standard du projet avant validation d'une comparaison.**

**« Tester les autres »** signifie : explorer les alternatives raisonnables du marché pour le besoin précis, en constituer une **présélection justifiée et documentée**, puis **tester toutes les options de cette présélection** sur un protocole commun. Les outils écartés avant test doivent l'être sur un motif **vérifiable** (incompatibilité OS/matériel, licence, absence de support, hors périmètre, sécurité), pas sur une préférence personnelle. Il n'est pas réaliste d'essayer chaque outil existant dans le monde.

**Expérimenter n'est pas adopter :** les candidats sont utilisés sur branches `spike/` ou environnements isolés. Le code définitif n'entre sur `develop` qu'après décision approuvée.

### 5.2 Protocole commun obligatoire

1. **Décrire le besoin** et les contraintes non négociables (données locales, absence de privilèges excessifs, budget, machine de test, licence, compatibilité).
2. **Recenser et présélectionner** 2 à 4 options pertinentes si disponibles ; documenter les autres et leurs exclusions.
3. **Définir à l'avance** un cas d'usage identique, une métrique, des seuils, un protocole et les critères pondérés (pas de changement opportuniste une fois les résultats vus).
4. **Tester toutes les options présélectionnées** avec la même charge/données, les mêmes ressources et un budget de temps comparable.
5. **Mesurer** performance, mémoire, CPU, temps d'intégration, maintenabilité, sécurité, fonctionnement hors ligne et qualité de la documentation.
6. **Consigner les limites et les échecs** : versions, OS, configuration, machine, données, scripts, commandes, résultats bruts et synthèse.
7. **Décider via une ADR** (*Architecture Decision Record*) dans `docs/decisions/ADR-XXXX-choix.md` ; rattacher PR et Issue.
8. **Vérifier la réversibilité** : couche d'abstraction, export standard, preuve de remplacement quand pertinent.
9. **Faire valider** par l'équipe avant intégration ; conserver les benchmarks pour le mémoire PFE.

### 5.3 Grille de comparaison par défaut

Noter chaque critère **de 0 à 5** (0 = inacceptable, 5 = excellent) et calculer la note pondérée. Fixer avant le test les seuils éliminatoires. Adapter les poids au besoin **dans l'ADR, avant expérimentation**.

| Critère | Poids par défaut |
|---|---:|
| Sécurité, confinement et contrôle des droits | 25 % |
| Adéquation aux besoins et facilité d'intégration | 20 % |
| Performance / ressources sur le matériel disponible | 20 % |
| Maintenabilité, documentation et communauté | 15 % |
| Reproductibilité, portabilité et fonctionnement local | 10 % |
| Licence, coût et pérennité | 10 % |
| **Total** | **100 %** |

**Élimination directe :** impossibilité de respecter les politiques de sécurité, licence incompatible, exfiltration non autorisée, privilèges excessifs incontournables, absence d'exécution dans le labo disponible, résultats non reproductibles. Un outil avec la meilleure note globale peut être rejeté s'il échoue à l'un de ces critères.

### 5.4 Modèle d'ADR obligatoire

```markdown
# ADR-000X — Choisir [composant]
- Statut : Proposée / Acceptée / Rejetée / Remplacée
- Date : AAAA-MM-JJ
- Issue / PR : #XX / #YY
- Décideurs : E1, E2, E3, E4
## Besoin et contraintes
## Alternatives recensées et motifs d'exclusion
## Candidats effectivement testés et versions
## Protocole identique, matériel, jeux de données, seuils
## Résultats bruts et tableau pondéré (0–5)
## Risques, limites, licence et données externes
## Décision et justification face aux autres options
## Plan de remplacement / rollback
## Validation de l'équipe et liens vers les preuves
```

**Exemples de comparaisons attendues :** VirtualBox/Proxmox ; Vector/Fluent Bit/Logstash ; FastAPI/Django REST/NestJS ; Cytoscape.js/React Flow/D3 ; SSE/WebSocket/polling ; règles + statistique simple vs Isolation Forest et autres modèles adaptés ; Ollama/llama.cpp/absence de LLM. Zeek et Suricata peuvent être **complémentaires** : tester leur apport séparément et ensemble plutôt que forcer un faux choix exclusif.

## 6. Qualité, tests et Definition of Done (DoD)

Une tâche n'est `Done` que lorsque :

- [ ] Les critères de l'Issue sont satisfaits ; une démonstration ou un test le prouve.
- [ ] Tests unitaires / intégration / sécurité adaptés et reproductibles ; la CI passe.
- [ ] Aucun secret, donnée sensible, code non autorisé ou dépendance non vérifiée n'est livré.
- [ ] Les entrées sont validées, les erreurs gérées ; l'API contrôle les rôles **côté serveur**.
- [ ] Les événements, preuves et décisions conservent leur provenance et des dates cohérentes (UTC côté stockage).
- [ ] Les changements de schéma/API, procédures de démarrage et décisions techniques sont documentés.
- [ ] Une autre personne a relu et approuvé la PR ; les commentaires bloquants sont résolus.
- [ ] Un rollback ou une désactivation existe pour tout changement sensible.

**CI à mettre en place dès le socle :** installation, formatage/lint, tests frontend/backend, contrôles de types, détection de secrets et vérification des dépendances selon les outils finalement retenus ; tests d'intégration dédiés sur environnement isolé.

**Non-régression prioritaire :** cohérence carte↔Kanban, refus d'accès `lecteur`, refus des actions A3, absence de commande IA arbitraire, panne de LLM non bloquante, événements en retard, échec d'une sonde, annulation A1, fuite externe en mode local strict.

## 7. Règles de cybersécurité et protection des données

1. Toute expérimentation a lieu **sur des systèmes appartenant au laboratoire ou explicitement autorisés** ; réseau séparé et scénarios maîtrisés.
2. Aucun scan, blocage ou test offensif vers des hôtes tiers, publics ou non autorisés.
3. Secrets hors dépôt : fichier `.env` local ignoré par Git, variables d'environnement, `.env.example` **sans secret réel**.
4. Ne jamais publier de journaux bruts, IP privées issues de systèmes réels, identifiants, informations sur des utilisateurs réels ou configurations révélant des accès.
5. Tracer utilisateur, date, cible, politique, approbation, exécution, résultat et annulation de toute mesure sensible.
6. Conserver **un mode sans LLM** ; traiter les événements collectés comme contenus non fiables et résister aux instructions injectées dans les journaux.
7. A0 : observation seule. A1 : effet limité, durée et rollback obligatoires, politique explicite. A2 : validation humaine avant exécution (hors scénario pédagogique formellement validé). A3 : refus systématique.
8. **Pas d'action réseau depuis un changement d'état Kanban**, pas d'accès direct de l'IA au terminal et pas de publication de rapports contenant des données brutes.
9. Les captures et démonstrations utilisent des données fictives ou anonymisées et des comptes de démonstration.
10. Si un secret fuit : arrêter l'utilisation du secret, le révoquer/renouveler, avertir le groupe et l'encadrant si nécessaire, examiner l'historique et documenter l'incident.

## 8. Documentation et traçabilité académique

Conserver dans le dépôt, au fur et à mesure de la réalisation, les chemins **proposés** suivants :

```text
README.md
CONTRIBUTING.md
PLAN_PROJET.md
docs/
  architecture/       # schémas, contrats d'API, modèle de données
  decisions/          # ADR-XXXX-*.md, comparatifs et validations
  benchmarks/         # protocoles, résultats non sensibles, tableaux
  security/           # matrice des droits, politiques A0–A3, plans de tests
  test-cases/         # jeux de données synthétiques et scénarios
  guides/             # installation, exploitation, démonstration
```

Un **journal hebdomadaire** conserve : tâches terminées, écarts planning/réel, décisions et alternatives testées, preuves de validation, risques ouverts, changements de périmètre et prochaine échéance. Les résultats négatifs d'expériences ont leur place dans le mémoire au même titre que les résultats positifs.

## 9. Gestion des versions, périmètre et gel

- Versionner les étapes utilisables par tags `v0.1.0`, `v0.2.0`, etc., sans prétendre à une stabilité de production.
- Après le jalon de janvier, si la chaîne **collecte → détection → dossier → affichage** reste instable, **geler les extensions facultatives** jusqu'à stabilisation.
- Fin février/début mars, privilégier correction, audit, reproductibilité et évaluation ; aucun nouveau framework majeur ou fonction risquée sans accord collectif documenté.
- En phase de gel : seules les corrections bloquantes, documentation et tests validés sont fusionnés ; toute modification majeure doit faire l'objet d'une évaluation de risque.

## 10. Première réunion de mise en place — checklist

- [ ] Désigner E1 à E4, un responsable de suivi et un binôme de relecture pour chacun.
- [ ] Approuver les conventions de ce fichier et le planning.
- [ ] Créer `develop` depuis `main` et configurer les protections disponibles.
- [ ] Créer les labels, le tableau GitHub Projects, les modèles d'Issues/PR et la CI minimale.
- [ ] Définir l'accès au labo, les données autorisées, les limites de test et les responsabilités de sécurité.
- [ ] Ouvrir les Issues de comparaison des outils **avant** les Issues d'implémentation définitive.
- [ ] Clarifier les droits sur les contributions, la licence du dépôt et les exigences pédagogiques.
