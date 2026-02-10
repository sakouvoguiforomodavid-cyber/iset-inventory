/**
 * Gestion des paramètres système
 * Module pour gérer tous les paramètres de l'application
 * Auteur: Foromo Sakouvogui
 */

const SettingsManager = {
    // Clé localStorage pour les paramètres
    SETTINGS_KEY: 'iset_system_settings',
    CATEGORIES_KEY: 'iset_categories',

    // Paramètres par défaut
    defaults: {
        lowStockThreshold: 5,
        enableNotifications: true,
        itemsPerPage: 25,
        dateFormat: 'FR',
        darkMode: false,
        defaultLanguage: 'fr'
    },

    // Catégories par défaut
    defaultCategories: [
        'Périphériques',
        'Ordinateurs',
        'Outils',
        'Électronique',
        'Mobilier',
        'Autres'
    ],

    /**
     * Initialiser les paramètres au premier lancement
     */
    initialize() {
        // Vérifier si les paramètres existent
        if (!localStorage.getItem(this.SETTINGS_KEY)) {
            this.saveSettings(this.defaults);
        }

        // Vérifier si les catégories existent
        if (!localStorage.getItem(this.CATEGORIES_KEY)) {
            this.saveCategories(this.defaultCategories);
        }
    },

    /**
     * Récupérer tous les paramètres
     */
    getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : this.defaults;
    },

    /**
     * Obtenir un paramètre spécifique
     */
    getSetting(key, defaultValue) {
        const settings = this.getSettings();
        return settings[key] !== undefined ? settings[key] : defaultValue;
    },

    /**
     * Sauvegarder les paramètres
     */
    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    },

    /**
     * Mettre à jour un paramètre
     */
    updateSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.saveSettings(settings);
    },

    /**
     * Récupérer les catégories
     */
    getCategories() {
        const categories = localStorage.getItem(this.CATEGORIES_KEY);
        return categories ? JSON.parse(categories) : this.defaultCategories;
    },

    /**
     * Sauvegarder les catégories
     */
    saveCategories(categories) {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    },

    /**
     * Ajouter une catégorie
     */
    addCategory(category) {
        if (!category || category.trim() === '') {
            return false;
        }

        const categories = this.getCategories();
        if (categories.includes(category)) {
            return false; // Catégorie existe déjà
        }

        categories.push(category);
        this.saveCategories(categories);
        return true;
    },

    /**
     * Supprimer une catégorie
     */
    deleteCategory(category) {
        let categories = this.getCategories();
        categories = categories.filter(c => c !== category);
        this.saveCategories(categories);
    },

    /**
     * Réinitialiser les paramètres par défaut
     */
    resetToDefaults() {
        this.saveSettings(this.defaults);
        this.saveCategories(this.defaultCategories);
    },

    /**
     * Exporter les paramètres en JSON
     */
    exportSettings() {
        const settings = this.getSettings();
        const categories = this.getCategories();
        
        const data = {
            timestamp: new Date().toISOString(),
            settings: settings,
            categories: categories,
            version: '2.0.0'
        };

        return JSON.stringify(data, null, 2);
    },

    /**
     * Importer les paramètres à partir d'un objet JSON
     */
    importSettings(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.settings || !data.categories) {
                throw new Error('Format de fichier invalide');
            }

            this.saveSettings(data.settings);
            this.saveCategories(data.categories);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            return false;
        }
    },

    /**
     * Obtenir le seuil de stock faible
     */
    getLowStockThreshold() {
        return this.getSetting('lowStockThreshold', 5);
    },

    /**
     * Obtenir le nombre d'articles par page
     */
    getItemsPerPage() {
        return parseInt(this.getSetting('itemsPerPage', 25));
    },

    /**
     * Vérifier si les notifications sont activées
     */
    areNotificationsEnabled() {
        return this.getSetting('enableNotifications', true);
    },

    /**
     * Formater une date selon les préférences
     */
    formatDate(date) {
        const dateFormat = this.getSetting('dateFormat', 'FR');
        const d = new Date(date);

        if (dateFormat === 'EN') {
            return d.toLocaleDateString('en-US');
        } else if (dateFormat === 'ISO') {
            return d.toISOString().split('T')[0];
        } else {
            return d.toLocaleDateString('fr-FR');
        }
    },

    /**
     * Obtenir les informations du système
     */
    getSystemInfo() {
        return {
            settings: this.getSettings(),
            categories: this.getCategories(),
            storageUsed: this.getStorageUsed(),
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Obtenir l'espace de stockage utilisé (approximatif)
     */
    getStorageUsed() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return (total / 1024).toFixed(2) + ' KB';
    }
};

// Initialiser au chargement
SettingsManager.initialize();

// =====================================================
// Fonctions UI pour la page des paramètres
// =====================================================

/**
 * Charger les paramètres dans l'interface
 */
