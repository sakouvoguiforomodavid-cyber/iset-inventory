# 🏫 Mon Système de Gestion de Stock ISET

> **Application web que j'ai développée pour gérer le stock d'équipements de l'ISET**  
> Projet réalisé dans le cadre de mon stage d'initiation

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com)
[![Status](https://img.shields.io/badge/status-production-green.svg)](https://github.com)
[![Auteur](https://img.shields.io/badge/auteur-Foromo%20Sakouvogui-blue)](https://github.com)

---

## 👋 Présentation

Bonjour ! Je m'appelle **Foromo Sakouvogui**, étudiant en **L1** à l'Institut Supérieur des Études Technologiques (ISET). J'ai développé cette application web dans le cadre de mon stage d'initiation pour répondre à un besoin réel : **gérer efficacement le stock d'équipements** de notre institut.

### Pourquoi ce projet ?

Au début de mon stage, j'ai constaté que la gestion des équipements se faisait encore manuellement, avec beaucoup de papiers et des fichiers Excel dispersés. J'ai donc décidé de créer une solution moderne et facile à utiliser qui permette de :

- Suivre tous les équipements en temps réel
- Gérer les entrées et sorties de matériel
- Savoir rapidement où se trouve chaque article
- Générer des rapports automatiquement
- Permettre à plusieurs utilisateurs de travailler ensemble

### Mon parcours sur ce projet

J'ai commencé par un modèle simple basé sur les prix (comme un système commercial), mais je me suis vite rendu compte que ce n'était pas adapté. L'ISET n'est pas un magasin ! J'ai donc complètement refondu mon application pour la transformer en **système de gestion d'équipements** basé sur les marques plutôt que les prix. Ça a demandé beaucoup de travail, mais le résultat est bien plus pertinent.

---

## 🎯 Ce que j'ai réalisé

### Fonctionnalités principales

Voici ce que mon application permet de faire :

#### 📦 Gestion complète du stock

- **Ajouter des articles** : J'ai créé un formulaire simple et rapide avec validation automatique
- **Modifier les informations** : Nom, marque, quantité, emplacement - tout est modifiable
- **Supprimer en toute sécurité** : Avec une confirmation pour éviter les erreurs
- **Rechercher facilement** : Par catégorie, marque ou emplacement
- **Voir les alertes** : Mon système détecte automatiquement les stocks faibles

#### 📊 Mouvements de stock

- **Enregistrer les entrées** : Quand on reçoit du nouveau matériel
- **Tracer les sorties** : Savoir qui a pris quoi et quand
- **Consulter l'historique** : Tous les mouvements sont enregistrés avec l'heure et l'utilisateur

#### 👥 Gestion des utilisateurs

J'ai implémenté un système complet d'authentification avec trois niveaux d'accès :

- **Administrateur** : Accès total (c'est moi !)
- **Gestionnaire** : Peut gérer le stock mais pas les utilisateurs
- **Visiteur** : Peut juste consulter, sans modifier

#### 📥📤 Import et Export

Une des parties dont je suis le plus fier :

- **Import CSV** : Avec détection automatique des erreurs d'encodage
- **Export Excel** : Génération de fichiers .xlsx professionnels
- **Export PDF** : Rapports imprimables avec le logo de l'ISET
- **Nettoyage automatique** : J'ai créé un outil pour réparer les données corrompues

#### 📈 Statistiques et rapports

Mon tableau de bord affiche en temps réel :
- Le nombre total d'articles en stock
- Les alertes pour stocks faibles (moins de 5 unités)
- Le nombre d'utilisateurs actifs

---

## 🛠️ Technologies que j'ai utilisées

J'ai volontairement choisi des technologies simples mais efficaces :

- **HTML5** : Pour la structure des pages
- **CSS3** : Pour le design (responsive, ça marche sur mobile !)
- **JavaScript vanilla** : Pas de framework compliqué, du JavaScript pur
- **localStorage** : Pour stocker les données directement dans le navigateur
- **SheetJS** : Pour générer les fichiers Excel
- **jsPDF** : Pour créer les PDF

Pourquoi du JavaScript vanilla ? Parce que je voulais vraiment **comprendre** comment tout fonctionne, sans me cacher derrière un framework. C'est plus formateur et ça m'a permis d'apprendre énormément.

---

## 📦 Comment installer mon application

### Ce dont vous avez besoin

- Un navigateur web récent (Chrome, Firefox, Edge...)
- C'est tout ! Pas besoin de serveur compliqué

### Installation

1. **Télécharger le projet**

```bash
git clone https://github.com/votre-repo/iset-inventory.git
cd iset-inventory
```

2. **Lancer l'application**

**Option simple** : Double-cliquer sur `src/pages/index.html`

**Option serveur local** (recommandée) :
```bash
cd src/pages
python -m http.server 8000
```
Puis ouvrir http://localhost:8000

3. **Se connecter**

J'ai créé un compte admin par défaut :
```
Utilisateur : admin
Mot de passe : admin123
```

---

## 📁 Organisation de mon projet

Voici comment j'ai organisé mes fichiers :

```
ISET-Inventory-Management/
│
├── 📁 src/                    # Tout mon code source
│   ├── 📁 pages/              # Les pages HTML que j'ai créées
│   ├── 📁 scripts/            # Mes fichiers JavaScript
│   ├── 📁 styles/             # Mes feuilles de style
│   └── 📁 assets/             # Images et fichiers exemples
│
├── 📁 docs/                   # Toute ma documentation
│   ├── ARCHITECTURE.md        # Comment j'ai conçu le système
│   ├── CHANGELOG.md           # Historique de mes modifications
│   └── RAPPORT_STAGE.md       # Mon rapport de stage complet
│
├── 📁 utils/                  # Mes outils de développement
│   ├── diagnostic.html        # Mon outil de réparation de données
│   └── dev-only.html          # Page pour les tests
│
└── README.md                  # Ce fichier
```

Pour plus de détails, consultez [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 💻 Comment utiliser l'application

### Guide rapide

1. **Ouvrir** `src/pages/index.html`
2. **Cliquer** sur "Démarrer"
3. **Se connecter** avec admin/admin123
4. **Explorer** les différentes sections :
   - **Dashboard** : Vue d'ensemble
   - **Gestion** : Ajouter/modifier/supprimer des articles
   - **Navigation** : Parcourir tout l'inventaire
   - **Statistiques** : Voir les rapports
   - **Utilisateurs** : Gérer les comptes (admin uniquement)

### Ajouter un article

1. Aller dans "Gestion du Stock"
2. Remplir le formulaire (ID, Nom, Catégorie, Marque, Quantité, Emplacement)
3. Cliquer sur "Ajouter l'article"

### Importer des données CSV

J'ai créé un système qui accepte ce format :
```csv
ID,Nom,Catégorie,Marque,Quantité,Emplacement
P001,Clavier USB,Périphériques,Logitech,25,Rayon A
```

Des exemples sont disponibles dans `src/assets/examples/`

---

## 📚 Documentation

J'ai écrit une documentation complète pour expliquer mon travail :

- **[Architecture Technique](docs/ARCHITECTURE.md)** : Comment j'ai conçu le système
- **[Historique des Versions](docs/CHANGELOG.md)** : Toutes mes modifications
- **[Rapport de Stage](docs/RAPPORT_STAGE.md)** : Mon rapport complet

---

## 🐛 Problèmes que j'ai résolus

### Import Excel corrompu

**Le problème** : Au début, quand on importait des fichiers Excel, il y avait des caractères bizarres partout (genre `{p@♦♦♦M2`).

**Ma solution** : J'ai créé un outil de diagnostic (`utils/diagnostic.html`) qui :
- Détecte automatiquement les données corrompues
- Permet de les prévisualiser
- Les nettoie en un clic

Pour l'utiliser : ouvrir `utils/diagnostic.html` et cliquer sur "Option 1 : Nettoyer automatiquement"

### Prix → Marque

**Le problème** : Mon système était initialement basé sur les prix, comme un magasin.

**Ma solution** : J'ai tout refondu pour utiliser les marques à la place. J'ai :
- Modifié le modèle de données
- Supprimé tous les calculs de "Valeur Totale"
- Mis à jour toutes les interfaces
- Adapté la documentation

Ça représente plusieurs jours de travail, mais c'était nécessaire !

---

## 🎓 Ce que j'ai appris

Ce projet m'a énormément apporté :

- **JavaScript** : J'ai vraiment compris comment ça fonctionne
- **Architecture logicielle** : Comment organiser un projet proprement
- **Git** : Gestion de versions et commits
- **Debugging** : Résoudre des bugs complexes (comme la corruption de données)
- **Documentation** : L'importance d'expliquer son code
- **Refactoring** : Comment améliorer du code existant

Le plus important : j'ai appris à **persévérer** quand ça ne marche pas du premier coup !

---

## 🔮 Mes plans pour la suite

J'ai déjà des idées pour améliorer l'application :

### Version 2.1 (prochainement)
- [ ] Ajouter un vrai backend (Node.js)
- [ ] Utiliser une base de données SQL
- [ ] Sécuriser mieux les mots de passe (hash)
- [ ] Ajouter une API REST

### Version 2.2
- [ ] Notifications en temps réel
- [ ] Scanner de codes-barres
- [ ] Mode hors ligne (PWA)
- [ ] Application mobile

---

## 📄 Licence et droits d'auteur

**© 2026 Foromo Sakouvogui - Tous droits réservés**

Ce projet a été entièrement développé par moi-même dans le cadre de mon stage d'initiation à l'ISET. Tous les droits d'auteur me sont réservés.

Licence : MIT (libre d'utilisation avec attribution)

---

## 👤 À propos de moi

**Foromo Sakouvogui**
- 🎓 Étudiant en L1 - ISET
- 💼 Stagiaire en développement web
- 📅 Période de stage : Janvier 2026
- 🎯 Passionné par le développement web et les solutions innovantes

---

## 🙏 Remerciements

Je tiens à remercier :

- **L'ISET** pour cette opportunité de stage
- **Mon encadrant** pour ses conseils précieux
- **L'équipe technique** pour leur soutien
- **Tous ceux qui utilisent mon application** et me donnent des retours

---

<div align="center">

**⭐ Si mon projet vous plaît, n'hésitez pas à le partager !**

Développé avec passion ❤️ par **Foromo Sakouvogui**

</div>
