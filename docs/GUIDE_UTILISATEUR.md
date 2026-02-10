# 📖 Guide Utilisateur - ISET Inventory Management

> **Guide complet pour utiliser mon application de gestion de stock**  
> Par Foromo Sakouvogui

---

## 👋 Bienvenue !

Salut ! Si vous lisez ce guide, c'est que vous allez utiliser mon application de gestion de stock pour l'ISET. Je vais vous expliquer **tout ce que vous devez savoir** pour l'utiliser efficacement, même si vous n'êtes pas très à l'aise avec l'informatique.

Pas d'inquiétude, j'ai conçu cette application pour qu'elle soit **simple et intuitive** ! 

---

## 🚀 Premiers pas

### Lancer l'application

1. **Ouvrez le fichier** `src/pages/index.html` avec votre navigateur web (Chrome, Firefox, Edge...)

2. Vous arrivez sur **la page d'accueil** :
   - Vous voyez le logo de l'ISET
   - Un bouton "Démarrer"
   
3. **Cliquez sur "Démarrer"**

4. Vous êtes redirigé vers **la page de connexion**

### Se connecter

#### Première connexion (compte admin par défaut)

J'ai créé un compte administrateur pour vous :

```
Nom d'utilisateur : admin
Mot de passe      : admin123
```

**⚠️ Important** : Changez ce mot de passe après votre première connexion !

#### Connexion normale

1. Entrez votre **nom d'utilisateur**
2. Entrez votre **mot de passe**
3. Cliquez sur **"Se connecter"**

Si vos identifiants sont corrects, vous êtes redirigé vers le **tableau de bord** !

### Se déconnecter

Pour vous déconnecter en toute sécurité :

1. Cliquez sur le bouton **"Déconnexion"** en haut à droite
2. Vous êtes redirigé vers la page de connexion

**Conseil** : Déconnectez-vous toujours quand vous avez fini, surtout sur un ordinateur partagé !

---

## 🎯 Comprendre les rôles

Mon application gère **3 types d'utilisateurs** avec des permissions différentes :

### 1. 👨‍💼 Administrateur

**C'est vous si vous utilisez le compte "admin"**

**Peut faire** :
- ✅ Tout ce que les autres peuvent faire
- ✅ Ajouter/modifier/supprimer des utilisateurs
- ✅ Changer les rôles des utilisateurs
- ✅ Accéder à toutes les pages

**À utiliser pour** : Gestion complète du système

### 2. 📦 Gestionnaire

**Utilisateurs de confiance qui gèrent le stock**

**Peut faire** :
- ✅ Voir tous les articles
- ✅ Ajouter des articles
- ✅ Modifier des articles
- ✅ Supprimer des articles
- ✅ Importer/Exporter des données
- ✅ Enregistrer entrées/sorties
- ❌ Ne peut PAS gérer les utilisateurs

**À utiliser pour** : Personnel du magasin

### 3. 👀 Visiteur

**Utilisateurs qui consultent sans modifier**

**Peut faire** :
- ✅ Voir tous les articles
- ✅ Rechercher des articles
- ✅ Consulter les statistiques
- ❌ Ne peut PAS modifier
- ❌ Ne peut PAS ajouter
- ❌ Ne peut PAS supprimer
- ❌ Ne peut PAS importer/exporter

**À utiliser pour** : Enseignants, superviseurs

---

## 📊 Le tableau de bord

Après la connexion, vous arrivez sur le **tableau de bord** - votre centre de commande !

### Les 3 cartes statistiques

#### 1. 📦 Articles en stock

Affiche le **nombre total d'articles** différents dans votre inventaire.

*Exemple : 45 signifie que vous avez 45 types d'articles différents*

#### 2. ⚠️ Stock faible

Affiche le nombre d'articles dont la **quantité est inférieure à 5 unités**.

C'est une **alerte** pour savoir quoi commander en priorité !

*Exemple : 3 signifie que 3 articles sont presque en rupture de stock*

#### 3. 👥 Utilisateurs actifs

Affiche le **nombre total d'utilisateurs** enregistrés dans le système.

*Exemple : 12 signifie qu'il y a 12 comptes utilisateurs*

### Menu de navigation

En haut du tableau de bord, vous avez le **menu principal** :

- **Dashboard** : Retour au tableau de bord
- **Gestion** : Gérer les articles (ajouter, modifier, supprimer)
- **Navigation** : Parcourir tout l'inventaire
- **Statistiques** : Voir des rapports détaillés
- **Utilisateurs** : Gérer les comptes (admin uniquement)
- **Déconnexion** : Se déconnecter

