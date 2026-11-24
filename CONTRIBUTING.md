# Contribuer à BigBrother

> Règles d'équipe du PFE « Détection d'anomalies réseau / BigBrother » — version de travail 2.0, à ratifier par les quatre membres. **Ces règles proposées ne sont pas encore des configurations appliquées au dépôt GitHub.**
>
> Base : *Plan d'action PFE* (28 octobre 2026, sept pages), cahier des charges BigBrother 2026–2027, et [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).

## 1. Fonctionnement de l'équipe

| Membre | Domaine principal | Obligations transversales |
|---|---|---|
| **Mourad** | Données, `features.py`, nettoyage, étiquetage, benchmarks ML, paquet de modèle | Partager les métriques, jeux séparés et contrats de scores avec Thomas |
| **Anas** | Ubuntu, laboratoire isolé, Zeek, PCAP, `attacks.csv`, ingesteur | Fournir données horodatées à Mourad et tester les pannes |
| **Thomas** | PostgreSQL, migrations, FastAPI, service de scoring, SSE, RGPD | Publier OpenAPI, contrats, tests d'autorisation et relier le modèle à l'API |
| **Yannis** | React + TypeScript, UI, SSE frontend, Docker Compose, CI, tests E2E | Rendre les alertes qualifiables et renvoyer les faux positifs aux analyses ML |

La charge du plan source est de **30 points par personne en phase 1**, soit 120 points pour quatre membres ; **1 point ≈ 0,5 journée**. Les points par tâche du fichier `CLICKUP_IMPORT.csv` sont une *répartition proposée* de cette enveloppe, à recalibrer lors de la première revue.

- Chaque tâche a un **responsable unique**, un relecteur différent, un critère d'acceptation et une preuve (`issue`, PR, test, capture anonymisée ou rapport).
- Réunion de synchronisation : **lundi**, 20–30 min ; point blocages en milieu de semaine ; démo et replanification : **vendredi**, 45 min.
- Toute modification de périmètre/technologie est documentée : justification, estimation, impact planning, ADR si technique et approbation collective.
- Les décisions structurantes requièrent **3 accords sur 4**, notés dans l'ADR ; les réponses techniques sensibles requièrent en plus les autorisations prévues par le laboratoire/encadrant. Il s'agit d'une **règle locale proposée**, pas de la spécification Conventional Commits.

## 2. Sources de vérité et traçabilité

- **ClickUp** : tâches, responsable, estimation, dépendances, statut, temps, jalons et Gantt opérationnel ; ne pas créer de tâches doublons à partir d'un second import.
- **GitHub Issues / Pull Requests** : code, correctifs, revues, exécutions CI et décisions liées au code.
- **Git (`docs/contracts.md`)** : contrats de données, API et interfaces entre les quatre domaines.
- **Git (`docs/adr/`)** : comparaisons d'outils, critères, résultats et décisions d'architecture.
- **Git (`docs/weekly/`)** : compte rendu des mesures, démos et écarts hebdomadaires.
- **Classeur de suivi** : planning initial conservé, projections et analyse des écarts ; il est un *miroir manuel/offline* de ClickUp, pas une synchronisation automatique.

Nommer la tâche ClickUp `[CODE] Intitulé` et reporter ce code dans l'Issue GitHub et la PR. Exemple : `T06` → `feat(scoring): add periodic prediction jobs`, PR `Closes #42` et lien ClickUp dans sa description. **Ne pas confondre** code PFE `T06` et numéro de GitHub Issue `#42`.

## 3. Branches Git

| Branche | Utilisation | Origine | Fusion |
|---|---|---|---|
| `main` | Version stable et démontrable | branche principale | PR depuis `develop` après recette |
| `develop` | Intégration du travail quotidien | créée une fois depuis `main` | PR contrôlées |
| `feat/<id>-<sujet>` | Nouvelle fonctionnalité | `develop` | vers `develop` |
| `fix/<id>-<sujet>` | Correctif | `develop` | vers `develop` |
| `spike/<id>-<comparaison>` | Comparaison ou prototype jetable | `develop` | résultats/ADR ; **jamais adoption automatique** |
| `docs/<id>-<sujet>` | Documentation | `develop` | vers `develop` |
| `test/<id>-<sujet>` | Tests | `develop` | vers `develop` |
| `ci/<id>-<sujet>` | Infrastructure CI | `develop` | vers `develop` |
| `refactor/<id>-<sujet>` | Remaniement sans changement fonctionnel | `develop` | vers `develop` |
| `hotfix/<id>-<sujet>` | Correctif urgent d'une version de `main` | `main` | PR vers `main`, puis report vers `develop` |

