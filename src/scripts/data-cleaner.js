// data-cleaner.js
// Nettoie automatiquement les données corrompues de l'inventaire au chargement

(function(){
    console.log('🧹 Démarrage du nettoyage des données...');
    
    // Fonction pour vérifier si un article est valide
    function isValidItem(item){
        if(!item || typeof item !== 'object') return false;
        if(!item.name || typeof item.name !== 'string') return false;
        if(!item.category || typeof item.category !== 'string') return false;
        if(typeof item.qty !== 'number' || item.qty < 0) return false;
        if(!item.location || typeof item.location !== 'string') return false;
        
        // Vérifier qu'il n'y a pas trop de caractères spéciaux/corrompus
        const dataToCheck = `${item.id || ''}${item.name}${item.category}${item.location}${item.brand || ''}`;
        
        // Compter les caractères non-ASCII ou corrompus
        const corruptedChars = (dataToCheck.match(/[^\x20-\x7E\u00C0-\u017F]/g) || []).length;
        
        // Si > 15% de caractères corrompus, c'est probablement invalide
        if(corruptedChars / dataToCheck.length > 0.15){
            console.warn(`⚠️ Article corrompu détecté: ${item.id || 'N/A'}`, {
                name: item.name,
                corruptedRatio: (corruptedChars / dataToCheck.length * 100).toFixed(1) + '%'
            });
            return false;
        }
        
        return true;
    }
    
    // Nettoyer l'inventaire
    function cleanInventory(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) {
            console.log('✅ Pas d\'inventaire à nettoyer');
            return { cleaned: 0, total: 0 };
        }
        
        try {
            let items = JSON.parse(raw);
            const beforeCount = items.length;
            
            // Filtrer les articles valides
            items = items.filter(item => isValidItem(item));
            
            const afterCount = items.length;
            const removed = beforeCount - afterCount;
            
            if(removed > 0){
                // Sauvegarder l'inventaire nettoyé
                localStorage.setItem('iset_inventory', JSON.stringify(items));
                console.log(`✅ Nettoyage terminé: ${removed} article(s) corrompu(s) supprimé(s)`);
                console.log(`📊 Articles restants: ${afterCount}`);
                
                return { cleaned: removed, total: afterCount };
            } else {
                console.log('✅ Aucune donnée corrompue trouvée');
                return { cleaned: 0, total: afterCount };
            }
            
        } catch(e) {
            console.error('❌ Erreur lors du nettoyage:', e);
            return { cleaned: 0, total: 0, error: true };
        }
    }
    
    // Nettoyer automatiquement au chargement
    const result = cleanInventory();
    
    // Afficher un message si des données ont été nettoyées
    if(result.cleaned > 0){
        // Attendre que le DOM soit chargé pour afficher le message
        if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', function(){
                showCleanupNotification(result.cleaned, result.total);
            });
        } else {
            showCleanupNotification(result.cleaned, result.total);
        }
    }
    
    function showCleanupNotification(cleaned, total){
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 350px;
            animation: slideInRight 0.4s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 24px;">🧹</div>
                <div>
                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 4px;">
                        Nettoyage effectué
                    </div>
                    <div style="font-size: 13px; opacity: 0.95;">
                        ${cleaned} article(s) corrompu(s) supprimé(s)<br>
                        ${total} article(s) valide(s) conservé(s)
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: rgba(255,255,255,0.2); border: none; color: white; 
                               cursor: pointer; padding: 4px 8px; border-radius: 4px; margin-left: auto;">
                    ✕
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-fermer après 8 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 8000);
    }
    
    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Exposer la fonction de nettoyage manuel
    window.cleanCorruptedData = cleanInventory;
    
})();
