// restock-requests.js
// Gestion des demandes de réapprovisionnement

(function(){
    
    // Vérifier les permissions
    const rawSession = localStorage.getItem('iset_session') || localStorage.getItem('iset_user');
    const user = rawSession ? JSON.parse(rawSession) : null;
    const role = user ? user.role : null;
    const isDev = user ? user.isDeveloper : false;
    
    // HTML du modal de gestion des demandes
    const modalHTML = `
    <div id="restockRequestsModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <span class="close">&times;</span>
            <h2>📋 Demandes de réapprovisionnement</h2>
            
            <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="addRestockRequestBtn" class="btn-primary" style="background: #27ae60;">
                    ➕ Nouvelle demande
                </button>
                <button id="filterAllRequests" class="btn-secondary filter-btn active" data-filter="all">
                    Toutes (<span id="countAll">0</span>)
                </button>
                <button id="filterPendingRequests" class="btn-secondary filter-btn" data-filter="en_attente" style="background: #f39c12;">
                    En attente (<span id="countPending">0</span>)
                </button>
                <button id="filterApprovedRequests" class="btn-secondary filter-btn" data-filter="approuvee" style="background: #27ae60;">
                    Approuvées (<span id="countApproved">0</span>)
                </button>
                <button id="filterRejectedRequests" class="btn-secondary filter-btn" data-filter="rejetee" style="background: #e74c3c;">
                    Rejetées (<span id="countRejected">0</span>)
                </button>
            </div>
            
            <table class="inventory-table" style="width: 100%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Article</th>
                        <th>Quantité demandée</th>
                        <th>Demandeur</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="restockRequestsTableBody">
                </tbody>
            </table>
            
            <div id="emptyRestockState" style="display:none; text-align: center; padding: 40px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 15px;">📭</div>
                <p>Aucune demande de réapprovisionnement</p>
            </div>
        </div>
    </div>
    
    <div id="newRestockRequestModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Nouvelle demande de réapprovisionnement</h2>
            <form id="restockRequestForm">
                <div class="form-group">
                    <label>Article à réapprovisionner</label>
                    <select id="restockArticleSelect" required>
                        <option value="">-- Sélectionnez un article --</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantité actuelle</label>
                    <input type="number" id="currentQty" readonly style="background: #f0f0f0;">
                </div>
                <div class="form-group">
                    <label>Quantité demandée</label>
                    <input type="number" id="requestedQty" min="1" placeholder="Ex: 50" required>
                </div>
                <div class="form-group">
                    <label>Raison / Commentaire</label>
                    <textarea id="requestReason" rows="3" placeholder="Ex: Stock faible, forte demande prévue..." required></textarea>
                </div>
                <button type="submit" class="btn-primary">Envoyer la demande</button>
                <button type="button" class="btn-secondary" id="cancelRestockFormBtn">Annuler</button>
            </form>
        </div>
    </div>
    `;
    
    // Injecter les modals dans le DOM
    document.addEventListener('DOMContentLoaded', function(){
        if(!document.getElementById('restockRequestsModal')){
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);
            document.body.appendChild(div.firstElementChild);
            
            initializeRestockSystem();
        }
    });
    
    // Récupérer les demandes depuis localStorage
    function getRestockRequests(){
        const raw = localStorage.getItem('iset_restock_requests');
        return raw ? JSON.parse(raw) : [];
    }
    
    // Sauvegarder les demandes
    function saveRestockRequests(requests){
        localStorage.setItem('iset_restock_requests', JSON.stringify(requests));
    }
    
    // Récupérer l'inventaire
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        return raw ? JSON.parse(raw) : [];
    }
    
    // Afficher la liste des demandes
    function renderRestockRequests(filter = 'all'){
        const requests = getRestockRequests();
        const tbody = document.getElementById('restockRequestsTableBody');
        const emptyState = document.getElementById('emptyRestockState');
        
        if(!tbody) return;
        
        tbody.innerHTML = '';
        
        // Filtrer les demandes
        let filteredRequests = requests;
        if(filter !== 'all'){
            filteredRequests = requests.filter(r => r.status === filter);
        }
        
        // Mettre à jour les compteurs
        updateRequestCounts(requests);
        
        if(filteredRequests.length === 0){
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        filteredRequests.reverse().forEach(request => {
            const row = document.createElement('tr');
            const date = new Date(request.createdAt).toLocaleDateString('fr-FR');
            
            let statusBadge = '';
            let statusColor = '';
            switch(request.status){
                case 'en_attente':
                    statusBadge = '⏳ En attente';
                    statusColor = '#f39c12';
                    break;
                case 'approuvee':
                    statusBadge = '✅ Approuvée';
                    statusColor = '#27ae60';
                    break;
                case 'rejetee':
                    statusBadge = '❌ Rejetée';
                    statusColor = '#e74c3c';
                    break;
            }
            
            const canManage = isDev || role === 'admin' || role === 'magasinier';
            
            row.innerHTML = `
                <td>${date}</td>
                <td><strong>${request.articleName}</strong><br><small>ID: ${request.articleId}</small></td>
                <td style="text-align: center; font-weight: bold; color: #3498db;">${request.requestedQty}</td>
                <td>${request.requesterName}<br><small>${request.requesterEmail}</small></td>
                <td><span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">${statusBadge}</span></td>
                <td style="text-align: center;">
                    ${request.status === 'en_attente' && canManage ? `
                        <button class="btn-approve" data-id="${request.id}" style="padding: 5px 10px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✅ Approuver</button>
                        <button class="btn-reject" data-id="${request.id}" style="padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">❌ Rejeter</button>
                    ` : `
                        <button class="btn-view" data-id="${request.id}" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">👁️ Voir</button>
                    `}
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // Attacher les événements
        document.querySelectorAll('.btn-approve').forEach(btn => {
            btn.addEventListener('click', function(){
                const id = this.getAttribute('data-id');
                approveRequest(id);
            });
        });
        
        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', function(){
                const id = this.getAttribute('data-id');
                rejectRequest(id);
            });
        });
        
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function(){
                const id = this.getAttribute('data-id');
                viewRequestDetails(id);
            });
        });
    }
    
    // Mettre à jour les compteurs
    function updateRequestCounts(requests){
        const countAll = document.getElementById('countAll');
        const countPending = document.getElementById('countPending');
        const countApproved = document.getElementById('countApproved');
        const countRejected = document.getElementById('countRejected');
        
        if(countAll) countAll.textContent = requests.length;
        if(countPending) countPending.textContent = requests.filter(r => r.status === 'en_attente').length;
        if(countApproved) countApproved.textContent = requests.filter(r => r.status === 'approuvee').length;
        if(countRejected) countRejected.textContent = requests.filter(r => r.status === 'rejetee').length;
    }
    
    // Approuver une demande
    function approveRequest(id){
        if(!confirm('Approuver cette demande de réapprovisionnement ?')){
            return;
        }
        
        const requests = getRestockRequests();
        const request = requests.find(r => r.id === id);
        
        if(!request) return;
        
        request.status = 'approuvee';
        request.approvedAt = new Date().toISOString();
        request.approvedBy = user.email;
        
        saveRestockRequests(requests);
        logAction('RESTOCK_APPROVED', `Demande approuvée: ${request.articleName} (${request.requestedQty} unités)`);
        
        alert(`✅ Demande approuvée!\n\nArticle: ${request.articleName}\nQuantité: ${request.requestedQty}`);
        renderRestockRequests();
    }
    
    // Rejeter une demande
    function rejectRequest(id){
        const reason = prompt('Raison du rejet (optionnel):');
        if(reason === null) return; // Annulation
        
        const requests = getRestockRequests();
        const request = requests.find(r => r.id === id);
        
        if(!request) return;
        
        request.status = 'rejetee';
        request.rejectedAt = new Date().toISOString();
        request.rejectedBy = user.email;
        request.rejectionReason = reason;
        
        saveRestockRequests(requests);
        logAction('RESTOCK_REJECTED', `Demande rejetée: ${request.articleName} - Raison: ${reason || 'Non spécifiée'}`);
        
        alert(`❌ Demande rejetée`);
        renderRestockRequests();
    }
    
    // Voir les détails
    function viewRequestDetails(id){
        const requests = getRestockRequests();
        const request = requests.find(r => r.id === id);
        
        if(!request) return;
        
        let details = `📋 DÉTAILS DE LA DEMANDE\n\n`;
        details += `Article: ${request.articleName} (${request.articleId})\n`;
        details += `Quantité demandée: ${request.requestedQty}\n`;
        details += `Raison: ${request.reason}\n\n`;
        details += `Demandeur: ${request.requesterName} (${request.requesterEmail})\n`;
        details += `Date: ${new Date(request.createdAt).toLocaleString('fr-FR')}\n\n`;
        details += `Statut: ${request.status === 'en_attente' ? 'En attente' : request.status === 'approuvee' ? 'Approuvée' : 'Rejetée'}\n`;
        
        if(request.status === 'approuvee'){
            details += `\nApprouvée par: ${request.approvedBy}\n`;
            details += `Date d'approbation: ${new Date(request.approvedAt).toLocaleString('fr-FR')}`;
        } else if(request.status === 'rejetee'){
            details += `\nRejetée par: ${request.rejectedBy}\n`;
            details += `Date de rejet: ${new Date(request.rejectedAt).toLocaleString('fr-FR')}\n`;
            if(request.rejectionReason){
                details += `Raison: ${request.rejectionReason}`;
            }
        }
        
        alert(details);
    }
    
    // Ouvrir le modal de nouvelle demande
    function openNewRestockRequestModal(){
        const modal = document.getElementById('newRestockRequestModal');
        const select = document.getElementById('restockArticleSelect');
        
        // Remplir la liste des articles
        const inventory = getInventory();
        select.innerHTML = '<option value="">-- Sélectionnez un article --</option>';
        
        inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.name} (ID: ${item.id}) - Stock actuel: ${item.qty}`;
            option.dataset.qty = item.qty;
            option.dataset.name = item.name;
            select.appendChild(option);
        });
        
        modal.style.display = 'block';
    }
    
    // Initialiser le système
    function initializeRestockSystem(){
        // Gérer la sélection d'article
        const articleSelect = document.getElementById('restockArticleSelect');
        if(articleSelect){
            articleSelect.addEventListener('change', function(){
                const selectedOption = this.options[this.selectedIndex];
                const currentQty = document.getElementById('currentQty');
                if(currentQty && selectedOption.dataset.qty){
                    currentQty.value = selectedOption.dataset.qty;
                }
            });
        }
        
        // Gérer le formulaire de nouvelle demande
        const restockForm = document.getElementById('restockRequestForm');
        if(restockForm){
            restockForm.addEventListener('submit', function(e){
                e.preventDefault();
                
                const articleSelect = document.getElementById('restockArticleSelect');
                const selectedOption = articleSelect.options[articleSelect.selectedIndex];
                const articleId = articleSelect.value;
                const articleName = selectedOption.dataset.name;
                const requestedQty = parseInt(document.getElementById('requestedQty').value);
                const reason = document.getElementById('requestReason').value;
                
                if(!articleId || !requestedQty || !reason){
                    alert('Veuillez remplir tous les champs');
                    return;
                }
                
                const requests = getRestockRequests();
                const newRequest = {
                    id: 'REQ' + Date.now(),
                    articleId: articleId,
                    articleName: articleName,
                    requestedQty: requestedQty,
                    reason: reason,
                    requesterName: user.name,
                    requesterEmail: user.email,
                    status: 'en_attente',
                    createdAt: new Date().toISOString()
                };
                
                requests.push(newRequest);
                saveRestockRequests(requests);
                logAction('RESTOCK_REQUEST', `Nouvelle demande: ${articleName} (${requestedQty} unités)`);
                
                alert('✅ Demande envoyée avec succès!');
                document.getElementById('newRestockRequestModal').style.display = 'none';
                restockForm.reset();
                
                // Ouvrir le modal principal
                openRestockRequestsModal();
            });
        }
        
        // Gérer le bouton d'ajout
        const addBtn = document.getElementById('addRestockRequestBtn');
        if(addBtn){
            addBtn.addEventListener('click', openNewRestockRequestModal);
        }
        
        // Gérer les filtres
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function(){
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                renderRestockRequests(filter);
            });
        });
        
        // Gérer les boutons de fermeture
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function(){
                this.closest('.modal').style.display = 'none';
            });
        });
        
        const cancelBtn = document.getElementById('cancelRestockFormBtn');
        if(cancelBtn){
            cancelBtn.addEventListener('click', function(){
                document.getElementById('newRestockRequestModal').style.display = 'none';
            });
        }
    }
    
    // Fonction globale pour ouvrir le modal
    window.openRestockRequestsModal = function(){
        // ✅ Vérifier les permissions
        if(!isDev && role !== 'admin' && role !== 'magasinier'){
            alert('⛔ ACCÈS REFUSÉ!\nSeul l\'admin et le magasinier peuvent gérer les demandes de réapprovisionnement.');
            return;
        }
        
        const modal = document.getElementById('restockRequestsModal');
        if(!modal) return;
        modal.style.display = 'block';
        renderRestockRequests();
    };
    
    // Fonction de log
    function logAction(action, details){
        if(window.logAction){
            window.logAction(action, details);
        }
    }
    
})();
