# Site Derycke Renovatie & Schilderwerken

Version finale du site (néerlandais de Belgique, vouvoiement « u »).
Astro 7 en statique + une fonction serveur pour les demandes de devis, hébergé sur Vercel.
Ce document est en français pour l'équipe.

## Démarrer en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # version de production
```

Node 20 ou plus récent.

## Où modifier quoi

| Je veux modifier… | Fichier |
| --- | --- |
| Téléphone, WhatsApp, e-mail, adresse légale, n° de TVA | `src/config/bedrijf.json` |
| Délai de réponse affiché (« binnen 1 werkdag »), avis Google | `src/config/site.ts` |
| Marques (peinture, carrelage, sanitaire…) | `src/config/merken.ts` (`actief: true/false`) |
| Photos du site (et étiquette « Inspiratiebeeld ») | `src/data/beelden.ts` + dossier `src/assets/beelden/` |
| Textes des 5 services (intro, travaux, FAQ…) | `src/data/diensten.ts` |
| Questions et réponses de l'assistant | `src/data/assistent.ts` |
| Page d'accueil | `src/pages/index.astro` |
| Étapes « Zo verloopt uw project » | `src/components/Werkwijze.astro` |
| Couleurs, typographie | `src/styles/global.css` (variables en tête) |

## Remplacer une photo d'exemple par une vraie photo

Toutes les photos sont dans `src/assets/beelden/` et déclarées une seule fois dans `src/data/beelden.ts`.

1. Déposer la photo dans `src/assets/beelden/` (JPG, au moins 2000 px de large).
2. Dans `src/data/beelden.ts`, remplacer l'import par le nouveau fichier.
3. Mettre `inspiratie: false` pour cette photo : l'étiquette « Inspiratiebeeld » disparaît.

Tant que `inspiratie: true`, la photo reste étiquetée « Inspiratiebeeld ». Une photo d'exemple n'est jamais présentée comme un chantier de Derycke.

Les paires avant/après (curseur « Voor / Na ») sont dans `voorNa`, dans le même fichier.

## Ajouter une réalisation

Une réalisation = un dossier dans `src/content/realisaties/` :

```
src/content/realisaties/badkamer-gent-2027/
  index.md
  hoofdfoto.jpg
  foto-2.jpg
```

`index.md` :

```md
---
titel: Badkamerrenovatie met inloopdouche
typeWerken: Badkamerrenovaties      # Schilderwerken | Badkamerrenovaties | Keukenrenovaties | Vloerwerken | Algemene renovaties
gemeente: Gent                      # seulement avec l'accord du client, sinon supprimer la ligne
samenvatting: Volledige renovatie van een kleine badkamer, met een inloopdouche en grote tegels.
hoofdfoto: ./hoofdfoto.jpg
hoofdfotoAlt: Gerenoveerde badkamer met inloopdouche en grote grijze tegels
galerij:
  - foto: ./foto-2.jpg
    alt: Detail van de nis in de douche
status: gepubliceerd                # concept = pas encore visible
inspiratie: false
datum: 2027-01-15
---
```

Après le push sur GitHub, Vercel republie le site en environ une minute. Les vraies réalisations s'affichent avant les images d'inspiration. Quand il y en a assez, supprimer les dossiers `inspiratie-*`.

**CMS (proposition, non installé)** : une interface d'administration gratuite (Sveltia/Decap CMS, connexion GitHub) est prête dans `docs/cms-voorstel/`. Pour l'activer : déplacer ce dossier vers `public/admin/`, remplacer le nom du dépôt dans `config.yml` et créer un accès GitHub pour la cliente. À valider par Mike avant installation.

## Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Rôle | Valeur actuelle |
| --- | --- | --- |
| `RESEND_API_KEY` | clé d'envoi Resend | clé « derycke-offerte » (envoi uniquement) |
| `OFFERTE_TO` | destinataire(s) des demandes, séparés par des virgules | `info@flandershostassist.be` (temporaire) → `contact@deryckerenovatie.be` quand Google Workspace est actif |
| `OFFERTE_FROM` | expéditeur vérifié chez Resend | `Website Derycke <offerte@viewlaya.site>` (temporaire) → `…@deryckerenovatie.be` une fois le domaine vérifié chez Resend |
| `PUBLIC_GADS_CONVERSIE` | facultatif : conversion Google Ads `AW-…/…` | vide |

Aucun secret dans le code. Sans `RESEND_API_KEY`, `OFFERTE_TO` et `OFFERTE_FROM`, rien n'est envoyé et le visiteur voit un message clair (jamais de faux succès).

## Indexation

Le site n'est indexable qu'en **production** (`VERCEL_ENV=production`). Les previews `*.vercel.app` sont toujours en `noindex` et leur `robots.txt` bloque tout.
Domaine canonique : `https://deryckerenovatie.be` (sans www). `www` est redirigé en 301 vers l'apex (`vercel.json`).

## Formulaire et assistant

- Formulaire (`/contact/`) et assistant envoient tous les deux vers `/api/offerte/` → e-mail à `OFFERTE_TO` avec les photos en pièce jointe, réponse directe possible au client (Reply-To).
- Photos : 8 max., JPG/PNG/WebP/HEIC jusqu'à 10 Mo chacune, réduites dans le navigateur (1800 px) pour rester sous la limite de 4 Mo d'une fonction Vercel. Type réel vérifié sur les premiers octets.
- Anti-spam : champ piège invisible, temps de remplissage minimal, 5 envois max. par 10 minutes et par IP. Pas de CAPTCHA.
- Case de consentement RGPD obligatoire (formulaire et assistant).
- Assistant : arbre de questions sans IA ni coût. Aucune version IA n'est installée.
- `?dienst=Vloerwerken` et `?klant=vastgoed|bedrijf` présélectionnent le formulaire. Les pages services le font automatiquement.

## Conversion Google Ads / GA4

`src/scripts/conversie.ts` envoie `generate_lead` (et la conversion Ads si `PUBLIC_GADS_CONVERSIE` est rempli) **seulement** si une balise Google est installée et que le visiteur a donné son accord. Aujourd'hui il n'y a ni analytics ni pixel, donc pas de bandeau cookies et rien n'est mesuré. Pour activer : ajouter la balise Google, un bandeau cookies (« Weigeren » aussi visible que « Accepteren ») qui met `window.deryckeToestemming = true` après accord.

## Choix techniques

- Animations : CSS + Lenis (défilement doux, souris uniquement), apparitions au scroll, transitions de page (View Transitions natives). Tout est désactivé avec `prefers-reduced-motion`.
- Police Archivo variable hébergée localement (pas de Google Fonts, pas de cookies).
- Images AVIF/WebP à plusieurs largeurs, chargement différé.
- Données structurées : `HomeAndConstructionBusiness` + `HousePainter` + `GeneralContractor`, `Service`, `FAQPage`, `BreadcrumbList`.
- Logo vectoriel : `public/logo/derycke-logo-donker.svg` (fond clair) et `derycke-logo-licht.svg` (fond foncé).
