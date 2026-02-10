// inventory-ui.js
// Gère l'interface améliorée de l'inventaire avec :
// - Titre cliquable pour afficher/masquer le tableau
// - Remplissage direct des articles
// - Import/Export CSV facile

(function(){
    let isInventoryOpen = false;

    // Helper : récupère l'inventaire depuis localStorage
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

    // Initialisation au chargement
    document.addEventListener('DOMContentLoaded', function(){
        const inventoryTitle = document.getElementById('inventoryTitle');
        const inventoryControls = document.getElementById('inventoryControls');
        const inventoryTableContainer = document.getElementById('inventoryTableContainer');
        const toggleIcon = document.getElementById('toggleIcon');

        if(!inventoryTitle) return;

        // Gère le clic sur le titre pour afficher/masquer
        inventoryTitle.addEventListener('click', function(){
            isInventoryOpen = !isInventoryOpen;
            
            if(isInventoryOpen){
                inventoryControls.style.display = 'flex';
                inventoryTableContainer.style.display = 'block';
                toggleIcon.textContent = '▲';
                toggleIcon.style.transform = 'rotate(180deg)';
            } else {
                inventoryControls.style.display = 'none';
                inventoryTableContainer.style.display = 'none';
                toggleIcon.textContent = '▼';
                toggleIcon.style.transform = 'none';
            }
        });

        // Gère l'import CSV
        const importCsvBtn = document.getElementById('importCsvBtn');
        const csvImportInput = document.getElementById('csvImportInput');

        if(importCsvBtn && csvImportInput){
            importCsvBtn.addEventListener('click', function(){
                csvImportInput.click();
            });

            csvImportInput.addEventListener('change', function(e){
                const file = e.target.files[0];
                if(!file) return;

                const reader = new FileReader();
                reader.onload = function(event){
                    try {
                        const csv = event.target.result;
                        const lines = csv.split('\n').filter(line => line.trim());
                        const items = [];

                        // Saute l'en-tête
                        for(let i = 1; i < lines.length; i++){
                            const cols = lines[i].split(',').map(c => c.trim());
                            if(cols.length < 6) continue;

                            const item = {
                                id: cols[0],
                                name: cols[1],
                                category: cols[2],
                                brand: cols[3] || 'Non spécifiée',
                                qty: parseInt(cols[4]) || 0,
                                location: cols[5],
                                date: new Date().toISOString()
                            };

                            items.push(item);
                        }

                        if(items.length === 0){
                            alert('❌ Aucun article valide trouvé dans le fichier');
                            return;
                        }

                        // Demande la confirmation avant de remplacer
                        if(confirm(`📋 Importer ${items.length} articles ? Les articles existants seront fusionnés.`)){
                            const existingItems = getInventory();
                            
                            // Fusionne les articles (remplace si ID existe)
                            items.forEach(newItem => {
                                const idx = existingItems.findIndex(i => i.id === newItem.id);
                                if(idx !== -1){
                                    existingItems[idx] = newItem;
                                    if(window.logAction){
                                        window.logAction('ITEM_IMPORT_UPDATE', `Article mis à jour via import : ${newItem.name} (ID: ${newItem.id})`);
                                    }
                                } else {
                                    existingItems.push(newItem);
                                    if(window.logAction){
                                        window.logAction('ITEM_IMPORT_ADD', `Article importé : ${newItem.name} (ID: ${newItem.id})`);
                                    }
                                }
                            });

                            saveInventory(existingItems);
                            alert(`✅ ${items.length} articles importés avec succès !`);
                            window.location.reload();
                        }
                    } catch(error){
                        alert(`❌ Erreur lors de l'import : ${error.message}`);
                    }
                };
                reader.readAsText(file);
            });
        }
    });

})();
