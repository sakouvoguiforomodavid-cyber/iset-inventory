// Note pour mon futur moi: Ce script gère l'interactivité de base
document.getElementById('startBtn').addEventListener('click', function() {
    // On simule une redirection vers la page de login
    window.location.href = 'login.html';
});

/* Note : Ce script sert à valider que l'utilisateur 
   est bien de l'ISET avant de le laisser entrer dans le dashboard.
   Je le garde pour la démo de sécurité.
*/

document.querySelector('form').addEventListener('submit', function(e) {
    const emailField = document.getElementById('userEmail');
    const emailValue = emailField.value.toLowerCase();

    // Vérification si l'email finit par @iset.tn
    if (!emailValue.endsWith('@iset.tn')) {
        // On bloque l'envoi du formulaire
        e.preventDefault(); 
        
        alert("⚠️ Accès refusé : Veuillez utiliser votre adresse email institutionnelle Microsoft (@iset.tn).");
        
        // Un peu de style pour montrer l'erreur
        emailField.style.borderColor = "red";
    } else {
        console.log("Validation réussie pour l'ISET !");
        // Le formulaire continuera vers dashboard.html
    }
});