---

## 📝 Gérer les articles

C'est ici que vous allez passer le plus de temps !

### Ajouter un article

1. Cliquez sur **"Gestion"** dans le menu

2. Remplissez le **formulaire** en haut de page :

   - **ID** : Identifiant unique (ex: P001, M015, O042)
     - Commence par une lettre majuscule
     - Suivi de 3 chiffres
     - ✅ Exemples valides : P001, M999, O123
     - ❌ Exemples invalides : p001, PM01, 1234
   
   - **Nom** : Nom de l'article (ex: Clavier USB, Tournevis électrique)
     - Minimum 2 caractères
     - Soyez précis et descriptif
   
   - **Catégorie** : Type d'équipement
     - Choisissez dans la liste déroulante
     - Catégories disponibles :
       - Périphériques (claviers, souris, webcams...)
       - Ordinateurs (PC, laptops...)
       - Outils (tournevis, pinces...)
       - Électronique (composants, câbles...)
       - Mobilier (chaises, tables...)
       - Autres
   
   - **Marque** : Fabricant de l'équipement (ex: Logitech, HP, Bosch)
     - Important pour les garanties
     - Aide à identifier les modèles
   
   - **Quantité** : Nombre d'unités en stock
     - Doit être un nombre positif
     - Mettez 0 si rupture de stock
   
   - **Emplacement** : Où se trouve l'article (ex: Rayon A, Magasin B, Salle 205)
     - Soyez précis pour retrouver facilement

3. Cliquez sur **"Ajouter l'article"**

4. **Message de confirmation** : "Article ajouté avec succès !"

5. L'article apparaît immédiatement dans le **tableau** en dessous

### Modifier un article

1. Dans le **tableau des articles**, trouvez l'article à modifier

2. Cliquez sur l'icône **✏️ (crayon)** dans la colonne "Actions"

3. Les informations se chargent dans le formulaire

4. **Modifiez** ce que vous voulez :
   - Changez la quantité (après un inventaire par exemple)
   - Corrigez une erreur de saisie
   - Mettez à jour l'emplacement si l'article a été déplacé

5. Cliquez sur **"Mettre à jour"**

6. **Message de confirmation** : "Article modifié avec succès !"

**Astuce** : Vous ne pouvez PAS modifier l'ID (identifiant unique)

### Supprimer un article

**⚠️ Attention : Cette action est IRRÉVERSIBLE !**

1. Dans le **tableau**, trouvez l'article à supprimer

2. Cliquez sur l'icône **🗑️ (poubelle)** dans la colonne "Actions"

3. Une **fenêtre de confirmation** s'affiche :
   ```
   Êtes-vous sûr de vouloir supprimer cet article ?
   [Annuler] [Confirmer]
   ```

4. Cliquez sur **"Confirmer"** pour supprimer définitivement

5. L'article disparaît immédiatement du tableau

**Conseil** : Plutôt que de supprimer, vous pouvez mettre la quantité à 0 pour garder l'historique.

---

## 🔍 Rechercher et filtrer

Le tableau affiche tous vos articles, mais comment trouver rapidement ce que vous cherchez ?

### Recherche rapide

1. **Barre de recherche** en haut du tableau
   
2. Tapez n'importe quoi :
   - Un nom (ex: "clavier")
   - Un ID (ex: "P001")
   - Une marque (ex: "Logitech")
   - Un emplacement (ex: "Rayon A")

3. **Résultats en temps réel** : Le tableau se met à jour automatiquement pendant que vous tapez !

### Filtrer par catégorie

1. **Menu déroulant "Catégorie"** au-dessus du tableau

2. Sélectionnez une catégorie :
   - "Toutes" : Affiche tout (par défaut)
   - "Périphériques" : Uniquement les périphériques
   - "Ordinateurs" : Uniquement les PC
   - etc.

3. Le tableau affiche **uniquement** les articles de cette catégorie

### Combiner recherche et filtre

Vous pouvez **combiner** les deux pour une recherche ultra-précise !

*Exemple* : 
- Filtre : "Périphériques"
- Recherche : "Logitech"
- Résultat : Tous les périphériques de marque Logitech

---

## 📥 Importer des données CSV

Vous avez un fichier Excel avec plein d'articles ? Parfait ! Je vais vous montrer comment tout importer en une fois.

### Préparer votre fichier CSV

1. **Ouvrez Excel** avec vos données

2. Vos colonnes doivent être dans **cet ordre exact** :

   ```
   ID | Nom | Catégorie | Marque | Quantité | Emplacement
   ```

