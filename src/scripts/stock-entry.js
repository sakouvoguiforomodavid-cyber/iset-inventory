// stock-entry.js
// Gère les entrées de stock - article entrant dans l'inventaire

(function(){
    // Vérifie si l'utilisateur peut modifier le stock
    const raw = localStorage.getItem('iset_user');
    const user = raw ? JSON.parse(raw) : null;
    const role = user ? user.role : 'visiteur';
    const isDev = user ? user.isDeveloper : false;
    const canEdit = isDev || role === 'admin' || role === 'magasinier' || role === 'autres';

    if(!canEdit) return;

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

    // Ouvre le modal d'entrée de stock
    function openStockEntryModal(){
        const modal = document.getElementById('stockEntryModal');
        if(!modal) return;

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
                <h2>📥 Nouvelle entrée de stock</h2>
                <p style="color: #666; margin-bottom: 20px;">Ajouter des articles ou augmenter la quantité des articles existants.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">📦 Article</label>
                        <select id="entryArticleSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">-- Créer un nouvel article --</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">📊 Quantité à ajouter</label>
                        <input type="number" id="entryQtyInput" placeholder="0" value="1" min="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                    </div>
                </div>

                <div id="entryNewArticleForm" style="display: none; padding: 15px; background: #f0f8ff; border-radius: 4px; margin-bottom: 20px;">
                    <h4>Détails du nouvel article</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <div>
                            <label style="font-size: 12px;">ID</label>
                            <input type="text" id="entryNewId" placeholder="P123" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;" />
                        </div>
                        <div>
                            <label style="font-size: 12px;">Nom</label>
                            <input type="text" id="entryNewName" placeholder="Article" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;" />
                        </div>
                        <div>
                            <label style="font-size: 12px;">Catégorie</label>
                            <input type="text" id="entryNewCategory" placeholder="Catégorie" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;" />
                        </div>
                        <div>
                            <label style="font-size: 12px;">Marque</label>
                            <input type="text" id="entryNewBrand" placeholder="Marque" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;" />
                        </div>
                        <div colspan="2">
                            <label style="font-size: 12px;">Emplacement</label>
                            <input type="text" id="entryNewLocation" placeholder="Rayon" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 3px;" />
                        </div>
                    </div>
                </div>

                <div style="background: #fff9e6; padding: 10px; border-left: 4px solid #ff9800; margin-bottom: 20px; border-radius: 3px;">
                    <strong>📝 Résumé :</strong> <span id="entrySummary">Article existant augmentera de 0 unités</span>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="entryConfirmBtn" class="btn-primary" style="flex: 1; padding: 10px;">✅ Confirmer l'entrée</button>
                    <button class="btn-secondary" onclick="document.getElementById('stockEntryModal').style.display='none'" style="flex: 1; padding: 10px;">Annuler</button>
                </div>
            </div>
        `;

        modal.style.display = 'block';

        // Rempli la liste déroulante d'articles
        const select = document.getElementById('entryArticleSelect');
        const inventory = getInventory();
        inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.id} - ${item.name} (Qty: ${item.qty})`;
            select.appendChild(option);
        });

        // Gère le changement de sélection
        select.addEventListener('change', function(){
            const form = document.getElementById('entryNewArticleForm');
            if(this.value === ''){
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
            updateEntrySummary();
        });

        // Mise à jour du résumé
        document.getElementById('entryQtyInput').addEventListener('change', updateEntrySummary);
        document.getElementById('entryQtyInput').addEventListener('keyup', updateEntrySummary);

        function updateEntrySummary(){
            const qty = parseInt(document.getElementById('entryQtyInput').value) || 0;
            const select = document.getElementById('entryArticleSelect');
            if(select.value){
                const article = inventory.find(i => i.id === select.value);
                if(article){
                    document.getElementById('entrySummary').textContent = `${article.name} augmentera de ${qty} unités (avant: ${article.qty}, après: ${article.qty + qty})`;
                }
            } else {
                const name = document.getElementById('entryNewName').value || 'Nouvel article';
                document.getElementById('entrySummary').textContent = `${name} sera créé avec une quantité de ${qty}`;
            }
        }

        // Gère la confirmation
        document.getElementById('entryConfirmBtn').addEventListener('click', function(){
            const select = document.getElementById('entryArticleSelect');
            const qty = parseInt(document.getElementById('entryQtyInput').value);

            if(qty <= 0){
                alert('❌ La quantité doit être supérieure à 0');
                return;
            }

            if(select.value === ''){
                // Créer un nouvel article
                const id = document.getElementById('entryNewId').value.trim();
                const name = document.getElementById('entryNewName').value.trim();
                const category = document.getElementById('entryNewCategory').value.trim();
                const brand = document.getElementById('entryNewBrand').value.trim();
                const location = document.getElementById('entryNewLocation').value.trim();

                if(!id || !name || !category || !brand || !location){
                    alert('⚠️ Veuillez remplir tous les champs de l\'article');
                    return;
                }

                const exists = inventory.some(i => i.id === id);
                if(exists){
                    alert('⚠️ Cet ID existe déjà');
                    return;
                }

                const newItem = {
                    id, name, category, brand, qty,
                    location,
                    date: new Date().toISOString()
                };

                inventory.push(newItem);
                if(window.logAction){
                    window.logAction('STOCK_ENTRY', `Nouvelle entrée : ${name} (ID: ${id}), Marque: ${brand}, Qty: ${qty}`);
                }
                alert(`✅ Article créé et ${qty} unités ajoutées`);
            } else {
                // Augmenter la quantité d'un article existant
                const item = inventory.find(i => i.id === select.value);
                if(item){
                    const oldQty = item.qty;
                    item.qty += qty;
                    if(window.logAction){
                        window.logAction('STOCK_ENTRY', `Entrée stock : ${item.name} (ID: ${item.id}), +${qty} unités (avant: ${oldQty}, après: ${item.qty})`);
                    }
                    alert(`✅ Stock augmenté pour ${item.name} : ${oldQty} → ${item.qty}`);
                }
            }

            saveInventory(inventory);
            if(window.renderInventory) window.renderInventory();
            if(window.updateStats) window.updateStats();
            if(window.updateStatsDisplay) window.updateStatsDisplay();
            document.getElementById('stockEntryModal').style.display = 'none';
        });
    }

    // Export global
    window.openStockEntryModal = openStockEntryModal;

})();
