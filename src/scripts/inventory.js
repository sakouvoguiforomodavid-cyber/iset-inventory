// inventory.js
// Je gère l'affichage et la manipulation du tableau d'inventaire.
// - Je remplis le tableau avec les articles depuis localStorage.
// - Je fournis les boutons modifier/supprimer selon le rôle.
// - Je gère le modal pour ajouter/modifier un article.

(function(){
    let currentEditId = null; // Je conserve l'ID de l'article en cours de modification

    // Je récupère l'utilisateur pour vérifier les droits
    const raw = localStorage.getItem('iset_user');
    const user = raw ? JSON.parse(raw) : null;
    const role = user ? user.role : 'visiteur';
    const isDev = user ? user.isDeveloper : false;

    // Je détermine si cet utilisateur peut modifier l'inventaire
    // ✅ CORRECTION: Admin ET Magasinier peuvent éditer l'inventaire!
    const canEdit = isDev || role === 'admin' || role === 'magasinier';

    // Helper : je charge les articles depuis localStorage
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) return [];
        try {
            let items = JSON.parse(raw);
            
            // Je nettoie les données corrompues
            items = items.filter(item => isValidItem(item));
            
            return items;
        } catch(e) {
            console.error('Erreur lors du chargement inventaire:', e);
            return [];
        }
    }
    
    // Je valide qu'un article n'est pas corrompu
    function isValidItem(item){
        if(!item || typeof item !== 'object') return false;
        if(!item.name || typeof item.name !== 'string') return false;
        if(!item.category || typeof item.category !== 'string') return false;
        if(typeof item.qty !== 'number' || item.qty < 0) return false;
        if(!item.location || typeof item.location !== 'string') return false;
        
        // Je vérifie qu'il n'y a pas trop de caractères spéciaux
        const dataToCheck = `${item.id}${item.name}${item.category}${item.location}`;
        const specialChars = (dataToCheck.match(/[^\x20-\x7E]/g) || []).length;
        
        // Si > 20% spéciaux, c'est probablement corrompu
        if(specialChars / dataToCheck.length > 0.2){
            console.warn(`⚠️ Article corrompu détecté: ${item.id}`, item);
            return false;
        }
        
        return true;
    }

    // Helper : je sauvegarde les articles
    function saveInventory(items){
        localStorage.setItem('iset_inventory', JSON.stringify(items));
    }

    // Je remplis le tableau principal avec tous les articles
    function renderInventory(){
        const items = getInventory();
        const tbody = document.getElementById('inventoryBody');
        if(!tbody) return;
        tbody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            const qtyClass = item.qty < 5 ? 'qty-low-stock' : 'qty-normal';
            
            row.innerHTML = `
                <td><strong>${item.id}</strong></td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.brand || 'Non spécifiée'}</td>
                <td class="${qtyClass}"><strong>${item.qty}</strong></td>
                <td>${item.location}</td>
                <td style="text-align: center;">
                    ${canEdit ? `<button class="btn-edit" data-id="${item.id}" title="Modifier">✏️ Modifier</button>
                               <button class="btn-delete" data-id="${item.id}" title="Supprimer">🗑️ Supprimer</button>` : '<span style="color: #999;">Lecture seule</span>'}
                </td>
            `;
            tbody.appendChild(row);
        });

        // J'attache les événements aux boutons d'édition et suppression
        if(canEdit){
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function(){
                    const id = this.getAttribute('data-id');
                    editItem(id);
                });
            });
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function(){
                    const id = this.getAttribute('data-id');
                    if(confirm('Êtes-vous sûr de vouloir supprimer cet article ?')){
                        deleteItem(id);
                    }
                });
            });
        }
        
        // Je déclenche un événement pour que csv-import.js sache que le tableau est prêt
        window.dispatchEvent(new Event('inventoryRendered'));
    }

    // Je remplis le tableau de consultation (visiteur) - lecture seule
    function renderInventoryVisiteur(){
        const items = getInventory();
        const tbody = document.getElementById('inventoryBodyVisiteur');
        if(!tbody) return;
        tbody.innerHTML = '';

        if(items.length === 0){
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px; color: #999;">📭 Aucun article en stock</td>`;
            tbody.appendChild(row);
            return;
        }

        items.forEach(item => {
            const row = document.createElement('tr');
            const qtyClass = item.qty < 5 ? 'qty-low-stock' : 'qty-normal';
            
            row.innerHTML = `
                <td><strong>${item.id}</strong></td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.brand || 'Non spécifiée'}</td>
                <td class="${qtyClass}"><strong>${item.qty}</strong></td>
                <td>${item.location}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Je mets à jour les statistiques
    function updateStats(){
        const items = getInventory();
        const total = items.length;
        const lowStock = items.filter(i => i.qty < 5).length;
        
        // Récupère le nombre d'utilisateurs
        const users = (localStorage.getItem('iset_all_users') ? JSON.parse(localStorage.getItem('iset_all_users')).length : 0);

        document.getElementById('totalItems') && (document.getElementById('totalItems').textContent = total);
        document.getElementById('lowStockCount') && (document.getElementById('lowStockCount').textContent = lowStock);
        document.getElementById('userCount') && (document.getElementById('userCount').textContent = users);
    }

    // J'ouvre le modal pour ajouter un article
    function openAddModal(){
        // ✅ Admin ET Magasinier peuvent ajouter
        if(!canEdit){
            alert('⛔ ERREUR: Vous n\'avez pas les permissions pour ajouter des articles!');
            return;
        }
        
        currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Ajouter un article';
        document.getElementById('itemForm').reset();
        document.getElementById('itemModal').style.display = 'block';
    }

    // J'ouvre le modal pour éditer un article
    function editItem(id){
        // ✅ Admin ET Magasinier peuvent éditer
        if(!canEdit){
            alert('⛔ ERREUR: Vous n\'avez pas les permissions pour modifier des articles!');
            return;
        }
        
        const items = getInventory();
        const item = items.find(i => i.id === id);
        if(!item) return;

        currentEditId = id;
        document.getElementById('modalTitle').textContent = 'Modifier l\'article';
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemQty').value = item.qty;
        document.getElementById('itemBrand').value = item.brand || '';
        document.getElementById('itemLocation').value = item.location;
        document.getElementById('itemModal').style.display = 'block';
    }

    // Je supprime un article
    function deleteItem(id){
        // ✅ Admin ET Magasinier peuvent supprimer
        if(!canEdit){
            alert('⛔ ERREUR: Vous n\'avez pas les permissions pour supprimer des articles!');
            return;
        }
        
        let items = getInventory();
        const deleted = items.find(i => i.id === id);
        items = items.filter(i => i.id !== id);
        saveInventory(items);
        // je logue l'action
        if(window.logAction && deleted){
            window.logAction('ITEM_DELETE', `Article supprimé : ${deleted.name} (ID: ${id})`);
        }
        renderInventory();
        updateStats();
    }

    // J'enregistre un article (nouveau ou modifié)
    function saveItem(data){
        let items = getInventory();
        if(currentEditId){
            // Je modifie l'article existant
            const idx = items.findIndex(i => i.id === currentEditId);
            if(idx !== -1){
                items[idx] = data;
                // je logue la modification
                if(window.logAction){
                    window.logAction('ITEM_EDIT', `Article modifié : ${data.name} (ID: ${data.id})`);
                }
            }
        } else {
            // J'ajoute un nouvel article
            items.push(data);
            // je logue l'ajout
            if(window.logAction){
                window.logAction('ITEM_ADD', `Article ajouté : ${data.name} (ID: ${data.id})`);
            }
        }
        saveInventory(items);
        renderInventory();
        updateStats();
        document.getElementById('itemModal').style.display = 'none';
    }

    // Initialisation au chargement du DOM
    document.addEventListener('DOMContentLoaded', function(){
        // Je montre/masque les sections selon le rôle
        const sections = {
            inventory: document.getElementById('inventorySection'),
            admin: document.getElementById('adminSection'),
            magasinier: document.getElementById('magasinierSection'),
            visiteur: document.getElementById('visiteurSection'),
            autres: document.getElementById('autresSection')
        };

        if(isDev){
            // Dev: accès à TOUT
            Object.values(sections).forEach(s => s && (s.style.display = 'block'));
        } else if(role === 'admin'){
            // Admin: inventaire + admin SEULEMENT
            sections.inventory && (sections.inventory.style.display = 'block');
            sections.admin && (sections.admin.style.display = 'block');
        } else if(role === 'magasinier'){
            // Magasinier: inventaire + sa section gestion E/S
            sections.inventory && (sections.inventory.style.display = 'block');
            sections.magasinier && (sections.magasinier.style.display = 'block');
        } else if(role === 'visiteur'){
            // Visiteur: lecture seule
            sections.visiteur && (sections.visiteur.style.display = 'block');
        } else if(role === 'autres'){
            // Autres: pas accès du tout
            sections.autres && (sections.autres.style.display = 'block');
        }

        // Je remplis les tableaux
        renderInventory();
        renderInventoryVisiteur();
        updateStats();

        // Je gère le bouton d'ajout
        const addBtn = document.getElementById('addItemBtn');
        if(addBtn){
            addBtn.addEventListener('click', openAddModal);
        }

        // Je gère le formulaire du modal
        const form = document.getElementById('itemForm');
        if(form){
            form.addEventListener('submit', function(e){
                e.preventDefault();
                const data = {
                    id: document.getElementById('itemId').value,
                    name: document.getElementById('itemName').value,
                    category: document.getElementById('itemCategory').value,
                    qty: parseInt(document.getElementById('itemQty').value),
                    brand: document.getElementById('itemBrand').value,
                    location: document.getElementById('itemLocation').value,
                    date: new Date().toISOString()
                };
                saveItem(data);
            });
        }

        // Je gère les boutons du modal
        const modal = document.getElementById('itemModal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');

        if(closeBtn){
            closeBtn.addEventListener('click', function(){
                modal.style.display = 'none';
            });
        }
        if(cancelBtn){
            cancelBtn.addEventListener('click', function(){
                modal.style.display = 'none';
            });
        }

        // Je ferme le modal si clic en dehors
        window.addEventListener('click', function(e){
            if(e.target === modal){
                modal.style.display = 'none';
            }
        });

        // Je gère la recherche
        const searchInput = document.getElementById('searchInput');
        if(searchInput){
            searchInput.addEventListener('keyup', function(){
                const query = this.value.toLowerCase();
                const items = getInventory();
                const filtered = items.filter(i => 
                    i.id.toLowerCase().includes(query) || 
                    i.name.toLowerCase().includes(query) ||
                    i.category.toLowerCase().includes(query)
                );
                const tbody = document.getElementById('inventoryBody');
                tbody.innerHTML = '';
                filtered.forEach(item => {
                    const row = document.createElement('tr');
                    const qtyClass = item.qty < 5 ? 'qty-low-stock' : 'qty-normal';
                    row.innerHTML = `
                        <td><strong>${item.id}</strong></td>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.brand || 'Non spécifiée'}</td>
                        <td class="${qtyClass}"><strong>${item.qty}</strong></td>
                        <td>${item.location}</td>
                        <td style="text-align: center;">${canEdit ? `<button class="btn-edit" data-id="${item.id}" title="Modifier">✏️ Modifier</button><button class="btn-delete" data-id="${item.id}" title="Supprimer">🗑️ Supprimer</button>` : '<span style="color: #999;">Lecture seule</span>'}</td>
                    `;
                    tbody.appendChild(row);
                });
                // Je ré-attache les événements après filtrage
                document.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', function(){
                        editItem(this.getAttribute('data-id'));
                    });
                });
                document.querySelectorAll('.btn-delete').forEach(btn => {
                    btn.addEventListener('click', function(){
                        if(confirm('Êtes-vous sûr ?')){
                            deleteItem(this.getAttribute('data-id'));
                        }
                    });
                });
            });
        }

        // Je gère la déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn){
            logoutBtn.addEventListener('click', function(e){
                e.preventDefault();
                // je logue la déconnexion
                const raw = localStorage.getItem('iset_session');
                const session = raw ? JSON.parse(raw) : null;
                const userEmail = session ? session.email : 'unknown';
                if(window.logAction){
                    window.logAction('LOGOUT', `Déconnexion de ${userEmail}`);
                }
                // Je supprime les deux clés (ancienne et nouvelle) pour une déconnexion complète
                localStorage.removeItem('iset_user');
                localStorage.removeItem('iset_session');
                window.location.href = 'login.html';
            });
        }
    });

    // J'exporte les fonctions pour utilisation globale
    window.renderInventory = renderInventory;
    window.updateStats = updateStats;
    window.saveItem = saveItem;
    window.deleteItem = deleteItem;
    window.getInventory = getInventory;
    
    // Je fournis une fonction pour nettoyer les données corrompues
    window.cleanCorruptedData = function(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) {
            alert('✓ Aucune donnée à nettoyer');
            return;
        }
        
        try {
            let items = JSON.parse(raw);
            const beforeCount = items.length;
            
            // Je filtre les articles corrompus
            items = items.filter(item => isValidItem(item));
            
            const afterCount = items.length;
            const removed = beforeCount - afterCount;
            
            if(removed > 0){
                localStorage.setItem('iset_inventory', JSON.stringify(items));
                alert(`✅ ${removed} article(s) corrompu(s) supprimé(s)\n${afterCount} article(s) valide(s) conservé(s)`);
                window.renderInventory();
                window.updateStats();
            } else {
                alert('✓ Aucune donnée corrompue détectée');
            }
        } catch(e){
            alert('❌ Erreur lors du nettoyage: ' + e.message);
            console.error(e);
        }
    };

})();
