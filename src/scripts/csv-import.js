// csv-import.js
// Je gère l'importation de fichiers CSV pour l'inventaire.
// Comme un magasinier utilisant Excel, il peut télécharger une liste, la modifier, et la réimporter.

(function(){
    // Je crée le bouton d'import s'il n'existe pas
    function addImportButton(){
        const actionButtonsDiv = document.querySelector('.action-buttons');
        if(!actionButtonsDiv) return;
        
        // Je vérifie si le bouton existe déjà
        if(document.getElementById('importBtn')) return;
        
        const importDiv = document.createElement('div');
        importDiv.style.position = 'relative';
        importDiv.style.display = 'inline-block';
        
        const importBtn = document.createElement('button');
        importBtn.id = 'importBtn';
        importBtn.type = 'button';
        importBtn.className = 'btn-secondary';
        importBtn.textContent = '📥 Importer CSV';
        
        const fileInput = document.createElement('input');
        fileInput.id = 'csvFileInput';
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        
        importDiv.appendChild(importBtn);
        importDiv.appendChild(fileInput);
        
        // Je place le bouton avant les boutons d'export
        const exportButton = actionButtonsDiv.querySelector('.btn-secondary:not(#importBtn)');
        if(exportButton){
            actionButtonsDiv.insertBefore(importDiv, exportButton);
        } else {
            actionButtonsDiv.appendChild(importDiv);
        }
        
        // Je gère le clic sur le bouton
        importBtn.addEventListener('click', function(){
            fileInput.click();
        });
        
        // Je gère la sélection du fichier
        fileInput.addEventListener('change', function(e){
            const file = e.target.files[0];
            if(file){
                readAndImportCSV(file);
            }
            // Je réinitialise pour permettre de réimporter le même fichier
            this.value = '';
        });
    }
    
    // Je lis et parse le fichier CSV
    function readAndImportCSV(file){
        const reader = new FileReader();
        reader.onload = function(e){
            try {
                let csv = e.target.result;
                
                // Je nettoie les BOM et caractères spéciaux Excel
                if(csv.charCodeAt(0) === 0xFEFF) {
                    csv = csv.slice(1);
                }
                
                // Je détecte l'encodage et les données corrompues
                if(!isValidCSV(csv)){
                    alert('⚠️ Fichier Excel mal encodé ou corrompu. Essayez d\'exporter en CSV UTF-8 depuis Excel.');
                    return;
                }
                
                const items = parseCSV(csv);
                
                if(items.length === 0){
                    alert('❌ Le fichier CSV est vide ou mal formaté.');
                    return;
                }
                
                // Je montre un aperçu avant d'importer
                showImportPreview(items);
            } catch(error){
                alert('❌ Erreur lors de la lecture du fichier: ' + error.message);
                console.error(error);
            }
        };
        reader.readAsText(file, 'UTF-8');
    }
    
    // Je valide que le CSV n'est pas corrompu
    function isValidCSV(csv){
        if(!csv || csv.length === 0) return false;
        
        // Vérifie qu'il n'y a pas trop de caractères spéciaux
        const specialCharCount = (csv.match(/[^\x20-\x7E\n\r\t,]/g) || []).length;
        const totalChars = csv.length;
        
        // Si > 30% caractères spéciaux, c'est probablement corrompu
        if(specialCharCount / totalChars > 0.3){
            return false;
        }
        
        return true;
    }
    
    // Je parse un CSV en un tableau d'objets
    function parseCSV(csv){
        const lines = csv.trim().split('\n');
        if(lines.length < 2){
            throw new Error('Le CSV doit avoir au moins un en-tête et une ligne de données.');
        }
        
        // Je lis l'en-tête (première ligne)
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Je trouve les indices des colonnes importantes
        const idIndex = headers.findIndex(h => h === 'id');
        const nameIndex = headers.findIndex(h => h === 'name' || h === 'nom');
        const categoryIndex = headers.findIndex(h => h === 'category' || h === 'categorie');
        const brandIndex = headers.findIndex(h => h === 'brand' || h === 'marque');
        const qtyIndex = headers.findIndex(h => h === 'qty' || h === 'quantite' || h === 'quantity');
        const locationIndex = headers.findIndex(h => h === 'location' || h === 'emplacement');
        
        if(nameIndex === -1 || qtyIndex === -1){
            throw new Error('Le CSV doit contenir au moins les colonnes "name" (ou "nom") et "qty" (ou "quantite").');
        }
        
        const items = [];
        for(let i = 1; i < lines.length; i++){
            const line = lines[i].trim();
            if(!line) continue; // Je saute les lignes vides
            
            const columns = line.split(',').map(c => c.trim());
            
            // Je valide les données
            const name = columns[nameIndex] || '';
            const qtyStr = columns[qtyIndex] || '0';
            const qty = parseInt(qtyStr);
            
            // Si le nom est vide ou la quantité invalide, je saute
            if(!name || isNaN(qty)){
                continue;
            }
            
            // Je rejette les données qui ont trop de caractères spéciaux
            if(hasCorruptedData(name) || hasCorruptedData(columns[categoryIndex] || '') || hasCorruptedData(columns[locationIndex] || '')){
                console.warn(`⚠️ Ligne ${i} ignorée : données corrompues`);
                continue;
            }
            
            const item = {
                id: idIndex >= 0 ? (columns[idIndex] || `AUTO_${Date.now()}_${i}`) : `AUTO_${Date.now()}_${i}`,
                name: name,
                category: categoryIndex >= 0 ? columns[categoryIndex] : 'Sans catégorie',
                brand: brandIndex >= 0 ? columns[brandIndex] : 'Non spécifiée',
                qty: qty,
                location: locationIndex >= 0 ? columns[locationIndex] : 'À définir',
                date: new Date().toISOString()
            };
            
            items.push(item);
        }
        
        if(items.length === 0){
            throw new Error('Aucune donnée valide trouvée dans le CSV.');
        }
        
        return items;
    }
    
    // Je détecte si une chaîne contient des données corrompues
    function hasCorruptedData(str){
        if(!str) return false;
        
        // Compte les caractères spéciaux
        const specialChars = (str.match(/[^\x20-\x7E]/g) || []).length;
        
        // Si > 20% spéciaux, c'est probablement corrompu
        return specialChars / str.length > 0.2;
    }
    
    // Je montre un aperçu avant d'importer
    function showImportPreview(items){
        const user = JSON.parse(localStorage.getItem('iset_session') || localStorage.getItem('iset_user') || '{}');
        const canImport = user.isDeveloper || user.role === 'admin' || user.role === 'magasinier';
        
        if(!canImport){
            alert('❌ Vous n\'avez pas le droit d\'importer des articles.');
            return;
        }
        
        // Je crée une modale pour l'aperçu
        const modal = document.createElement('div');
        modal.id = 'importModal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            max-height: 70vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        content.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 20px;">Aperçu de l'importation</h3>
            <p style="margin-bottom: 15px;">
                <strong>${items.length}</strong> article(s) seront importé(s).
                <span style="color: #e67e22;">⚠️ Les articles existants avec le même ID seront remplacés.</span>
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.9rem;">
                <thead style="background: #f0f0f0;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Nom</th>
                        <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Catégorie</th>
                        <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Marque</th>
                        <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">Qté</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.slice(0, 5).map(item => `
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.category || 'N/A'}</td>
                            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.brand || 'N/A'}</td>
                            <td style="text-align: center; padding: 8px; border: 1px solid #ddd;">${item.qty}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ${items.length > 5 ? `<p style="color: #999; font-size: 0.85rem;">... et ${items.length - 5} autre(s)</p>` : ''}
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button id="cancelImport" style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer;">Annuler</button>
                <button id="confirmImport" style="padding: 10px 20px; background: var(--secondary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">Importer</button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Je gère les boutons
        document.getElementById('cancelImport').addEventListener('click', function(){
            modal.remove();
        });
        
        document.getElementById('confirmImport').addEventListener('click', function(){
            performImport(items);
            modal.remove();
        });
        
        // Je ferme si on clique en dehors
        modal.addEventListener('click', function(e){
            if(e.target === modal){
                modal.remove();
            }
        });
    }
    
    // Je effectue l'importation réelle
    function performImport(newItems){
        try {
            const raw = localStorage.getItem('iset_inventory');
            let inventory = raw ? JSON.parse(raw) : [];
            
            // Je fusionne les articles: les nouveaux remplacent les anciens avec le même ID
            const itemMap = new Map(inventory.map(item => [item.id, item]));
            
            newItems.forEach(newItem => {
                itemMap.set(newItem.id, newItem);
            });
            
            inventory = Array.from(itemMap.values());
            localStorage.setItem('iset_inventory', JSON.stringify(inventory));
            
            // Je rafraîchis l'affichage
            if(window.renderInventory){
                window.renderInventory();
            }
            if(window.updateStats){
                window.updateStats();
            }
            
            alert(`✅ ${newItems.length} article(s) importé(s) avec succès!`);
        } catch(error){
            alert('❌ Erreur lors de l\'importation: ' + error.message);
        }
    }
    
    // J'initialise le bouton quand la page est prête
    document.addEventListener('DOMContentLoaded', function(){
        addImportButton();
    });
    
    // Je le rajoute aussi après que l'inventaire soit rendu
    window.addEventListener('inventoryRendered', function(){
        addImportButton();
    });

})();
