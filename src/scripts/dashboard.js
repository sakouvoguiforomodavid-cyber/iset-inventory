// dashboard.js
// Je contrôle l'affichage du tableau de bord selon le rôle de l'utilisateur.
// - Je lis le user depuis localStorage (enregistré depuis le formulaire)
// - Je montre/masque les sections appropriées

(function(){
    // Je lis la session depuis la nouvelle clé iset_session (créée par auth-advanced.js)
    // Pour compatibilité, je vérifie aussi l'ancienne clé iset_user
    let raw = localStorage.getItem('iset_session');
    if(!raw) raw = localStorage.getItem('iset_user');
    
    const welcome = document.getElementById('welcome');
    if(!raw){
        // Si aucun utilisateur n'est trouvé, je redirige vers la page de connexion
        welcome && (welcome.textContent = 'Aucun utilisateur connecté. Je vous redirige vers la connexion...');
        setTimeout(()=> window.location.href = 'login.html', 1500);
        return;
    }

    const user = JSON.parse(raw);
    const role = user.role;
    const custom = user.customRole;
    const isDev = user.isDeveloper;

    // Message d'accueil personnalisé
    welcome && (welcome.textContent = `Bienvenue ${user.name} (${user.email}) — statut: ${isDev ? 'Développeur' : (role === 'autres' && custom ? custom : role)}`);

    // Les données d'inventaire et utilisateurs sont initialisées par init-demo-data.js
    // Pas besoin de les créer ici, ce qui évite les conflits

    // Je cache tout d'abord toutes les sections puis j'affiche celle(s) appropriée(s)
    const sections = {
        admin: document.getElementById('adminSection'),
        magasinier: document.getElementById('magasinierSection'),
        visiteur: document.getElementById('visiteurSection'),
        autres: document.getElementById('autresSection'),
        developer: document.getElementById('developerSection')
    };

    // Si je suis le développeur, j'affiche tout
    if(isDev){
        // Je montre toutes les sections quand je suis le dev
        Object.values(sections).forEach(s => { if(s) s.style.display = 'block'; });
        return;
    }

    // Logique d'affichage selon le rôle
    if(role === 'admin'){
        sections.admin && (sections.admin.style.display = 'block');
    } else if(role === 'magasinier'){
        // Magasinier: sa section + stats et gestion (mais pas admin)
        sections.magasinier && (sections.magasinier.style.display = 'block');
    } else if(role === 'visiteur'){
        sections.visiteur && (sections.visiteur.style.display = 'block');
    } else if(role === 'autres'){
        sections.autres && (sections.autres.style.display = 'block');
        const display = document.getElementById('customRoleDisplay');
        display && (display.textContent = custom ? custom : 'Statut personnalisé non fourni');
    }

})();

// Gère l'ouverture automatique des modals depuis la page gestion
document.addEventListener('DOMContentLoaded', function(){
    const openModal = sessionStorage.getItem('openModal');
    if(openModal){
        sessionStorage.removeItem('openModal');
        
        // Petit délai pour s'assurer que le DOM est complètement chargé
        setTimeout(function(){
            if(openModal === 'entry'){
                // Déclenche l'ouverture du modal d'entrée de stock
                if(typeof openStockEntryModal === 'function'){
                    openStockEntryModal();
                }
            } else if(openModal === 'exit'){
                // Déclenche l'ouverture du modal de sortie de stock
                if(typeof openStockExitModal === 'function'){
                    openStockExitModal();
                }
            } else if(openModal === 'add'){
                // Déclenche l'ouverture du modal d'ajout d'article
                if(typeof openItemModal === 'function'){
                    openItemModal();
                }
            } else if(openModal === 'import'){
                // Déclenche l'import CSV
                if(typeof document.getElementById('csvImportInput') !== 'undefined'){
                    document.getElementById('csvImportInput').click();
                }
            } else if(openModal === 'export'){
                // Déclenche l'export CSV
                if(typeof window.exportInventorySectionToCSV === 'function'){
                    window.exportInventorySectionToCSV();
                }
            }
        }, 300);
    }
});
