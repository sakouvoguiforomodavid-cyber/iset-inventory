// stats-display.js
// Gère l'affichage des statistiques du dashboard et pages statistiques

(function(){
    // Récupère l'inventaire
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) return [];
        try {
            return JSON.parse(raw);
        } catch(e) {
            console.error('Erreur parsing inventaire:', e);
            return [];
        }
    }

    // Récupère les utilisateurs
    function getAllUsers(){
        const raw = localStorage.getItem('iset_all_users');
        if(!raw) return [];
        try {
            return JSON.parse(raw);
        } catch(e) {
            console.error('Erreur parsing utilisateurs:', e);
            return [];
        }
    }

    // Récupère les paramètres système
    function getSettings(){
        const raw = localStorage.getItem('iset_system_settings');
        if(!raw) return {};
        try {
            return JSON.parse(raw);
        } catch(e) {
            return {};
        }
    }

    // Récupère les catégories
    function getCategories(){
        const raw = localStorage.getItem('iset_categories');
        if(!raw) return [];
        try {
            return JSON.parse(raw);
        } catch(e) {
            return {};
        }
    }

    // Calcule les statistiques complètes
    function calculateCompleteStats(){
        const items = getInventory();
        const users = getAllUsers();
        const categories = getCategories();
        const settings = getSettings();
        const lowStockThreshold = settings.lowStockThreshold || 5;

        return {
            totalItems: items.length,
            lowStock: items.filter(i => i.qty < lowStockThreshold).length,
            userCount: users.length,
            categoryCount: Array.isArray(categories) ? categories.length : Object.keys(categories).length,

        };
    }

    // Met à jour les statistiques du dashboard
    function updateStatsDisplay(){
        const stats = calculateCompleteStats();

        console.log('📊 Stats Update:', { 
            total: stats.totalItems, 
            lowStock: stats.lowStock, 
            users: stats.userCount 
        });

        // Affiche les statistiques
        const totalItemsEl = document.getElementById('totalItems');
        const lowStockEl = document.getElementById('lowStockCount');
        const userCountEl = document.getElementById('userCount');

        if(totalItemsEl) {
            totalItemsEl.textContent = stats.totalItems;
            console.log('✓ Total items: ' + stats.totalItems);
        }
        if(lowStockEl) {
            lowStockEl.textContent = stats.lowStock;
            console.log('✓ Low stock: ' + stats.lowStock);
        }
        if(userCountEl) {
            userCountEl.textContent = stats.userCount;
            console.log('✓ User count: ' + stats.userCount);
        }

        // Émettre un événement pour que d'autres modules s'abonnent
        window.dispatchEvent(new CustomEvent('statsUpdated', { detail: stats }));
    }

    // Initialise immédiatement et plusieurs fois pour être sûr
    updateStatsDisplay();
    
    // Re-affiche au chargement du DOM
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){
            setTimeout(updateStatsDisplay, 300);
        });
    } else {
        setTimeout(updateStatsDisplay, 300);
    }

    // Rafraîchir chaque minute
    setInterval(updateStatsDisplay, 60000);

    // Export pour utilisation externe
    window.updateStatsDisplay = updateStatsDisplay;
    window.calculateCompleteStats = calculateCompleteStats;
    window.getInventory = getInventory;
    window.getAllUsers = getAllUsers;
    window.getSettings = getSettings;
    window.getCategories = getCategories;

})();