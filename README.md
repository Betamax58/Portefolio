# Portfolio de Kévin BOYER-NAVARRO

Site statique en français, anglais et chinois. `index.html` est une copie exacte de `site_fr.html`. Chaque langue utilise son script `js/app_*.js` et les fiches JSON dans `assets/projects_data/`.

## Vérification

```sh
python scripts/check_portfolio.py
node --check js/app_fr.js
node --check js/app_en.js
node --check js/app_ch.js
```

Après une modification de la page française, recopier `site_fr.html` dans `index.html`. Conserver les mêmes projets et médias dans les trois langues ; traduire les titres, descriptions et textes alternatifs. Les galeries utilisent des listes `media` explicites, avec fichiers existants et descriptions accessibles. Une ressource sans `link` s'affiche désactivée.

## Crédits et licences

La fenêtre « Licences » est disponible dans chaque langue. Les sources des pictogrammes sont inventoriées dans `assets/licenses/asset-credits.json` ; les limites de provenance des anciens logos sont indiquées dans `THIRD_PARTY_NOTICES.md`. Les textes MIT de Devicon et de Popper.js sont conservés dans `assets/licenses/`. Ne pas assimiler les droits de marque à une licence libre.

jQuery 3.5.1 Slim et Bootstrap 4.5.3 (CSS et bundle incluant Popper.js) sont servis localement depuis leurs fichiers officiels. Les notices originales sont conservées.

## Corrections du 3 octobre 2026

- Synchronisation des quatre pages et conservation des 15 projets, photos, vidéos, CV par langue, loisirs et lien Strava.
- Références d'images corrigées, suppression des faux fichiers de secours PNG/JPG, galerie de chaque projet identique dans les trois langues.
- Galeries corrigées : alimentation stabilisée (3 images), Recreator (6), enceinte centrale (4), bateau amorceur (miniature existante ; ancien lien vers une galerie absente retiré).
- Présentation et animation du titre actualisées ; cycle ESIGELEC daté 2022–2025, rôles associatifs datés 2023–2024 et 2024–2025 ; suppression de l'ancienne recherche de stage cachée.
- Localisation et courriel alignés avec le CV français ; expériences McDonald’s (2025–2026) et Miléade (2024) ajoutées d'après ce CV.
- Langues HTML normalisées, liens alternatifs et canoniques corrigés vers GitHub Pages, manifeste et favicons recréés depuis le logo existant.
- Erreurs de chargement des projets prises en charge : réseau, HTTP, JSON invalide et délai dépassé ; commandes vidéo et navigation tactile préservées.
- Initialisation musicale corrigée après le chargement de jQuery ; dépendances essentielles servies localement ; configuration manquante des particules rétablie.
- Filtre sélection appliqué au démarrage ; libellés de navigation et textes alternatifs corrigés ; préférence de réduction des animations respectée.
- Crédits complétés pour Devicon, Popper.js, Simple Icons / Thingiverse, marques et institutions, Strava, Pix, projets de référence et Marvel / Iron Man ; crédits Flaticon existants conservés.
- Vérificateur ajouté pour les liens locaux, ancres, identifiants, médias, parité linguistique, manifeste et crédits des pictogrammes techniques.
