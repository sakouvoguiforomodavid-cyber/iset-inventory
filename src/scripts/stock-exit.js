// stock-exit.js
// Gère les sorties de stock - article quittant l'inventaire

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

    // Ouvre le modal de sortie de stock
    function openStockExitModal(){
        const modal = document.getElementById('stockExitModal');
        if(!modal) return;

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.style.display='none'">&times;</span>
                <h2>📤 Nouvelle sortie de stock</h2>
                <p style="color: #666; margin-bottom: 20px;">Réduire la quantité d'articles en stock.</p>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">📦 Article</label>
                        <select id="exitArticleSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">-- Sélectionner un article --</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">📊 Quantité à retirer</label>
                        <input type="number" id="exitQtyInput" placeholder="0" value="1" min="1" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">🎯 Motif</label>
                        <select id="exitReasonSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="vente">Vente</option>
                            <option value="dommage">Dommage/Cassé</option>
                            <option value="casse">Casse</option>
                            <option value="perdu">Perdu</option>
                            <option value="transfert">Transfert</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-weight: bold; display: block; margin-bottom: 8px;">📝 Notes (optionnel)</label>
                        <input type="text" id="exitNotesInput" placeholder="Détails supplémentaires..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                    </div>
                </div>

                <div style="background: #fff9e6; padding: 10px; border-left: 4px solid #ff9800; margin-bottom: 20px; border-radius: 3px;">
                    <strong>📝 Résumé :</strong> <span id="exitSummary">Sélectionner un article</span>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="exitConfirmBtn" class="btn-primary" style="flex: 1; padding: 10px;">✅ Confirmer la sortie</button>
                    <button class="btn-secondary" onclick="document.getElementById('stockExitModal').style.display='none'" style="flex: 1; padding: 10px;">Annuler</button>
                </div>
            </div>
        `;

        modal.style.display = 'block';

        // Rempli la liste déroulante d'articles
        const select = document.getElementById('exitArticleSelect');
        const inventory = getInventory();
        inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.id} - ${item.name} (Qty: ${item.qty})`;
            select.appendChild(option);
        });

        // Gère le changement de sélection
        select.addEventListener('change', updateExitSummary);
        document.getElementById('exitQtyInput').addEventListener('change', updateExitSummary);
        document.getElementById('exitQtyInput').addEventListener('keyup', updateExitSummary);
        document.getElementById('exitReasonSelect').addEventListener('change', updateExitSummary);

        function updateExitSummary(){
            const select = document.getElementById('exitArticleSelect');
            const qty = parseInt(document.getElementById('exitQtyInput').value) || 0;
            const reason = document.getElementById('exitReasonSelect').value;

            if(!select.value){
                document.getElementById('exitSummary').textContent = 'Sélectionner un article';
                return;
            }

            const article = inventory.find(i => i.id === select.value);
            if(!article){
                document.getElementById('exitSummary').textContent = 'Article non trouvé';
                return;
            }

            const newQty = article.qty - qty;
            const qtyStatus = newQty < 0 ? ' ⚠️ ERREUR : Quantité insuffisante!' : '';
            document.getElementById('exitSummary').textContent = `${article.name} : ${article.qty} - ${qty} = ${newQty} (Motif: ${reason})${qtyStatus}`;
        }

        // Gère la confirmation
        document.getElementById('exitConfirmBtn').addEventListener('click', function(){
            const select = document.getElementById('exitArticleSelect');
            const qty = parseInt(document.getElementById('exitQtyInput').value);
            const reason = document.getElementById('exitReasonSelect').value;
            const notes = document.getElementById('exitNotesInput').value.trim();

            if(!select.value){
                alert('❌ Veuillez sélectionner un article');
                return;
            }

            if(qty <= 0){
                alert('❌ La quantité doit être supérieure à 0');
                return;
            }

            const article = inventory.find(i => i.id === select.value);
            if(!article){
                alert('❌ Article non trouvé');
                return;
            }

            if(article.qty < qty){
                alert(`❌ Quantité insuffisante : ${article.qty} disponible, ${qty} demandé`);
                return;
            }

            const oldQty = article.qty;
            article.qty -= qty;

            if(window.logAction){
                const motifTexte = `Sortie stock : ${article.name} (ID: ${article.id}), -${qty} unités (avant: ${oldQty}, après: ${article.qty}), Motif: ${reason}${notes ? ', Notes: ' + notes : ''}`;
                window.logAction('STOCK_EXIT', motifTexte);
            }

            saveInventory(inventory);
            alert(`✅ Stock réduit pour ${article.name} : ${oldQty} → ${article.qty}`);
            
            if(window.renderInventory) window.renderInventory();
            if(window.updateStats) window.updateStats();
            if(window.updateStatsDisplay) window.updateStatsDisplay();
            document.getElementById('stockExitModal').style.display = 'none';
        });
    }

    // Export global
    window.openStockExitModal = openStockExitModal;

})();
