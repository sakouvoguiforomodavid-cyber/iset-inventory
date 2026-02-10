// reports.js
// Génère des rapports d'inventaire avec statistiques et tendances

(function(){
    
    // je crée un modal pour les rapports
    const modalHTML = `
    <div id="reportsModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 1000px;">
            <span class="close">&times;</span>
            <h2>Rapports</h2>
            
            <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                <button id="reportInventoryBtn" class="btn-primary">📊 Rapport inventaire</button>
                <button id="reportStatsBtn" class="btn-primary">📈 Statistiques</button>
                <button id="reportExportBtn" class="btn-secondary">📥 Exporter rapport (CSV)</button>
            </div>
            
            <div id="reportContent" style="padding: 20px; background: #f5f7fb; border-radius: 8px;">
                <!-- le rapport s'affiche ici -->
            </div>
        </div>
    </div>
    `;
    
    // j'injecte le modal
    document.addEventListener('DOMContentLoaded', function(){
        if(!document.getElementById('reportsModal')){
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);
        }
    });
    
    // je charge l'inventaire depuis localStorage
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        return raw ? JSON.parse(raw) : [];
    }
    
    // j'ouvre le modal de rapports
    window.openReportsModal = function(){
        const modal = document.getElementById('reportsModal');
        if(!modal) return;
        modal.style.display = 'block';
        generateInventoryReport(); // affiche le rapport inventaire par défaut
    };
    
    // je génère un rapport d'inventaire (HTML)
    function generateInventoryReport(){
        const items = getInventory();
        const content = document.getElementById('reportContent');
        
        let html = '<h3>Rapport d\'inventaire</h3>';
        html += '<p><strong>Généré le :</strong> ' + new Date().toLocaleDateString('fr-FR') + '</p>';
        html += '<table class="inventory-table" style="width: 100%; margin-top: 10px;">';
        html += '<thead><tr><th>ID</th><th>Nom</th><th>Catégorie</th><th>Marque</th><th>Quantité</th><th>Emplacement</th></tr></thead>';
        html += '<tbody>';
        
        items.forEach(item => {
            const isLowStock = item.qty < 5 ? ' style="background-color: #fff3cd;"' : '';
            html += `<tr${isLowStock}>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.brand || 'Non spécifiée'}</td>
                <td>${item.qty}</td>
                <td>${item.location}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        html += '<hr>';
        html += '<p><strong>Nombre d\'articles :</strong> ' + items.length + '</p>';
        
        const lowStockItems = items.filter(i => i.qty < 5);
        if(lowStockItems.length > 0){
            html += '<p style="color: #e67e22;"><strong>⚠️ Articles en stock faible (' + lowStockItems.length + ') :</strong></p>';
            html += '<ul>';
            lowStockItems.forEach(item => {
                html += `<li>${item.name} (${item.qty} en stock)</li>`;
            });
            html += '</ul>';
        }
        
        content.innerHTML = html;
    }
    
    // je génère des statistiques (HTML)
    function generateStatsReport(){
        const items = getInventory();
        const content = document.getElementById('reportContent');
        
        let html = '<h3>Statistiques d\'inventaire</h3>';
        html += '<p><strong>Généré le :</strong> ' + new Date().toLocaleDateString('fr-FR') + '</p>';
        
        // stats générales
        const totalItems = items.length;
        const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
        const lowStockCount = items.filter(i => i.qty < 5).length;
        
        html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">';
        html += `<div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #3498db;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Nombre d'articles</p>
            <p style="margin: 5px 0 0; font-size: 1.5rem; font-weight: bold;">${totalItems}</p>
        </div>`;
        html += `<div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #27ae60;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Quantité totale</p>
            <p style="margin: 5px 0 0; font-size: 1.5rem; font-weight: bold;">${totalQty}</p>
        </div>`;
        html += `<div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #e67e22;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Articles en stock faible</p>
            <p style="margin: 5px 0 0; font-size: 1.5rem; font-weight: bold;">${lowStockCount}</p>
        </div>`;
        html += `<div style="padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #9b59b6;">
            <p style="margin: 0; color: #666; font-size: 0.9rem;">Quantité moyenne</p>
            <p style="margin: 5px 0 0; font-size: 1.5rem; font-weight: bold;">${(totalItems > 0 ? (totalQty / totalItems).toFixed(1) : 0)}</p>
        </div>`;
        html += '</div>';
        
        // top 5 articles par quantité
        const topByQty = [...items].sort((a, b) => b.qty - a.qty).slice(0, 5);
        if(topByQty.length > 0){
            html += '<h4>Top 5 articles par quantité</h4>';
            html += '<ol>';
            topByQty.forEach(item => {
                html += `<li><strong>${item.name}</strong> (${item.brand || 'N/A'}) - ${item.qty} unités</li>`;
            });
            html += '</ol>';
        }
        
        // articles par catégorie
        const categories = {};
        items.forEach(item => {
            if(!categories[item.category]){
                categories[item.category] = 0;
            }
            categories[item.category] += item.qty;
        });
        
        if(Object.keys(categories).length > 0){
            html += '<h4>Quantités par catégorie</h4>';
            html += '<ul>';
            Object.keys(categories).forEach(cat => {
                html += `<li><strong>${cat}</strong> : ${categories[cat]} unités</li>`;
            });
            html += '</ul>';
        }
        
        content.innerHTML = html;
    }
    
    // j'exporte le rapport en CSV
    function exportReportCSV(){
        const items = getInventory();
        const now = new Date();
        
        let csv = 'Rapport d\'inventaire\n';
        csv += 'Généré le : ' + now.toLocaleDateString('fr-FR') + '\n\n';
        csv += 'ID,Nom,Catégorie,Marque,Quantité,Emplacement\n';
        
        items.forEach(item => {
            csv += `"${item.id}","${item.name}","${item.category}","${item.brand || 'Non spécifiée'}",${item.qty},"${item.location}"\n`;
        });
        
        csv += '\n\nRÉSUMÉ\n';
        csv += 'Nombre d\'articles,' + items.length + '\n';
        
        // je télécharge le fichier
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
        element.setAttribute('download', 'rapport_inventaire_' + now.getTime() + '.csv');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    
    // j'attache les événements aux boutons
    document.addEventListener('DOMContentLoaded', function(){
        const reportInventoryBtn = document.getElementById('reportInventoryBtn');
        if(reportInventoryBtn){
            reportInventoryBtn.addEventListener('click', generateInventoryReport);
        }
        
        const reportStatsBtn = document.getElementById('reportStatsBtn');
        if(reportStatsBtn){
            reportStatsBtn.addEventListener('click', generateStatsReport);
        }
        
        const reportExportBtn = document.getElementById('reportExportBtn');
        if(reportExportBtn){
            reportExportBtn.addEventListener('click', exportReportCSV);
        }
    });
    
    // je ferme le modal au clic sur close
    document.addEventListener('click', function(e){
        if(e.target.classList.contains('close')){
            e.target.closest('.modal').style.display = 'none';
        }
    });
    
})();