`<id>` = code PFE (`T06`) ou Issue GitHub (`42`), **un identifiant stable**. Branches courtes, minuscules sans espace, nom en `kebab-case`.

**Règles de protection proposées :** pas de push direct ni force-push sur `main` ou `develop`, PR obligatoire, CI verte, discussions résolues. Au moins **1 relecteur** sur `develop`, **2** sur `main` ; auteur ≠ relecteur ; autorisations et fonctionnalités exactes selon le plan GitHub disponible. Choisir *Squash and merge* en prenant soin de donner un **titre conventionnel au commit de squash**. Les règles sont à appliquer manuellement dans `Settings → Branches/Rulesets` après vérification des droits.

### Routine Git

```bash
git switch develop
git pull --ff-only
git switch -c feat/T06-scoring-periodique
# développement + tests
git add .
git commit -m "feat(scoring): add periodic anomaly scoring"
git push -u origin feat/T06-scoring-periodique
# ouvrir une Pull Request vers develop
```

Ne jamais forcer une PR en modifiant `main` localement. Actualiser la branche de travail avant revue, et conserver les messages conformes.

## 4. Conventional Commits 1.0.0 : obligatoire pour l'historique

**Syntaxe normative :**

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

La norme définit **`feat`** pour une nouvelle fonctionnalité et **`fix`** pour une correction ; `BREAKING CHANGE` ou `!` signale une rupture de compatibilité. Les autres types, le périmètre (*scope*) et les limites de longueur sont des **conventions locales**. L'implication SemVer est : `fix` → PATCH, `feat` → MINOR, rupture → MAJOR, **lorsqu'une politique de versionnement est appliquée**.

### Types retenus localement

| Type | Usage | Exemple |
|---|---|---|
| `feat` | Fonction nouvelle | `feat(api): expose anomaly predictions` |
| `fix` | Correction d'un défaut | `fix(ingest): ignore duplicated zeek records` |
| `docs` | Documentation uniquement | `docs(contracts): define scoring payload` |
| `test` | Tests uniquement | `test(ml): cover infinite feature values` |
| `refactor` | Réorganisation sans nouveau comportement | `refactor(db): split alert repository` |
| `perf` | Gain de performance | `perf(api): reduce alert query latency` |
| `build` | Construction/dépendances | `build(frontend): pin vite dependencies` |
| `ci` | Intégration continue | `ci(actions): run unit tests on pull requests` |
| `chore` | Maintenance/outil sans impact fonctionnel | `chore(repo): add issue templates` |
| `revert` | Annulation d'un changement | `revert(api): restore previous alert schema` |

**Scopes suggérés :** `lab`, `zeek`, `ingest`, `data`, `features`, `ml`, `scoring`, `db`, `api`, `sse`, `auth`, `privacy`, `frontend`, `alerts`, `dashboard`, `devops`, `ci`, `contracts`, `docs`, `adr`, `security`. Le scope est **facultatif** selon la norme, mais conseillé dès qu'il aide à identifier le module.

**Exemples adaptés au PFE :**

```text
feat(zeek): collect JSON connection logs
feat(ml): compare anomaly detection baselines
fix(features): reject infinite numeric values
test(scoring): reject incompatible model versions
docs(adr): justify zeek over shortlisted collectors
ci(actions): lint and test the backend on pull requests
feat(api)!: rename the alert status field

BREAKING CHANGE: clients must migrate from status to lifecycle_state.
```

**Règles de rédaction internes :**

