// auth.js
// Je gère le comportement du formulaire d'authentification/inscription.
// - Je permets de choisir un rôle dans la liste ou d'écrire un rôle personnalisé.
// - Si l'utilisateur écrit un rôle qui n'est pas dans la liste, je le considère comme "Autres".
// - Je stocke le rôle (et le rôle personnalisé si fourni) dans localStorage pour la démo.

(function(){
    const select = document.getElementById('userRoleSelect');
    const custom = document.getElementById('userRoleCustom');
    const form = document.getElementById('authForm');

    // J'affiche le champ personnalisé seulement si l'utilisateur choisit "Autre..."
    if(select){
        select.addEventListener('change', function(e){
            if(e.target.value === 'autre'){
                custom.style.display = 'block';
                custom.focus();
                custom.required = true;
            } else {
                custom.style.display = 'none';
                custom.value = '';
                custom.required = false;
            }
        });
    }

    // Au moment de la soumission, je décide du rôle final et je le stocke.
    if(form){
        form.addEventListener('submit', function(e){
            e.preventDefault(); // Je gère la logique ici avant de rediriger

            const email = document.getElementById('userEmail').value.trim();
            const pwd = document.getElementById('userPassword').value; // mot de passe partiel
            let role = '';
            let customRole = '';

            // Si l'utilisateur a activé le champ custom, je prends sa valeur
            if(select.value === 'autre'){
                customRole = custom.value.trim();
                if(customRole === ''){
                    // Je demande à l'utilisateur de remplir si vide
                    alert("Si vous avez choisi 'Autre', veuillez indiquer votre statut.");
                    custom.focus();
                    return;
                }
                // Si son statut écrit n'est pas dans la liste, je classe dans 'Autres'
                role = 'autres';
            } else {
                role = select.value;
            }

            // Cas spéciale : si je suis le développeur (moi), j'autorise tout
            // Pour la démo, j'identifie le développeur par une adresse e-mail spécifique (modifiable)
            const devEmail = 'sakouvogui_dev@iset.local';
            const isDeveloper = (email.toLowerCase() === devEmail);

            // Je crée un objet utilisateur simplifié pour la session (démo)
            const user = {
                email: email,
                role: role,
                customRole: customRole,
                isDeveloper: isDeveloper
            };

            // J'enregistre dans localStorage pour que le tableau de bord puisse lire
            localStorage.setItem('iset_user', JSON.stringify(user));

            // Je redirige vers le dashboard
            window.location.href = 'dashboard.html';
        });
    }
})();