3. **Exemple de fichier** :

   ```csv
   ID,Nom,Catégorie,Marque,Quantité,Emplacement
   P001,Clavier USB,Périphériques,Logitech,25,Rayon A
   P002,Souris sans fil,Périphériques,Logitech,15,Rayon A
   M001,Perceuse électrique,Outils,Bosch,5,Magasin B
   ```

4. **Sauvegarder en CSV UTF-8** :
   - Fichier → Enregistrer sous
   - Type : **CSV UTF-8 (délimité par des virgules) (*.csv)**
   - ⚠️ Important : Bien choisir UTF-8 pour éviter les problèmes de caractères !

### Importer le fichier

1. Allez dans **"Gestion"**

2. Cliquez sur le bouton **"Importer CSV"**

3. **Sélectionnez votre fichier** CSV

4. Mon application fait des **vérifications automatiques** :
   - Format du fichier
   - Colonnes requises présentes
   - Données valides
   - Détection de caractères corrompus

5. Si tout est OK, vous voyez un **aperçu** :
   ```
   X articles valides trouvés
   Voulez-vous continuer l'import ?
   [Annuler] [Importer]
   ```

6. Cliquez sur **"Importer"**

7. **Message de confirmation** : "X articles importés avec succès !"

### Problèmes fréquents et solutions

#### ❌ "Format CSV invalide"

**Cause** : Les colonnes ne sont pas dans le bon ordre ou manquantes

**Solution** : Vérifiez que vous avez bien : ID, Nom, Catégorie, Marque, Quantité, Emplacement

#### ❌ Caractères bizarres après import (ex: `♦♦♦♠♠`)

**Cause** : Fichier pas sauvegardé en UTF-8

**Solution** : 
1. Ré-ouvrez Excel
2. Enregistrer sous → **CSV UTF-8** (pas juste "CSV")
3. Ré-importez

#### ❌ "Données corrompues détectées"

**Cause** : Problème d'encodage dans le fichier

**Solution** :
1. Ouvrez `utils/diagnostic.html` dans votre navigateur
2. Cliquez sur **"Option 1 : Nettoyer automatiquement"**
3. Confirmez le nettoyage
4. Vos données sont réparées !

**Conseil** : J'ai créé un fichier exemple dans `src/assets/examples/inventaire_exemple.csv`. Utilisez-le comme modèle !

---

## 📤 Exporter des données

Besoin de partager vos données ou faire une sauvegarde ? Facile !

### Export Excel (.xlsx)

**Pourquoi** : Pour manipuler les données dans Excel, faire des graphiques, partager avec d'autres services

**Comment** :

1. Allez dans **"Gestion"**

2. Cliquez sur **"Exporter Excel"**

3. Un fichier `.xlsx` se télécharge automatiquement :
   - Nom : `inventaire_2026-01-15.xlsx` (avec la date du jour)
   - Contenu : Tous vos articles dans un tableau propre

4. **Ouvrez-le avec Excel** : Tout est bien formaté, prêt à utiliser !

**Contenu du fichier** :
- Colonnes : ID, Nom, Catégorie, Marque, Quantité, Emplacement
- Toutes les données de votre inventaire

### Export PDF

**Pourquoi** : Pour imprimer, pour les réunions, pour les rapports officiels

**Comment** :

1. Allez dans **"Gestion"**

2. Cliquez sur **"Exporter PDF"**

3. Un fichier `.pdf` se télécharge automatiquement :
   - Nom : `inventaire_iset.pdf`

4. **Ouvrez-le** : Document professionnel prêt à imprimer !

**Contenu du PDF** :
- En-tête avec "Inventaire ISET"
- Date de génération
- Tableau complet de tous les articles
- Mise en page professionnelle

**Astuce** : Parfait pour les réunions ou l'archivage papier !

---

## 📈 Statistiques et rapports

Consultez des informations détaillées sur votre stock.

### Accéder aux statistiques

1. Cliquez sur **"Statistiques"** dans le menu

2. Vous voyez plusieurs **graphiques et tableaux** :

### Vue d'ensemble

- **Total des articles** par catégorie
- **Répartition** par emplacement
- **Articles les plus/moins nombreux**

### Alertes stock

Liste des articles avec **stock faible** (< 5 unités) :
- Nom de l'article
- Quantité actuelle
- Emplacement
- **Action recommandée** : Commander !

### Statistiques par marque

Combien d'équipements de chaque marque vous avez :
- Logitech : 45 articles
- HP : 32 articles
- Bosch : 18 articles
- etc.

**Utilité** : Pour les contrats de maintenance, les garanties

---

## 👥 Gérer les utilisateurs (Admin uniquement)