1. Description courte, verbe clair, idéalement **≤ 72 caractères** ; ni `update`, ni `wip`, ni `final`. L'anglais est recommandé pour les messages ; la documentation peut rester en français.
2. Un commit = une intention logique ; si `feat` et `fix` sont indépendants, séparer en deux commits.
3. Ajouter une ligne vide puis un **corps** pour préciser le pourquoi, la méthode, le protocole ou le compromis si nécessaire.
4. Ajouter des **footers** tels que `Refs: #42` ou `Reviewed-by: Mourad` si utile. Le lien de fermeture d'Issue (`Closes #42`) peut être placé dans la PR ; ne pas supposer qu'un code `T06` ferme une Issue.
5. **Rupture** : utiliser `!` immédiatement avant `:` et/ou un footer `BREAKING CHANGE: ...`, documenter migration, tests et mises à jour du contrat.
6. Les commits de *spikes* utilisent les mêmes types, mais le titre/PR doit signaler `spike`, par exemple `test(adr): benchmark zeek and suricata ingestion`.
7. La validation des messages par `commitlint` est **facultative et elle-même soumise à un comparatif** (ex. hook Git, script léger, commitlint). Prévoir un test CI pour le titre de la PR/squash si l'outil est retenu.

> Norme officielle : https://www.conventionalcommits.org/en/v1.0.0/ — l'ensemble des types listés ci-dessus et la limite de 72 caractères ne sont pas exigés par cette norme.

## 5. Comparer AVANT d'adopter un outil : règle de « gate »

**Un outil cité dans le PDF (Zeek, Pandera, MLflow, PostgreSQL, FastAPI, React, GitHub Actions, etc.) est une hypothèse technique, pas une preuve qu'il a été comparé.**

La recherche et les comparaisons concernent **toutes les solutions raisonnablement présélectionnées** pour un besoin donné (généralement 2 à 4, si disponibles), pas tous les logiciels existants. Toute exclusion doit être motivée : sécurité, licence, compatibilité, temps, ressources, maintenance.

1. Créer une tâche `spike` et son code (ex. `A02`), définir le **besoin mesurable**, les contraintes et les alternatives raisonnables.
2. Établir **avant les essais** un protocole commun : données, charge, système, version, mémoire/CPU, temps maximal, critères pondérés et seuils éliminatoires.
3. Tester chaque candidat présélectionné dans un environnement isolé, sur le même scénario ; noter échecs et mesures, sans réécrire la grille a posteriori.
4. Publier un tableau comparatif, scripts reproductibles et `docs/adr/ADR-XXXX-sujet.md`. Pour les prototypes sur `spike/`, ne pas fusionner le code candidat comme fonctionnalité définitive.
5. Valider l'ADR (trois membres sur quatre, les risques de sécurité résolus) ; **seulement alors** ouvrir/merger la PR d'intégration stable.
6. Changement de version majeure ou substitution d'outil : **retester** les hypothèses de l'ADR et documenter les impacts.

| Domaine | Comparatif minimal proposé | Gate |
|---|---|---|
| Collecte | Zeek, Suricata, CICFlowMeter, NFStream selon capacité | `ADR-CAPTEUR` |
| Stockage/API | PostgreSQL vs SQLite ; FastAPI vs alternative légère appropriée | `ADR-BDD-API` |
| Modèles | Règle de référence, Isolation Forest, LOF, Random Forest ; mêmes splits | `ADR-ML` |
| Suivi des expériences | MLflow vs registre de fichiers versionnés / alternative | `ADR-TRACK` |
| Frontend | React vs une alternative raisonnable, mini-prototype commun | `ADR-FRONT` |
| CI/CD | Actions vs GitLab CI ou Jenkins selon droits/coûts | `ADR-CI` |
| Carte/IA (phase 2) | Cytoscape.js vs React Flow ; modèle local vs résumé déterministe | `ADR-GRAPHE`, `ADR-IA` |

**Conflit de calendrier à traiter explicitement :** le PDF exige un laboratoire Zeek stable au **3 novembre**, tout en demandant un comparatif complet. Si un capteur est utilisé temporairement pour tenir M1, cette utilisation est qualifiée de **prototype de démonstration**, et non d'adoption définitive ; la gate ADR reste obligatoire avant standardisation sur `develop`.

## 6. Contrats indispensables avant intégration

Mettre `docs/contracts.md` sous version dès la première semaine ; actualiser toute rupture en PR. Il doit au minimum décrire :

