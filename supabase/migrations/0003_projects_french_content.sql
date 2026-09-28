-- OPTIONAL: French content for the 11 original projects.
--
-- Requires 0002_project_translations.sql.
-- Each statement only fills a project that has NO French content yet
-- (`not (translations ? 'fr')`), so it never overwrites anything entered in
-- /admin, and re-running it is harmless. English columns are not touched.
-- Titles are omitted on purpose: they are brand names and stay identical.
-- Everything here remains editable afterwards from /admin (Français tab).

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Tourisme / Réservation d'activités",
  "role": "Développement web",
  "summary": "Une plateforme de réservation d'activités outdoor sur la côte atlantique marocaine.",
  "description": "Une plateforme Next.js qui présente les activités et permet de les réserver via un parcours guidé en plusieurs étapes, basé sur les disponibilités en temps réel.",
  "challenge": "Transformer un site touristique où l'on se contentait de demander des informations en véritable expérience de réservation : des pages d'activités claires, un tunnel de réservation qui valide chaque étape, des disponibilités fidèles à la réalité et des confirmations envoyées à la fois au visiteur et à l'équipe.",
  "contributions": ["Développement des pages et des activités", "Galeries et appels à l'action", "Tunnel de réservation multi-étapes", "Validation des formulaires", "Routes API Next.js", "Notifications e-mail automatisées", "Disponibilités via Google Calendar", "Protection reCAPTCHA", "SEO", "Déploiement sur Vercel"],
  "features": ["Réservation multi-étapes avec validation à chaque étape (React Hook Form + Zod)", "Disponibilités récupérées depuis Google Calendar", "E-mails transactionnels envoyés depuis les routes API via Resend", "Protection anti-spam avec Google reCAPTCHA"]
}$fr$::jsonb)
where slug = 'fly-taghazout' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Services d'assurance",
  "role": "Développement web",
  "summary": "Un site d'assurance responsive avec des parcours de demande de devis et de contact.",
  "description": "Un site corporate Next.js pour une société de services d'assurance, construit autour de formulaires de devis et de contact clairs et d'un SEO technique solide.",
  "challenge": "Rendre accessible un service réglementé, fondé sur la confiance : des formulaires simples à remplir et rigoureusement validés, et des bases de SEO technique solides pour que le site soit bien référencé et correctement partagé.",
  "contributions": ["Intégration responsive du site", "Formulaires de devis et de contact", "Validation", "Intégration d'API", "Métadonnées SEO", "URL canoniques", "Open Graph", "JSON-LD", "Optimisation des images"],
  "features": ["Formulaires de devis et de contact avec validation par schéma", "Envoi des e-mails côté serveur via Resend", "Données structurées (JSON-LD), URL canoniques et métadonnées Open Graph", "Mesure d'audience via Google Tag Manager"]
}$fr$::jsonb)
where slug = 'metassur' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Sécurité privée",
  "role": "Intégration WordPress",
  "summary": "Un site corporate pour une société de sécurité privée, de Figma à Elementor.",
  "description": "Un site corporate WordPress et Elementor intégré à partir de maquettes Figma, avec du CSS sur mesure pour un rendu fidèle et responsive.",
  "challenge": "Reproduire fidèlement une maquette Figma dans un page builder, la rendre responsive sur tous les points de rupture et livrer à l'équipe un site qu'elle peut gérer elle-même, blog compris.",
  "contributions": ["Intégration Figma vers Elementor", "CSS responsive", "Menus", "Formulaires", "Appels à l'action", "Gestion du blog", "Optimisation SEO"],
  "features": ["Mises en page Elementor fidèles à la maquette, avec CSS sur mesure", "Menus et formulaires responsives", "Blog configuré pour que l'équipe publie en autonomie", "SEO on-page configuré avec Rank Math"]
}$fr$::jsonb)
where slug = 'asomovit-secu' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "E-commerce / Bijoux en diamants de laboratoire",
  "role": "Intégration WooCommerce",
  "summary": "Une boutique en ligne de bijoux en diamants de laboratoire.",
  "description": "Une boutique WooCommerce présentant des bijoux en diamants de laboratoire, avec un catalogue structuré et des pages Elementor réalisées à partir de maquettes Figma.",
  "challenge": "Présenter clairement des produits haut de gamme : un catalogue facile à parcourir, des informations produit qui répondent aux questions des clients et des visuels impeccables sur tous les écrans.",
  "contributions": ["Catalogue WooCommerce", "Catégories", "Informations produits", "Images", "Pages Elementor", "Intégration Figma", "Vérification responsive"],
  "features": ["Catalogue et catégories WooCommerce structurés", "Fiches produits détaillées avec visuels", "Pages Elementor intégrées à partir de Figma", "Vérifications responsive sur tous les appareils"]
}$fr$::jsonb)
where slug = 'glams' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Sécurité privée",
  "role": "Intégration WordPress",
  "summary": "Le site d'une société de sécurité privée, réalisé à partir de maquettes Figma.",
  "description": "Un site corporate WordPress créé et intégré à partir de Figma, avec des formulaires fonctionnels et une intégration responsive.",
  "challenge": "Construire une présence corporate sobre et crédible à partir des fichiers de design, avec les fondamentaux du SEO en place dès le premier jour.",
  "contributions": ["Création et intégration à partir de Figma", "Formulaires", "Intégration responsive", "Fondamentaux du SEO"],
  "features": ["Site entièrement réalisé à partir des maquettes Figma", "Formulaires de contact", "Mises en page responsives", "Fondamentaux SEO avec Rank Math"]
}$fr$::jsonb)
where slug = 'safety-for-you' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Gaming / E-sport",
  "role": "Développement low-code",
  "summary": "Le site d'une salle de gaming et d'e-sport sur Zoho Sites, enrichi en HTML/CSS sur mesure.",
  "description": "Un site Zoho Sites reproduit à partir de Figma avec du HTML et du CSS sur mesure, couvrant les jeux, l'équipement, les équipes e-sport, les avis et les réservations.",
  "challenge": "Pousser un outil low-code au-delà de ses réglages par défaut pour coller à un design gaming très expressif, tout en gardant des parcours de réservation et de contact simples.",
  "contributions": ["Reproduction de la maquette Figma", "HTML/CSS sur mesure", "Pages jeux", "Pages équipement", "Équipes e-sport", "Avis clients", "Parcours de réservation et de contact"],
  "features": ["Blocs HTML/CSS sur mesure dans Zoho Sites", "Pages jeux, équipement et équipes", "Section d'avis clients", "Réservation et contact via formulaires et WhatsApp"]
}$fr$::jsonb)
where slug = 'game-battle-arena' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Intelligence artificielle / Jumeaux numériques",
  "role": "Développement low-code",
  "summary": "Un site de contenu technique sur les jumeaux numériques, structuré pour le référencement.",
  "description": "Un site Zoho Sites présentant des solutions de jumeaux numériques, avec une architecture de contenu, des pages solutions et secteurs, de l'analytics et du SEO.",
  "challenge": "Expliquer une offre technique (jumeaux numériques BIM, CIM et FIM) grâce à une architecture de contenu claire, tout en garantissant que le site soit mesurable et bien référencé.",
  "contributions": ["Architecture de contenu", "Contenus BIM / CIM / FIM", "Solutions de jumeaux numériques", "Pages solutions", "Pages secteurs", "Analytics", "SEO"],
  "features": ["Structure de pages par solution et par secteur", "Contenus organisés autour du BIM, du CIM et du FIM", "Mesure d'audience avec Google Analytics et Tag Manager", "Suivi Search Console et SEO"]
}$fr$::jsonb)
where slug = 'ovivia' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Restauration / Hôtellerie",
  "role": "Intégration WordPress",
  "summary": "Un site de restauration avec cartes, galeries photo et plan d'accès intégré.",
  "description": "Un site WordPress et Elementor pour un café, réalisé à partir de Figma, avec des pages sur l'établissement, les cartes, des galeries et Google Maps.",
  "challenge": "Transmettre l'ambiance du lieu tout en restant pratique : des cartes faciles à lire sur mobile, des galeries qui se chargent bien et une page contact qui donne envie de passer la porte.",
  "contributions": ["Intégration Figma vers Elementor", "Pages de l'établissement", "Cartes et menus", "Galeries", "Page contact", "Intégration Google Maps", "Optimisation responsive"],
  "features": ["Pages de l'établissement et cartes", "Galeries d'images", "Google Maps sur la page contact", "Optimisation responsive"]
}$fr$::jsonb)
where slug = 'zeitoun-cafe' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Plateforme EdTech basée sur l'IA",
  "role": "Tests QA",
  "summary": "Tests fonctionnels, négatifs et de performance d'une plateforme éducative assistée par l'IA.",
  "description": "Assurance qualité d'une plateforme EdTech basée sur l'IA : gestion des devoirs, notation par grilles d'évaluation, validation de la notation assistée par IA et intégration Google Classroom.",
  "challenge": "Valider un produit où les résultats de l'IA font partie du parcours utilisateur : notes et feedbacks doivent rester cohérents, les rôles doivent être respectés et les cas limites doivent être gérés proprement.",
  "contributions": ["Scénarios fonctionnels", "Parcours de gestion des devoirs", "Tests des grilles d'évaluation", "Validation de la notation assistée par IA", "Cohérence des notes et des feedbacks", "Tests négatifs", "Cas limites", "Rôles et droits d'accès", "Intégration Google Classroom", "Tests de performance", "Suivi des bugs dans Jira", "Tableaux de bord Power BI"],
  "features": ["Scénarios fonctionnels de bout en bout pour les devoirs", "Validation de la notation assistée par IA au regard des grilles d'évaluation", "Contrôle des rôles et des droits d'accès", "Suivi des bugs dans Jira, reporting dans Power BI"]
}$fr$::jsonb)
where slug = 'remedia' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Plateforme de revues scientifiques",
  "role": "Tests QA",
  "summary": "Tests de la gestion des articles, des données auteurs et de la recherche sur une plateforme de revues.",
  "description": "Assurance qualité d'une plateforme de revues scientifiques : gestion des articles, données des auteurs, recherche, formulaires et validation des API.",
  "challenge": "Garantir la fiabilité d'une plateforme d'édition riche en données : articles et fiches auteurs doivent être exacts, la recherche doit renvoyer les bons résultats et le rendu doit correspondre au design.",
  "contributions": ["Tests de la gestion des articles", "Validation des données auteurs", "Tests de la recherche", "Formulaires d'inscription et de contact", "Validation des API", "Conformité aux maquettes Figma", "Suivi des bugs dans Jira"],
  "features": ["Validation des données des articles et des auteurs", "Tests de pertinence de la recherche et des cas limites", "Validation des réponses d'API", "Contrôles de conformité au design Figma"]
}$fr$::jsonb)
where slug = 'researchguide' and not (translations ? 'fr');

update public.projects set translations = jsonb_set(translations, '{fr}', $fr${
  "sector": "Plateforme B2B agroalimentaire",
  "role": "Tests QA",
  "summary": "Tests des parcours, des rôles et du responsive sur une plateforme B2B agroalimentaire.",
  "description": "Assurance qualité d'une plateforme B2B : inscription, authentification, rôles, networking et événements, avec validation du responsive et des données.",
  "challenge": "Couvrir de nombreux profils et parcours utilisateurs : chaque rôle doit voir les bonnes informations, les fonctionnalités de networking et d'événements doivent rester cohérentes et l'interface doit fonctionner sur tous les appareils.",
  "contributions": ["Parcours utilisateurs", "Inscription", "Authentification", "Interface", "Rôles", "Networking", "Événements", "Tests responsive", "Validation des données"],
  "features": ["Parcours d'inscription et d'authentification", "Contrôle des accès par rôle", "Parcours networking et événements", "Validation du responsive et des données"]
}$fr$::jsonb)
where slug = 'the-foodeshow' and not (translations ? 'fr');
