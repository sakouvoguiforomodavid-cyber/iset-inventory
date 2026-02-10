## 🔧 Guide de Nettoyage des Données Excel Corrompues

### 📋 Problème

Vous avez importé un fichier Excel et les données affichées sont illisibles (caractères spéciaux : `{p@♦♦♦M2♦♦♦♦♦♦♦→` etc.) et vous ne pouvez pas supprimer ces entrées.

**Cause :** Excel n'a pas été exporté en UTF-8 ou le format n'était pas compatible CSV.

---

### ✅ Solution Rapide (3 étapes)

#### Étape 1️⃣ : Ouvrir le Diagnostic
- Allez au **Tableau de bord** → Inventaire
- Cliquez sur le bouton **🔧 Diagnostic** (en bas des boutons d'action)

#### Étape 2️⃣ : Vérifier l'état
- La page affiche le **nombre d'articles corrompus**
- Vous voyez une préview des données problématiques

#### Étape 3️⃣ : Nettoyer
- Cliquez sur le bouton **🧹 Nettoyer les données**
- Confirmez la suppression
- ✓ Les articles corrompus sont supprimés

---

### 🛠️ Alternative : Nettoyer via Console

Si le bouton ne fonctionne pas, ouvrez la console du navigateur (F12) et tapez :

```javascript
window.cleanCorruptedData()
```

Cela affichera un message avec le nombre d'articles supprimés.

---

### 📊 Ce que le Diagnostic Vérifie

✓ Nombre total d'articles
✓ Articles **valides** (format correct)
✓ Articles **corrompus** (mal encodés)
✓ Nombre d'utilisateurs
✓ État du localStorage

---

### 📥 Comment Importer Correctement Excel

**Pour éviter ce problème à l'avenir :**

1. **Ouvrez votre Excel**
   - Fichier → Enregistrer sous
   - Format : **CSV UTF-8 (séparé par des virgules)**
   - Nom : `inventaire.csv`

2. **Structure du CSV requise**
   ```
   ID,Nom,Catégorie,Marque,Quantité,Emplacement
   P001,Clavier USB,Périphériques,Logitech,25,Rayon A
   P002,Souris sans fil,Périphériques,Corsair,30,Rayon A
   ```

3. **Importez dans le dashboard**
   - Allez à **Inventaire**
   - Cliquez **📥 Importer Excel/CSV**
   - Sélectionnez votre fichier CSV

4. **Vérifiez l'aperçu**
   - Avant d'importer, une preview s'affiche
   - Vérifiez que les données sont lisibles ✓
   - Cliquez **Importer** pour confirmer

---

### ❌ Erreurs Communes

| Erreur | Cause | Solution |
|--------|-------|----------|
| **Données illisibles après import** | Mauvais encodage | Exporter en UTF-8 |
| **Impossible de supprimer articles** | Format corrompu | Utiliser Diagnostic → Nettoyer |
| **CSV vide lors de l'import** | Fichier Excel non sauvegardé en CSV | Enregistrer sous → CSV UTF-8 |
| **Colonnes non reconnues** | Noms de colonnes incorrects | Utiliser le modèle CSV fourni |

---

### 📋 Télécharger le Modèle

Le modèle CSV correct est disponible au **Tableau de bord** → **📋 Modèle CSV**

Ou créez-le vous-même :
```csv
ID,Nom,Catégorie,Marque,Quantité,Emplacement
```

---

### 🔐 Sauvegardes

**Important :** Avant de nettoyer, le système sauvegarde automatiquement :
- L'historique des suppressions dans les logs
- Vous pouvez retrouver les données dans **Gestion → Logs et audit**

---

### 💡 Conseils

1. **Testez d'abord avec un petit fichier** (2-3 lignes)
2. **Utilisez le modèle CSV fourni** pour éviter les erreurs
3. **Vérifiez l'aperçu avant d'importer**
4. **En cas de doute, utilisez le Diagnostic**

---

### 📞 Support

Si le problème persiste :
1. Ouvrez le **Diagnostic** (🔧)
2. Prenez une capture d'écran de l'état
3. Essayez "Nettoyer les données"
4. Si ça ne fonctionne pas, contactez l'administrateur

**Commande développeur (console) :**
```javascript
// Voir les données brutes
console.log(JSON.parse(localStorage.getItem('iset_inventory')))

// Nettoyer
window.cleanCorruptedData()
```
