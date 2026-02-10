// quick-add-items.js
// Permet aux utilisateurs éligibles de remplir rapidement le tableau d'inventaire
// avec une interface de saisie rapide et efficace

(function(){
    // Vérifie si l'utilisateur peut éditer
    const raw = localStorage.getItem('iset_user');
    const user = raw ? JSON.parse(raw) : null;
    const role = user ? user.role : 'visiteur';
    const isDev = user ? user.isDeveloper : false;
    const canEdit = isDev || role === 'admin' || role === 'magasinier' || role === 'autres';

    if(!canEdit) return; // L'utilisateur ne peut pas éditer

    // Helper : récupère l'inventaire
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) return [];
        try {
            return JSON.parse(raw);
        } catch(e) {
            return [];
        }
    }

    // Helper : sauvegarde l'inventaire
    function saveInventory(items){
        localStorage.setItem('iset_inventory', JSON.stringify(items));
    }

    // Initialisation
    document.addEventListener('DOMContentLoaded', function(){
        const inventoryTable = document.getElementById('inventoryTable');
        const tbody = document.getElementById('inventoryBody');

        if(!inventoryTable || !tbody) return;

        // Crée une ligne vide à la fin du tableau pour saisie rapide
        const tfoot = document.createElement('tfoot');
        tfoot.innerHTML = `
            <tr id="quickAddRow">
                <td><input type="text" id="quickId" placeholder="P001" style="width: 100%; padding: 6px;" /></td>
                <td><input type="text" id="quickName" placeholder="Nom article" style="width: 100%; padding: 6px;" /></td>
                <td><input type="text" id="quickCategory" placeholder="Catégorie" style="width: 100%; padding: 6px;" /></td>
                <td><input type="text" id="quickBrand" placeholder="Marque" style="width: 100%; padding: 6px;" /></td>
                <td><input type="number" id="quickQty" placeholder="Qty" style="width: 100%; padding: 6px; text-align: right;" value="1" /></td>
                <td><input type="text" id="quickLocation" placeholder="Lieu" style="width: 100%; padding: 6px;" /></td>
                <td style="text-align: center;">
                    <button id="quickAddBtn" type="button" class="btn-primary" style="padding: 6px 8px; font-size: 12px; margin-right: 3px;">➕ Ajouter</button>
                    <button id="quickClearBtn" type="button" class="btn-secondary" style="padding: 6px 8px; font-size: 12px;">🔄</button>
                </td>
            </tr>
        `;
        inventoryTable.appendChild(tfoot);

        // Gère l'ajout rapide
        const quickAddBtn = document.getElementById('quickAddBtn');
        const quickClearBtn = document.getElementById('quickClearBtn');

        quickAddBtn.addEventListener('click', function(){
            const id = document.getElementById('quickId').value.trim();
            const name = document.getElementById('quickName').value.trim();
            const category = document.getElementById('quickCategory').value.trim();
            const brand = document.getElementById('quickBrand').value.trim();
            const qty = parseInt(document.getElementById('quickQty').value);
            const location = document.getElementById('quickLocation').value.trim();

            // Validation
            if(!id || !name || !category || !brand || isNaN(qty) || !location){
                alert('⚠️ Veuillez remplir tous les champs');
                return;
            }

            if(qty < 0){
                alert('⚠️ La quantité doit être positive');
                return;
            }

            // Vérifie si l'ID existe déjà
            const inventory = getInventory();
            const exists = inventory.some(i => i.id === id);

            if(exists){
                alert(`⚠️ L'ID "${id}" existe déjà. Veuillez utiliser un ID unique ou modifier l'article existant.`);
                return;
            }

            // Ajoute l'article
            const newItem = {
                id,
                name,
                category,
                brand,
                qty,
                location,
                date: new Date().toISOString()
            };

            inventory.push(newItem);
            saveInventory(inventory);

            // Logue l'action
            if(window.logAction){
                window.logAction('ITEM_ADD', `Article ajouté rapidement : ${name} (ID: ${id}), Marque: ${brand}, Qty: ${qty}`);
            }

            // Vide les champs
            document.getElementById('quickId').value = '';
            document.getElementById('quickName').value = '';
            document.getElementById('quickCategory').value = '';
            document.getElementById('quickBrand').value = '';
            document.getElementById('quickQty').value = '1';
            document.getElementById('quickLocation').value = '';

            // Recharge le tableau dynamiquement sans recharger la page
            if(window.renderInventory){
                window.renderInventory();
            }
            if(window.updateStats){
                window.updateStats();
            }
            if(window.updateStatsDisplay){
                window.updateStatsDisplay();
            }

            alert(`✅ Article "${name}" ajouté avec succès !`);
            document.getElementById('quickId').focus();
        });

        quickClearBtn.addEventListener('click', function(){
            document.getElementById('quickId').value = '';
            document.getElementById('quickName').value = '';
            document.getElementById('quickCategory').value = '';
            document.getElementById('quickBrand').value = '';
            document.getElementById('quickQty').value = '1';
            document.getElementById('quickLocation').value = '';
            document.getElementById('quickId').focus();
        });

        // Raccourci clavier : Entrée dans le dernier champ = Ajouter
        document.getElementById('quickLocation').addEventListener('keypress', function(e){
            if(e.key === 'Enter'){
                quickAddBtn.click();
            }
        });

        // Raccourci clavier : Tab dans le dernier champ = Ajouter
        document.getElementById('quickLocation').addEventListener('keydown', function(e){
            if(e.key === 'Tab' && !e.shiftKey){
                e.preventDefault();
                quickAddBtn.click();
            }
        });
    });

})();
