# Configuration de Supabase pour House of Lighting

Pour que l'application fonctionne correctement avec votre base de données Supabase, suivez ces étapes :

## 1. Création des Tables
Copiez le contenu du fichier `SUPABASE_SETUP.sql` et exécutez-le dans le **SQL Editor** de votre tableau de bord Supabase. Cela créera les tables `categories`, `products`, et `messages` avec les politiques de sécurité (RLS) appropriées.

## 2. Configuration des Variables d'Environnement
Dans Google AI Studio, allez dans le panneau **Secrets** et ajoutez les variables suivantes :

- `VITE_SUPABASE_URL` : L'URL de votre projet Supabase (ex: `https://xyz.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` : Votre clé API anonyme (anon public)

Vous trouverez ces informations dans Supabase sous **Project Settings > API**.

## 3. Ajout de Produits
Vous pouvez ajouter vos produits directement via l'interface de Supabase dans la table `products`. 
Assurez-vous d'ajouter d'abord des catégories dans la table `categories`.

### Structure de la table `products` :
- `name` : Nom du produit
- `description` : Description détaillée
- `price` : Prix en TND
- `category_id` : ID de la catégorie associée
- `image_url` : URL de l'image du produit (utilisez des liens Unsplash ou hébergez vos images)
- `is_featured` : Cocher pour afficher comme produit populaire

## 4. Consultation des Messages
Les messages envoyés via le formulaire de contact seront stockés dans la table `messages`. Vous pouvez les consulter directement dans le tableau de bord Supabase.