**⚠️ Cette section est uniquement pour les administrateurs**

Si vous n'êtes pas admin, vous ne verrez même pas le menu "Utilisateurs".

### Voir tous les utilisateurs

1. Cliquez sur **"Utilisateurs"** dans le menu

2. Tableau avec tous les comptes :
   - Nom d'utilisateur
   - Email
   - Rôle (Admin, Gestionnaire, Visiteur)
   - Date de création

### Ajouter un utilisateur

1. Formulaire en haut de page

2. Remplissez :
   - **Nom d'utilisateur** : Identifiant unique (ex: "jdupont")
   - **Email** : Adresse email (ex: "j.dupont@iset.tn")
   - **Mot de passe** : Minimum 6 caractères
   - **Rôle** : Choisissez selon les besoins
     - Admin : Confiance totale
     - Gestionnaire : Personnel du magasin
     - Visiteur : Consultation uniquement

3. Cliquez sur **"Ajouter l'utilisateur"**

4. **Conseils** :
   - Commencez toujours par le rôle Visiteur
   - Augmentez les permissions progressivement
   - Notez les mots de passe dans un endroit sûr

### Modifier un utilisateur

1. Cliquez sur **✏️** dans la ligne de l'utilisateur

2. Vous pouvez modifier :
   - Email
   - Rôle
   - Mot de passe (si besoin)

3. **Utilisations courantes** :
   - Promouvoir un visiteur en gestionnaire
   - Réinitialiser un mot de passe oublié
   - Mettre à jour un email

### Supprimer un utilisateur

1. Cliquez sur **🗑️** dans la ligne de l'utilisateur

2. Confirmation : "Êtes-vous sûr ?"

3. L'utilisateur ne peut plus se connecter

**⚠️ Attention** :
- Ne supprimez PAS votre propre compte admin !
- Ne supprimez PAS le dernier compte admin !
- L'action est irréversible

---

## 🔧 Outils de diagnostic

J'ai créé un outil spécial pour **réparer les données** si vous rencontrez des problèmes.

### Quand l'utiliser ?

- Après un import qui a mal tourné
- Si vous voyez des caractères bizarres (♦♦♦, ♠♠, etc.)
- Si des articles semblent corrompus

### Comment l'utiliser

1. **Ouvrez** le fichier `utils/diagnostic.html` dans votre navigateur

2. La page affiche :
   - **Nombre d'articles valides** (en vert)
   - **Nombre d'articles corrompus** (en rouge)

3. **Deux options** :

   #### Option 1 : Nettoyage automatique
   
   - Cliquez sur **"Nettoyer automatiquement"**
   - Confirmation : "X articles corrompus seront supprimés"
   - Cliquez **"OK"**
   - **Résultat** : Les articles illisibles sont supprimés, les bons sont conservés
   
   #### Option 2 : Réinitialisation complète
   
   - Cliquez sur **"Réinitialiser tout"**
   - ⚠️ **Attention** : TOUTES les données seront effacées !
   - Utile uniquement en dernier recours
   - Des données de démonstration seront rechargées

4. **Prévisualisation** :
   - Avant de nettoyer, vous pouvez voir quels articles sont considérés comme corrompus
   - Ça vous permet de vérifier

5. **Sauvegarde recommandée** : Exportez en Excel AVANT de nettoyer, au cas où !

---

## 💡 Conseils et bonnes pratiques

Voici mes **recommandations** basées sur mon expérience :

### Quotidien

1. **Déconnectez-vous** toujours après utilisation (sécurité)

2. **Vérifiez les alertes** de stock faible chaque jour

3. **Enregistrez les mouvements** dès qu'ils se produisent (ne pas attendre)

4. **Soyez précis** dans les emplacements pour retrouver facilement

### Hebdomadaire

1. **Exportez une sauvegarde Excel** (tous les vendredis par exemple)

2. **Vérifiez** qu'il n'y a pas d'articles en doublon

3. **Nettoyez** les articles avec quantité = 0 depuis longtemps

### Mensuel

1. **Faites un inventaire physique** et mettez à jour les quantités

2. **Générez un rapport PDF** pour l'archivage

3. **Vérifiez les comptes utilisateurs** (supprimer les comptes inactifs)

### Sécurité

1. **Changez les mots de passe** par défaut immédiatement

2. **Ne partagez jamais** vos identifiants

3. **Utilisez des mots de passe forts** (minimum 8 caractères, lettres + chiffres)

4. **Limitez les admins** : 2-3 maximum

### Performance

1. **Évitez d'avoir des milliers d'articles** (localStorage limité à ~5-10 MB)
   - Si vous dépassez 1000 articles, pensez à archiver les anciens

