// auth-advanced.js
// Je gère un système d'authentification complet avec création de compte et connexion.
// - Les utilisateurs sont stockés en localStorage (jeu de données local).
// - Je vérifie les mots de passe (sans hachage pour le prototype, mais c'est expliqué).
// - Je maintiens une session active avec un token simple.

(function(){
    // Je crée les utilisateurs par défaut pour la démo, une seule fois
    function initializeDefaultUsers(){
        // Je vérife si les users existent déjà
        const existing = localStorage.getItem('iset_all_users');
        if(existing){
            return; // Les utilisateurs existent déjà, pas besoin d'initialiser
        }
        
        // Je crée les utilisateurs par défaut seulement la première fois
        const defaultUsers = [
            {
                id: 1,
                name: 'Foromo Sakouvogui',
                email: 'sakouvogui_dev@iset.local',
                password: 'dev123',
                role: 'admin',
                isDeveloper: true,
                created: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Alice Magasinier',
                email: 'alice@iset.local',
                password: 'alice123',
                role: 'magasinier',
                isDeveloper: false,
                created: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Bob Visiteur',
                email: 'bob@iset.local',
                password: 'bob123',
                role: 'visiteur',
                isDeveloper: false,
                created: new Date().toISOString()
            }
        ];
        localStorage.setItem('iset_all_users', JSON.stringify(defaultUsers));
    }

    // Je récupère tous les utilisateurs
    function getAllUsers(){
        // J'initialise les utilisateurs par défaut si ce n'est pas déjà fait
        initializeDefaultUsers();
        const raw = localStorage.getItem('iset_all_users');
        return raw ? JSON.parse(raw) : [];
    }

    // Je sauvegarde tous les utilisateurs
    function saveAllUsers(users){
        localStorage.setItem('iset_all_users', JSON.stringify(users));
    }

    // Je crée un nouvel utilisateur
    function registerUser(name, email, password, role){
        const users = getAllUsers();
        if(users.find(u => u.email === email)){
            return { success: false, message: 'Cet email existe déjà.' };
        }
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            password: password, // En démo, pas de hachage. En production : bcrypt!
            role: role,
            isDeveloper: false,
            created: new Date().toISOString()
        };
        users.push(newUser);
        saveAllUsers(users);
        return { success: true, message: 'Compte créé avec succès.', user: newUser };
    }

    // Je valide la connexion
    function loginUser(email, password){
        const users = getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if(user){
            return { success: true, user: user };
        }
        return { success: false, message: 'Email ou mot de passe incorrect.' };
    }

    // Je gère les événements du formulaire
    document.addEventListener('DOMContentLoaded', function(){
        const form = document.getElementById('authForm');
        const modeSelect = document.getElementById('authMode');
        const userNameInput = document.getElementById('userName');
        const userEmailInput = document.getElementById('userEmail');
        const userRoleSelect = document.getElementById('userRoleSelect');
        const userPasswordInput = document.getElementById('userPassword');
        const userRoleCustomInput = document.getElementById('userRoleCustom');

        // J'affiche/masque le champ nom selon le mode
        if(modeSelect){
            modeSelect.addEventListener('change', function(){
                if(this.value === 'login'){
                    userNameInput.style.display = 'none';
                    userNameInput.required = false;
                    userRoleSelect.style.display = 'none';
                    userRoleSelect.required = false;
                    userRoleCustomInput.style.display = 'none';
                } else {
                    userNameInput.style.display = 'block';
                    userNameInput.required = true;
                    userRoleSelect.style.display = 'block';
                    userRoleSelect.required = true;
                }
            });
        }

        // J'affiche le champ personnalisé si "Autre..." est choisi
        if(userRoleSelect){
            userRoleSelect.addEventListener('change', function(){
                if(this.value === 'autre'){
                    userRoleCustomInput.style.display = 'block';
                    userRoleCustomInput.required = true;
                } else {
                    userRoleCustomInput.style.display = 'none';
                    userRoleCustomInput.value = '';
                    userRoleCustomInput.required = false;
                }
            });
        }

        // Je gère la soumission du formulaire
        if(form){
            form.addEventListener('submit', function(e){
                e.preventDefault();
                const mode = document.getElementById('authMode').value;
                const email = userEmailInput.value.trim();
                const password = userPasswordInput.value;

                if(mode === 'register'){
                    // Mode création de compte
                    const name = userNameInput.value.trim();
                    let role = userRoleSelect.value;
                    let customRole = '';

                    if(role === 'autre'){
                        customRole = userRoleCustomInput.value.trim();
                        if(!customRole){
                            alert('Veuillez indiquer votre statut personnalisé.');
                            return;
                        }
                        role = 'autres';
                    }

                    if(!password){
                        alert('Veuillez entrer un mot de passe.');
                        return;
                    }

                    const result = registerUser(name, email, password, role);
                    if(result.success){
                        // Je connecte automatiquement après création
                        const sessionUser = {
                            id: result.user.id,
                            name: result.user.name,
                            email: result.user.email,
                            role: result.user.role,
                            customRole: customRole,
                            isDeveloper: result.user.isDeveloper,
                            loginTime: new Date().toISOString()
                        };
                        localStorage.setItem('iset_session', JSON.stringify(sessionUser));
                        alert('Compte créé et connecté avec succès!');
                        window.location.href = 'dashboard.html';
                    } else {
                        alert(result.message);
                    }
                } else {
                    // Mode connexion
                    if(!password){
                        alert('Veuillez entrer votre mot de passe.');
                        return;
                    }
                    const result = loginUser(email, password);
                    if(result.success){
                        // Je crée une session
                        const sessionUser = {
                            id: result.user.id,
                            name: result.user.name,
                            email: result.user.email,
                            role: result.user.role,
                            customRole: '',
                            isDeveloper: result.user.isDeveloper,
                            loginTime: new Date().toISOString()
                        };
                        // Je remplace l'ancienne clé iset_user pour compatibilité
                        localStorage.setItem('iset_user', JSON.stringify(sessionUser));
                        localStorage.setItem('iset_session', JSON.stringify(sessionUser));
                        // je logue la connexion
                        logLoginAction(email, 'LOGIN_SUCCESS');
                        window.location.href = 'dashboard.html';
                    } else {
                        logLoginAction(email, 'LOGIN_FAILED');
                        alert(result.message);
                    }
                }
            });
        }
    });

    // J'expose les fonctions globalement pour test
    window.AuthSystem = {
        getAllUsers: getAllUsers,
        registerUser: registerUser,
        loginUser: loginUser
    };
    
    // je crée une fonction pour logger les actions d'authentification
    function logLoginAction(email, action){
        const logs = [];
        const raw = localStorage.getItem('iset_logs');
        if(raw){
            try {
                logs.push(...JSON.parse(raw));
            } catch(e) {}
        }
        logs.push({
            timestamp: new Date().toISOString(),
            user: email,
            action: action,
            details: action === 'LOGIN_SUCCESS' ? 'Connexion réussie' : 'Tentative de connexion échouée'
        });
        // je garde seulement les 1000 derniers logs
        if(logs.length > 1000){
            logs.shift();
        }
        localStorage.setItem('iset_logs', JSON.stringify(logs));
    }
})();
