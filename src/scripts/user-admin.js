// user-admin.js
// Gestion des utilisateurs : lister, modifier, supprimer (stockés dans localStorage iset_users)
// ⚠️ SÉCURITÉ: SEUL L'ADMIN PEUT ACCEDER A CES FONCTIONS!

(function(){
    // ✅ Vérification d'autorisation STRICTE
    const rawSession = localStorage.getItem('iset_session') || localStorage.getItem('iset_user');
    const user = rawSession ? JSON.parse(rawSession) : null;
    const role = user ? user.role : null;
    const isDev = user ? user.isDeveloper : false;
    
    // Si pas admin ET pas dev, on refuse l'accès complet
    if(!isDev && role !== 'admin'){
        console.warn('⛔ ACCÈS REFUSÉ: Seul l\'admin peut gérer les utilisateurs!');
    }
    
    // je crée un modal pour la gestion des utilisateurs
    const modalHTML = `
    <div id="userAdminModal" class="modal" style="display:none;">
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <span class="close">&times;</span>
            <h2>Gestion des utilisateurs</h2>
            <div style="margin-bottom: 20px;">
                <button id="addUserBtn" class="btn-primary">+ Ajouter utilisateur</button>
            </div>
            
            <table class="inventory-table" style="width: 100%; margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nom</th>
                        <th>Rôle</th>
                        <th>Créé le</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="userTableBody">
                    <!-- je remplis dynamiquement -->
                </tbody>
            </table>
        </div>
    </div>
    
    <div id="userFormModal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2 id="userFormTitle">Ajouter un utilisateur</h2>
            <form id="userForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="formUserEmail" placeholder="user@iset.local" required>
                </div>
                <div class="form-group">
                    <label>Nom complet</label>
                    <input type="text" id="formUserName" placeholder="Jean Dupont" required>
                </div>
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" id="formUserPassword" placeholder="••••••••" required>
                </div>
                <div class="form-group">
                    <label>Rôle</label>
                    <p id="roleInfo" style="font-size: 0.85rem; color: #666; margin-bottom: 8px;"></p>
                    <select id="formUserRole" required>
                        <option value="visiteur">👤 Visiteur (Consultation seule)</option>
                        <option value="magasinier" class="admin-only-role" style="display:none;">📦 Magasinier (Admin only)</option>
                        <option value="admin" class="admin-only-role" style="display:none;">🔐 Admin (Admin only)</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Enregistrer</button>
                <button type="button" class="btn-secondary" id="cancelUserFormBtn">Annuler</button>
            </form>
        </div>
    </div>
    `;
    
    // j'injecte les modals dans le DOM
    document.addEventListener('DOMContentLoaded', function(){
        if(!document.getElementById('userAdminModal')){
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);
            document.body.appendChild(div.firstElementChild);
        }
    });
    
    // je mets à jour la visibilité des rôles admin selon les permissions
    function updateRoleOptionsVisibility(){
        const adminRoleOptions = document.querySelectorAll('.admin-only-role');
        const roleInfo = document.getElementById('roleInfo');
        
        if(isDev || role === 'admin'){
            // L'admin/dev peut voir TOUS les rôles
            adminRoleOptions.forEach(opt => opt.style.display = 'block');
            if(roleInfo) roleInfo.textContent = '✅ Vous pouvez assigner TOUS les rôles.';
        } else {
            // Les autres ne voient que Visiteur
            adminRoleOptions.forEach(opt => opt.style.display = 'none');
            if(roleInfo) roleInfo.textContent = '⚠️ Seul l\'admin peut assigner les rôles Magasinier et Admin.';
        }
    }
    
    // je charge les utilisateurs depuis localStorage
    function getUsers(){
        const raw = localStorage.getItem('iset_all_users');
        return raw ? JSON.parse(raw) : [];
    }
    
    // je sauvegarde les utilisateurs
    function saveUsers(users){
        localStorage.setItem('iset_all_users', JSON.stringify(users));
    }
    
    // j'affiche la liste des utilisateurs
    function renderUsersList(){
        const users = getUsers();
        const tbody = document.getElementById('userTableBody');
        if(!tbody) return;
        
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A';
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.name}</td>
                <td><strong>${user.role}</strong></td>
                <td>${createdDate}</td>
                <td>
                    <button class="btn-edit-user" data-email="${user.email}" style="padding: 5px 10px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">Éditer</button>
                    <button class="btn-delete-user" data-email="${user.email}" style="padding: 5px 10px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer;">Supprimer</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // j'attache les événements
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', function(){
                const email = this.getAttribute('data-email');
                editUser(email);
            });
        });
        
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', function(){
                const email = this.getAttribute('data-email');
                if(confirm(`Êtes-vous sûr de vouloir supprimer ${email} ?`)){
                    deleteUser(email);
                }
            });
        });
    }
    
    // j'édite un utilisateur
    function editUser(email){
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if(!user) return;
        
        document.getElementById('userFormTitle').textContent = 'Éditer utilisateur';
        document.getElementById('formUserEmail').value = user.email;
        document.getElementById('formUserEmail').disabled = true;
        document.getElementById('formUserName').value = user.name;
        document.getElementById('formUserPassword').value = user.password || '';
        document.getElementById('formUserRole').value = user.role;
        
        updateRoleOptionsVisibility();
        
        const modal = document.getElementById('userFormModal');
        modal.style.display = 'block';
        
        const form = document.getElementById('userForm');
        form.onsubmit = function(e){
            e.preventDefault();
            const newRole = document.getElementById('formUserRole').value;
            
            // ✅ Vérification stricte: on ne peut assigner Admin/Magasinier que si on est admin
            if((newRole === 'admin' || newRole === 'magasinier') && !isDev && role !== 'admin'){
                alert('⛔ ERREUR: Vous n\'avez pas les permissions pour assigner ce rôle!\nSeul l\'admin peut assigner les rôles Magasinier et Admin.');
                console.error('TENTATIVE D\'ASSIGNATION DE RÔLE NON AUTORISÉE:', newRole);
                return;
            }
            
            const updatedUser = {
                email: user.email,
                name: document.getElementById('formUserName').value,
                password: document.getElementById('formUserPassword').value,
                role: newRole,
                createdAt: user.createdAt
            };
            const idx = users.findIndex(u => u.email === email);
            users[idx] = updatedUser;
            saveUsers(users);
            logAction('USER_EDIT', `Modification utilisateur ${email} - Rôle: ${newRole}`);
            modal.style.display = 'none';
            renderUsersList();
        };
    }
    
    // j'ajoute un utilisateur
    function addUser(){
        document.getElementById('userFormTitle').textContent = 'Ajouter un utilisateur';
        document.getElementById('formUserEmail').disabled = false;
        document.getElementById('formUserEmail').value = '';
        document.getElementById('formUserName').value = '';
        document.getElementById('formUserPassword').value = '';
        document.getElementById('formUserRole').value = 'visiteur';
        
        updateRoleOptionsVisibility();
        
        const modal = document.getElementById('userFormModal');
        modal.style.display = 'block';
        
        const form = document.getElementById('userForm');
        form.onsubmit = function(e){
            e.preventDefault();
            const email = document.getElementById('formUserEmail').value;
            const newRole = document.getElementById('formUserRole').value;
            const users = getUsers();
            
            if(users.find(u => u.email === email)){
                alert('Cet email existe déjà');
                return;
            }
            
            // ✅ Vérification stricte: on ne peut assigner Admin/Magasinier que si on est admin
            if((newRole === 'admin' || newRole === 'magasinier') && !isDev && role !== 'admin'){
                alert('⛔ ERREUR: Vous n\'avez pas les permissions pour assigner ce rôle!\nSeul l\'admin peut assigner les rôles Magasinier et Admin.');
                console.error('TENTATIVE D\'ASSIGNATION DE RÔLE NON AUTORISÉE:', newRole);
                return;
            }
            
            users.push({
                email: email,
                name: document.getElementById('formUserName').value,
                password: document.getElementById('formUserPassword').value,
                role: newRole,
                createdAt: new Date().toISOString()
            });
            saveUsers(users);
            logAction('USER_ADD', `Ajout utilisateur ${email}`);
            modal.style.display = 'none';
            renderUsersList();
        };
    }
    
    // je supprime un utilisateur
    function deleteUser(email){
        const users = getUsers();
        const filtered = users.filter(u => u.email !== email);
        saveUsers(filtered);
        logAction('USER_DELETE', `Suppression utilisateur ${email}`);
        renderUsersList();
    }
    
    // j'ouvre le modal de gestion - ⚠️ SEUL L'ADMIN/DEV PEUT ACCEDER!
    window.openUserAdminModal = function(){
        // ✅ Vérification stricte des droits
        if(!isDev && role !== 'admin'){
            alert('⛔ ERREUR: Vous n\'avez pas les permissions pour gérer les utilisateurs!\nSeul l\'admin peut accéder à cette fonction.');
            console.error('TENTATIVE D\'ACCÈS NON AUTORISÉ: Gestion des utilisateurs par rôle:', role);
            return;
        }
        
        const modal = document.getElementById('userAdminModal');
        if(!modal) return;
        modal.style.display = 'block';
        renderUsersList();
    };
    
    // je ferme les modals au clic sur close ou cancel
    document.addEventListener('click', function(e){
        if(e.target.classList.contains('close')){
            e.target.closest('.modal').style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(e){
        if(e.id === 'cancelUserFormBtn'){
            document.getElementById('userFormModal').style.display = 'none';
        }
    });
    
    // j'ajoute le bouton d'ajout utilisateur
    document.addEventListener('DOMContentLoaded', function(){
        const addBtn = document.getElementById('addUserBtn');
        if(addBtn){
            addBtn.addEventListener('click', addUser);
        }
    });
    
    // fonction de log (je l'appelle depuis ici, elle est définie dans logs-audit.js)
    function logAction(action, details){
        if(window.logAction){
            window.logAction(action, details);
        }
    }
    
})();