2. **Nettoyez régulièrement** avec l'outil de diagnostic

3. **Utilisez Chrome ou Firefox** pour de meilleures performances

---

## ❓ FAQ - Questions fréquentes

### Général

**Q : L'application fonctionne-t-elle hors ligne ?**  
R : Oui ! Toutes les données sont stockées dans votre navigateur. Pas besoin d'Internet.

**Q : Mes données sont-elles sauvegardées ?**  
R : Oui, automatiquement dans le localStorage de votre navigateur. Mais attention : si vous nettoyez l'historique du navigateur, vous perdez tout ! D'où l'importance des exports Excel réguliers.

**Q : Puis-je utiliser l'application sur mon téléphone ?**  
R : Oui, l'application est responsive. Par contre, pour le confort, je recommande un ordinateur ou une tablette pour la gestion.

**Q : Combien d'articles puis-je stocker ?**  
R : Environ 5000-10000 articles maximum (limitation du localStorage). Pour plus, il faudrait migrer vers une vraie base de données.

### Import/Export

**Q : Pourquoi mes caractères sont bizarres après import ?**  
R : Problème d'encodage. Sauvegardez votre Excel en **CSV UTF-8** (pas juste CSV). Voir section [Importer des données](#-importer-des-données-csv).

**Q : Je peux importer depuis Google Sheets ?**  
R : Oui ! Google Sheets → Fichier → Télécharger → CSV. Ensuite importez normalement.

**Q : Le PDF ne se télécharge pas**  
R : Vérifiez que votre navigateur n'a pas bloqué le popup. Autorisez les téléchargements pour cette page.

### Utilisateurs

**Q : J'ai oublié mon mot de passe**  
R : Demandez à un administrateur de le réinitialiser dans la section "Utilisateurs".

**Q : Puis-je avoir plusieurs admins ?**  
R : Oui, mais je recommande 2-3 maximum pour des raisons de sécurité.

**Q : Un visiteur peut-il voir les quantités ?**  
R : Oui, il peut tout voir, mais ne peut rien modifier.

### Problèmes

**Q : Le tableau est vide alors que j'ai des articles**  
R : 
1. Actualisez la page (F5)
2. Vérifiez que vous n'avez pas un filtre actif
3. Ouvrez la console du navigateur (F12) pour voir s'il y a des erreurs

**Q : "Cet ID existe déjà"**  
R : Chaque article doit avoir un ID unique. Choisissez un autre ID (ex: P001, P002, P003...).

**Q : L'application est lente**  
R :
1. Trop d'articles ? Archivez les anciens
2. Utilisez l'outil de diagnostic pour nettoyer
3. Essayez un autre navigateur (Chrome recommandé)

---

## 🆘 Besoin d'aide ?

Si vous avez un problème que ce guide ne résout pas :

1. **Vérifiez la console** (F12) pour voir les erreurs

2. **Essayez l'outil de diagnostic** (`utils/diagnostic.html`)

3. **Exportez vos données** (sécurité) avant toute manipulation

4. **Contactez-moi** : Foromo Sakouvogui
   - Email : foromo.sakouvogui@iset.tn
   - Je serai ravi de vous aider !

---

## 🎓 Pour aller plus loin

Vous maîtrisez les bases ? Voici des fonctionnalités avancées :

### Raccourcis clavier (à venir v2.1)

- `Ctrl + N` : Nouveau article
- `Ctrl + S` : Sauvegarder
- `Ctrl + F` : Recherche
- `Échap` : Fermer modal

### API et intégration (à venir v2.1)

Pour les développeurs : Une API REST sera disponible pour intégrer l'application avec d'autres systèmes.

### Mode multi-magasins (à venir v2.2)

Gérer plusieurs magasins/entrepôts avec des stocks séparés.

---

## 📝 Historique des mises à jour

- **v2.0.0** (15/01/2026) : Restructuration complète, refactoring Prix→Marque
- **v1.5.0** (13/01/2026) : Ajout import CSV et exports Excel/PDF
- **v1.0.0** (10/01/2026) : Version initiale stable

---

<div align="center">

**Merci d'utiliser mon application ! 🙏**

J'espère qu'elle vous simplifiera la vie autant qu'elle a simplifié celle de l'ISET.

Si vous avez des suggestions d'amélioration, je suis tout ouïe !

**Créé avec ❤️ par Foromo SAKOUVOGUI**  
Étudiant L1 - ISET - Janvier 2026

© 2026 Foromo Sakouvogui - Tous droits réservés

</div>