function loadSettings() {
    const settings = SettingsManager.getSettings();
    
    // Charger les valeurs
    document.getElementById('lowStockThreshold').value = settings.lowStockThreshold;
    document.getElementById('enableNotifications').checked = settings.enableNotifications;
    document.getElementById('itemsPerPage').value = settings.itemsPerPage;
    document.getElementById('dateFormat').value = settings.dateFormat;
    document.getElementById('darkMode').checked = settings.darkMode;

    // Charger les catégories
    loadCategories();

    // Afficher l'utilisateur actuel
    const session = JSON.parse(localStorage.getItem('iset_session')) || {};
    document.getElementById('currentUser').textContent = session.username || 'Utilisateur';
}

/**
 * Charger et afficher les catégories
 */
function loadCategories() {
    const categories = SettingsManager.getCategories();
    const list = document.getElementById('categoryList');
    
    list.innerHTML = '';
    
    categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${escapeHtml(category)}</span>
            <button onclick="removeCategory('${escapeHtml(category)}')">Supprimer</button>
        `;
        list.appendChild(li);
    });
}

/**
 * Ajouter une nouvelle catégorie
 */
function addCategory() {
    const input = document.getElementById('newCategoryInput');
    const category = input.value.trim();

    if (!category) {
        showMessage('Veuillez entrer une catégorie', 'error');
        return;
    }

    if (SettingsManager.addCategory(category)) {
        showMessage('Catégorie ajoutée avec succès', 'success');
        input.value = '';
        loadCategories();
    } else {
        showMessage('Cette catégorie existe déjà', 'error');
    }
}

/**
 * Supprimer une catégorie
 */
function removeCategory(category) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${category}" ?`)) {
        SettingsManager.deleteCategory(category);
        showMessage('Catégorie supprimée', 'success');
        loadCategories();
    }
}

/**
 * Sauvegarder tous les paramètres
 */
function saveAllSettings() {
    const settings = {
        lowStockThreshold: parseInt(document.getElementById('lowStockThreshold').value),
        enableNotifications: document.getElementById('enableNotifications').checked,
        itemsPerPage: parseInt(document.getElementById('itemsPerPage').value),
        dateFormat: document.getElementById('dateFormat').value,
        darkMode: document.getElementById('darkMode').checked
    };

    SettingsManager.saveSettings(settings);
    showMessage('Paramètres enregistrés avec succès ! ✓', 'success');
    
    // Émettre un événement pour que les autres pages se mettent à jour
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
}

/**
 * Exporter les paramètres
 */
function exportSettings() {
    const data = SettingsManager.exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iset-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessage('Paramètres exportés avec succès', 'success');
}

/**
 * Importer les paramètres
 */
function importSettings() {
    const file = document.getElementById('importFile').files[0];
    
    if (!file) {
        showMessage('Veuillez sélectionner un fichier', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            if (SettingsManager.importSettings(content)) {
                showMessage('Paramètres importés avec succès !', 'success');
                loadSettings();
            } else {
                showMessage('Erreur lors de l\'import des paramètres', 'error');
            }
        } catch (error) {
            showMessage('Erreur: Fichier invalide', 'error');
        }
    };
    
    reader.readAsText(file);
}

/**
 * Nettoyer le cache
 */
function clearCache() {
    if (confirm('Êtes-vous sûr ? Cela libérera de l\'espace de stockage.')) {
        // Vous pouvez nettoyer les anciennes entrées ici si nécessaire
        showMessage('Cache nettoyé avec succès', 'success');
    }
}

/**
 * Réinitialiser tous les paramètres
 */
function resetAllSettings() {
    if (confirm('Êtes-vous VRAIMENT sûr ? Les paramètres par défaut seront restaurés.')) {
        if (confirm('DERNIÈRE CONFIRMATION: Cette action ne peut pas être annulée !')) {
            SettingsManager.resetToDefaults();
            showMessage('Paramètres réinitialisés aux valeurs par défaut', 'success');
            loadSettings();
        }
    }
}

/**
 * Supprimer TOUS les paramètres et données système
 */
function deleteAllSystemData() {
    if (confirm('⚠️ ATTENTION: Cela supprimera TOUS vos paramètres. Continuez ?')) {
        if (confirm('CECI EST IRRÉVERSIBLE! Êtes-vous absolument certain ?')) {
            localStorage.removeItem(SettingsManager.SETTINGS_KEY);
            localStorage.removeItem(SettingsManager.CATEGORIES_KEY);
            showMessage('Tous les paramètres système ont été supprimés', 'success');
            setTimeout(() => {
                window.location.href = '../pages/dashboard.html';
            }, 2000);
        }
    }
}

/**
 * Afficher un message
 */
function showMessage(message, type) {
    const messageEl = document.getElementById('statusMessage');
    messageEl.textContent = message;
    messageEl.className = `status-message ${type}`;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        messageEl.className = 'status-message';
    }, 5000);
}

/**
 * Retourner à la page précédente
 */
function goBack() {
    window.history.back();
}

/**
 * Échapper les caractères HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Déconnecter l'utilisateur
 */
function logoutUser() {
    localStorage.removeItem('iset_session');
    window.location.href = 'login.html';
}

// Charger les paramètres au chargement de la page
window.addEventListener('DOMContentLoaded', loadSettings);
