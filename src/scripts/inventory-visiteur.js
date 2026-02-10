// inventory-visiteur.js
// Améliore l'affichage du tableau de consultation pour les visiteurs

(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const visiteurSection = document.getElementById('visiteurSection');
        if(!visiteurSection) return;

        // Améliore l'affichage du tableau visiteur
        const sectionHeader = document.querySelector('#visiteurSection .section-header');
        if(!sectionHeader){
            // Crée un en-tête s'il n'existe pas
            const header = document.createElement('div');
            header.className = 'section-header';
            header.style.marginBottom = '20px';
            header.innerHTML = `
                <h2 style="display: flex; align-items: center; gap: 10px; color: #0e2a36;">
                    📦 Consultation de l'inventaire
                </h2>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 15px;">
                    <input type="text" id="searchInputVisiteur" placeholder="Rechercher un article..." style="flex: 1; min-width: 200px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;" />
                    <button id="resetSearchVisiteur" class="btn-secondary" style="padding: 8px 16px;">🔄 Réinitialiser</button>
                </div>
            `;
            visiteurSection.querySelector('h2') && visiteurSection.querySelector('h2').remove();
            visiteurSection.insertBefore(header, visiteurSection.querySelector('table'));
        }

        // Gère la recherche
        const searchInput = document.getElementById('searchInputVisiteur');
        const resetBtn = document.getElementById('resetSearchVisiteur');
        const tbody = document.getElementById('inventoryBodyVisiteur');

        if(searchInput && tbody){
            // Récupère l'inventaire
            function getInventory(){
                const raw = localStorage.getItem('iset_inventory');
                if(!raw) return [];
                try {
                    return JSON.parse(raw);
                } catch(e) {
                    return [];
                }
            }

            // Remet à jour l'affichage complet
            function renderFull(){
                const items = getInventory();
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
                        <td class="${qtyClass}"><strong>${item.qty}</strong></td>
                        <td>${item.location}</td>
                    `;
                    tbody.appendChild(row);
                });
            }

            // Gère la recherche en temps réel
            searchInput.addEventListener('keyup', function(){
                const query = this.value.toLowerCase().trim();
                const items = getInventory();
                
                if(query === ''){
                    renderFull();
                    return;
                }

                // Filtre les articles
                const filtered = items.filter(i => 
                    i.id.toLowerCase().includes(query) || 
                    i.name.toLowerCase().includes(query) ||
                    i.category.toLowerCase().includes(query) ||
                    i.location.toLowerCase().includes(query)
                );

                tbody.innerHTML = '';

                if(filtered.length === 0){
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="5" style="text-align: center; padding: 20px; color: #999;">🔍 Aucun résultat pour "${query}"</td>`;
                    tbody.appendChild(row);
                    return;
                }

                filtered.forEach(item => {
                    const row = document.createElement('tr');
                    const qtyClass = item.qty < 5 ? 'qty-low-stock' : 'qty-normal';
                    
                    row.innerHTML = `
                        <td><strong>${item.id}</strong></td>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td class="${qtyClass}"><strong>${item.qty}</strong></td>
                        <td>${item.location}</td>
                    `;
                    tbody.appendChild(row);
                });
            });

            // Gère la réinitialisation
            if(resetBtn){
                resetBtn.addEventListener('click', function(){
                    searchInput.value = '';
                    renderFull();
                    searchInput.focus();
                });
            }
        }

        // Améliore le style du tableau visiteur
        const table = document.getElementById('inventoryTableVisiteur');
        if(table){
            table.className = 'inventory-table-enhanced';
        }
    });

})();
