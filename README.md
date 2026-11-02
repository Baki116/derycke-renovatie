# Site Derycke Renovatie & Schilderwerken

Site Astro (statique + une fonction serveur pour le formulaire), prévu pour Vercel.
Textes du site en néerlandais de Belgique. Ce document est en français pour l'équipe.

## Démarrer en local

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # génère la version de production
```

Node 20 ou plus récent.

## Où modifier quoi

| Je veux modifier… | Fichier |
| --- | --- |
| Téléphone, e-mail, adresse, n° d'entreprise | `src/config/bedrijf.json` (ou via `/admin/` → Instellingen) |
| Mode démo, indexation Google | `src/config/site.ts` → `demo` et `indexeerbaar` |
| Textes des 5 services (intro, travaux, FAQ…) | `src/data/diensten.ts` |
| Textes de la page d'accueil | `src/pages/index.astro` |
| Over ons / Voor bedrijven / Privacy | `src/pages/over-ons.astro`, `voor-bedrijven.astro`, `privacyverklaring.astro` |
| Étapes de la démarche | `src/components/Werkwijze.astro` |
| Couleurs, typographie, espacements | `src/styles/global.css` (variables en tête de fichier) |
| Images d'illustration | `src/assets/beelden/` (remplacer le fichier en gardant le même nom) |

Un champ laissé à `null` dans `bedrijf.json` n'apparaît pas sur le site public (en mode démo, il s'affiche comme « nog aan te vullen »). Rien n'est inventé dans les données structurées.

## Ajouter une réalisation

**Via l'interface d'administration** (`https://<domaine>/admin/`) : « Realisaties » → « Nieuw », remplir titre, type de travaux, commune (seulement avec l'accord du client), résumé, photo principale + texte alternatif, galerie, puis passer le statut sur « Gepubliceerd ». L'enregistrement crée un commit sur GitHub et Vercel republie le site en ~1 minute.

**Manuellement** : créer `src/content/realisaties/<nom-court>/index.md` en copiant un exemple existant, déposer les photos dans le même dossier (`hoofdfoto: ./photo-1.jpg`), mettre `inspiratie: false` et `status: gepubliceerd`.

Les réalisations réelles s'affichent automatiquement avant les images d'inspiration. Une fois les vraies réalisations en ligne, supprimer les dossiers `inspiratie-*` (ou les passer en `concept`).

## Mise en ligne (≈ 15 minutes)

1. **GitHub** : créer un dépôt privé `derycke-website` et y pousser ce dossier (`git remote add origin … && git push -u origin main`). Le projet contient déjà un premier commit.
2. **Vercel** : « Add New → Project », importer le dépôt. Le framework Astro est détecté automatiquement.
3. **Variables d'environnement** (Vercel → Settings → Environment Variables) :
   - `SITE_URL` : `https://www.<domaine>.be`
   - `RESEND_API_KEY` : clé API Resend
   - `OFFERTE_ONTVANGER` : adresse qui reçoit les demandes (plusieurs possibles, séparées par des virgules)
   - `OFFERTE_AFZENDER` : expéditeur vérifié, ex. `Website Derycke <website@<domaine>.be>`
4. **Resend** : ajouter et vérifier le domaine (enregistrements DNS SPF/DKIM fournis par Resend). Sans domaine vérifié, l'envoi échoue et le visiteur reçoit un message d'erreur clair.
5. **Domaine** : Vercel → Settings → Domains.
6. **CMS** : dans `public/admin/config.yml`, remplacer `GITHUB-ACCOUNT/derycke-website` par le vrai dépôt. Connexion à `/admin/` : bouton « Sign in with token » avec un *fine-grained personal access token* GitHub (droits *Contents: read & write* sur ce seul dépôt). Option plus confortable : déployer l'authentificateur Sveltia (Cloudflare Worker gratuit) et renseigner `base_url`. Seules les personnes ayant accès en écriture au dépôt peuvent modifier le contenu.
7. **Avant l'ouverture au public** : dans `src/config/site.ts`, passer `demo: false` et `indexeerbaar: true`, compléter la privacyverklaring, remplacer les images d'inspiration.

## Formulier de devis — fonctionnement

- Validation dans le navigateur et à nouveau côté serveur (`src/pages/api/offerte.ts`).
- Photos : 6 max., JPG/PNG/WebP/HEIC, réduites automatiquement dans le navigateur (2000 px), 3 Mo max. par photo et 4 Mo au total (limite des fonctions Vercel). Le type réel est vérifié sur les premiers octets.
- Anti-spam : champ piège invisible, temps de remplissage minimal, limitation à 5 envois par 10 minutes et par IP.
- Sans configuration complète, **rien n'est envoyé** : le visiteur voit « Het formulier is nog niet gekoppeld… ». Aucun faux succès.
- Fonctionne aussi sans JavaScript (redirection vers `/contact/bedankt/` ou retour avec message d'erreur).

## Choix techniques

- Astro 7 + adaptateur Vercel ; aucune librairie front, ~3 Ko de JS au total.
- Police Archivo (variable, poids et largeur) hébergée localement : pas d'appel à Google Fonts, pas de cookies, pas de bannière nécessaire.
- Images converties en AVIF/WebP à plusieurs largeurs, chargement différé hors écran.
- SEO : titres et descriptions par page, sitemap, données structurées (entreprise, services, FAQ, fil d'Ariane) limitées aux informations confirmées. `robots.txt` bloque l'indexation tant que `indexeerbaar` est à `false`.
