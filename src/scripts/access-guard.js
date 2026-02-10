// access-guard.js
// ⚠️ SÉCURITÉ: Vérification stricte - SEUL L'ADMIN peut accéder aux pages protégées
(function(){
    try{
        // Je récupère la session utilisateur
        const raw = localStorage.getItem('iset_session') || localStorage.getItem('iset_user');
        const session = raw ? JSON.parse(raw) : null;
        
        // ✅ Vérification stricte: SEUL admin ET dev peuvent accéder
        if(!session || !session.email){
            alert('⛔ ERREUR: Vous devez être connecté pour accéder à cette page.');
            window.location.href = 'login.html';
            return;
        }
        
        const role = session.role;
        const isDev = session.isDeveloper;
        const email = session.email;
        
        // ✅ SEUL l'admin et le dev peuvent accéder aux pages protégées
        if(!isDev && role !== 'admin'){
            alert(`⛔ ACCÈS REFUSÉ!\nVous êtes connecté en tant que: ${role}\n\n✅ Seul l'admin (et le développeur) peut accéder à cette page.\n\nRôles disponibles:\n- Admin: Contrôle total\n- Dev: Développeur (accès total)\n- Magasinier: Gestion E/S seulement\n- Visiteur: Lecture seule\n\nContactez l'administrateur pour obtenir les droits nécessaires.`);
            console.error(`TENTATIVE D'ACCÈS NON AUTORISÉ - Rôle: ${role}, Email: ${email}`);
            window.location.href = 'dashboard.html';
            return;
        }
        
        console.log(`✅ Accès autorisé pour ${role} (${email})`);
        
    }catch(e){
        console.error('access-guard error', e);
        window.location.href = 'login.html';
    }
})();