- **Anas → Mourad** : `conn.log` JSON, `attacks.csv`, horodatage UTC, provenance et conventions de PCAP.
- **Mourad → Thomas** : `features.py`, champs/tags, unités, ordre de colonnes, paquet de modèle, seuil, version et réponse de score.
- **Thomas → Yannis** : endpoints OpenAPI, champs d'alerte, codes d'erreur, authentification et contrat SSE.
- **Yannis → Mourad** : qualificatifs `confirmée`, `faux positif`, `résolue` et historique de correction ; **aucun réentraînement automatique** sur une correction isolée.

Un changement de contrat n'est « terminé » que lorsque producteur **et** consommateur ont validé l'échantillon, un test de contrat et, le cas échéant, la migration.

## 7. Issues, Pull Requests et Definition of Done

Chaque Issue/task comporte : **contexte, livrable, responsable, estimation, date, dépendances, protocole d'essai, critères d'acceptation, preuves** et risques. Les PR contiennent le code PFE, l'Issue, le lien ClickUp, la comparaison ADR si outil et l'effet sur le planning.

**Checklist de PR :**

- [ ] Cible `develop` (ou `main` pour une livraison stable/hotfix).
- [ ] Titre conforme aux Conventional Commits, code PFE et Issue reliés.
- [ ] Tests de réussite ET d'échec pertinents, CI verte, lint/format vérifiés.
- [ ] Contrats et migrations mis à jour et validés par leurs deux parties.
- [ ] Une ADR approuvée existe **avant** ajout d'une dépendance structurante.
- [ ] Pas de secrets, adresses privées identifiantes, données personnelles, PCAP non autorisés ou journaux bruts.
- [ ] Comportements sensibles limités à un laboratoire autorisé, en lecture/simulation par défaut.
- [ ] Guide de test et preuve anonyme publiés ; critères d'acceptation cochés.
- [ ] Effort réel, statut et date de fin mis à jour dans ClickUp.

**Definition of Done (DoD)** : review approuvée + CI et tests passés + résultat démontrable + documentation/contrats/ADR à jour + sécurité et données vérifiées + statut ClickUp `Terminé` et preuve attachée. Une tâche seulement « codée » reste `En revue` ou `En validation`, jamais `Terminé`.

## 8. Sécurité et protection des données

- Exécuter uniquement des expériences autorisées sur le **laboratoire isolé**. Pas d'attaque ou d'interception de systèmes tiers.
- Secrets, tokens, mots de passe, clés et `.env` **hors Git** ; fournir `.env.example` sans secrets. Ne pas exposer d'IP internes réelles ou de données personnelles dans les captures publiques.
- Conserver la provenance et les dates des journaux ; limiter la conservation, pseudonymiser et documenter l'effacement.
- Vérifier les droits **sur le backend** ; tout refus d'opération sensible est testé et journalisé.
- Pour la phase 2 BigBrother : carte/kanban n'implique **aucune action réseau** ; actions risquées derrière simulation, approbation humaine, audit et retour arrière. Les actions destructives restent interdites.
- En cas de fuite : **révoquer immédiatement** le secret, informer les membres, bloquer le merge, assainir l'historique selon procédure approuvée, ouvrir un incident privé.

## 9. Rythme de pilotage et gestion des retards

- Le vendredi, saisir `statut`, `%`, `début/fin réels`, risque, responsable, preuves et éventuels jours restants supplémentaires.
- Si une tâche dépendante glisse : **mettre à jour les dépendances et prévoir la nouvelle date**, puis valider la replanification ; ne jamais écraser la baseline initiale.
- L'IA ClickUp peut **rédiger une proposition** d'analyse des retards ou d'ADR, jamais déclarer seule un test réussi ni modifier une décision ou un jalon sensible sans validation.
- Tout écart supérieur à **3 jours ouvrés** sur le chemin critique entraîne une revue de périmètre/charge et une action de mitigation documentée. Le jalon académique officiel n'est pas déplacé sans accord explicite.


**Références :** [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) ; [dépôt BigBrother](https://github.com/Hammulabi/BigBrother) ; Cahier des charges BigBrother. Les règles Git, gates, organigramme et KPI sont des **propositions de gouvernance** à valider en équipe.
