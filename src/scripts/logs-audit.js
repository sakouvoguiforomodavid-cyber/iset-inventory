// logs-audit.js
// Système simple de logs : enregistre chaque action (add/edit/delete article, login, etc)
// Stocke dans iset_logs avec timestamp, utilisateur, action, détails

(function(){
    
    // je crée un modal pour afficher les logs
    const modalHTML = `
    <div id="logsAuditModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <span class="close">&times;</span>
            <h2>Logs et Audit</h2>
            <div style="margin-bottom: 15px;">
                <input type="text" id="logsSearchInput" placeholder="Filtrer par action, utilisateur..." style="padding: 8px; width: 300px;">
                <button id="clearLogsBtn" class="btn-secondary" style="margin-left: 10px;">Effacer tous les logs</button>
            </div>
            
            <table class="inventory-table" style="width: 100%; font-size: 0.9rem;">
                <thead>
                    <tr>
                        <th>Date/Heure</th>
                        <th>Utilisateur</th>
                        <th>Action</th>
                        <th>Détails</th>
                    </tr>
                </thead>
                <tbody id="logsTableBody">
                    <!-- je remplis dynamiquement -->
                </tbody>
            </table>
        </div>
    </div>
    `;
    
    // j'injecte le modal
    document.addEventListener('DOMContentLoaded', function(){
        if(!document.getElementById('logsAuditModal')){
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);
        }
    });
    
    // je charge les logs depuis localStorage
    function getLogs(){
        const raw = localStorage.getItem('iset_logs');
        return raw ? JSON.parse(raw) : [];
    }
    
    // je sauvegarde les logs
    function saveLogs(logs){
        localStorage.setItem('iset_logs', JSON.stringify(logs));
    }
    
    // je crée une entrée de log
    function logAction(action, details){
        const raw = localStorage.getItem('iset_session');
        const session = raw ? JSON.parse(raw) : null;
        const userEmail = session ? session.email : 'système';
        
        const logs = getLogs();
        logs.push({
            timestamp: new Date().toISOString(),
            user: userEmail,
            action: action,
            details: details
        });
        
        // je garde seulement les 1000 derniers logs
        if(logs.length > 1000){
            logs.shift();
        }
        saveLogs(logs);
    }
    
    // j'affiche les logs
    function renderLogsList(){
        const logs = getLogs();
        const tbody = document.getElementById('logsTableBody');
        if(!tbody) return;
        
        tbody.innerHTML = '';
        const reversedLogs = [...logs].reverse(); // dernier en premier
        
        reversedLogs.forEach(log => {
            const date = new Date(log.timestamp);
            const dateStr = date.toLocaleDateString('fr-FR');
            const timeStr = date.toLocaleTimeString('fr-FR');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dateStr} ${timeStr}</td>
                <td>${log.user}</td>
                <td><strong>${log.action}</strong></td>
                <td>${log.details}</td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // j'ouvre le modal de logs
    window.openLogsAuditModal = function(){
        const modal = document.getElementById('logsAuditModal');
        if(!modal) return;
        modal.style.display = 'block';
        renderLogsList();
    };
    
    // je filtrage les logs en temps réel
    document.addEventListener('DOMContentLoaded', function(){
        const searchInput = document.getElementById('logsSearchInput');
        if(searchInput){
            searchInput.addEventListener('input', function(){
                const query = this.value.toLowerCase();
                const logs = getLogs();
                const tbody = document.getElementById('logsTableBody');
                tbody.innerHTML = '';
                
                const reversedLogs = [...logs].reverse();
                reversedLogs.forEach(log => {
                    if(log.action.toLowerCase().includes(query) || 
                       log.user.toLowerCase().includes(query) ||
                       log.details.toLowerCase().includes(query)){
                        const date = new Date(log.timestamp);
                        const dateStr = date.toLocaleDateString('fr-FR');
                        const timeStr = date.toLocaleTimeString('fr-FR');
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${dateStr} ${timeStr}</td>
                            <td>${log.user}</td>
                            <td><strong>${log.action}</strong></td>
                            <td>${log.details}</td>
                        `;
                        tbody.appendChild(row);
                    }
                });
            });
        }
    });
    
    // je réinitialise les logs
    document.addEventListener('DOMContentLoaded', function(){
        const clearBtn = document.getElementById('clearLogsBtn');
        if(clearBtn){
            clearBtn.addEventListener('click', function(){
                if(confirm('Êtes-vous sûr de vouloir effacer tous les logs ?')){
                    saveLogs([]);
                    renderLogsList();
                }
            });
        }
    });
    
    // je ferme le modal au clic sur close
    document.addEventListener('click', function(e){
        if(e.target.classList.contains('close')){
            e.target.closest('.modal').style.display = 'none';
        }
    });
    
    // j'exporte la fonction logAction globalement
    window.logAction = logAction;
    
})();
