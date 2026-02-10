// export.js
// Je fournis des fonctions pour exporter les données stockées en localStorage au format CSV.
// - Je peux exporter la liste des utilisateurs et l'inventaire.
// - Le CSV est généré côté client et téléchargé automatiquement.

(function(){
    // Helper : transforme un tableau d'objets en CSV
    function toCSV(rows){
        if(!rows || !rows.length) return '';
        const keys = Object.keys(rows[0]);
        const escape = (val) => {
            if(val === null || val === undefined) return '';
            const s = String(val);
            // échappe les guillemets
            return '"' + s.replace(/"/g, '""') + '"';
        };
        const header = keys.map(k => '"'+k+'"').join(',');
        const lines = rows.map(r => keys.map(k => escape(r[k])).join(','));
        return [header].concat(lines).join('\r\n');
    }

    // Helper : déclenche le téléchargement d'un blob
    function download(filename, text){
        const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Je récupère les utilisateurs depuis localStorage. Retourne un tableau.
    function getUsers(){
        const raw = localStorage.getItem('iset_users');
        if(!raw){
            // Si pas de dataset, je regarde l'utilisateur courant
            const cur = localStorage.getItem('iset_user');
            if(cur){
                const u = JSON.parse(cur);
                return [{email: u.email || '', role: u.role || '', customRole: u.customRole || '', isDeveloper: u.isDeveloper ? 'oui' : 'non'}];
            }
            return [];
        }
        try{
            const arr = JSON.parse(raw);
            // Normalise les objets pour CSV
            return arr.map(u => ({email: u.email||'', role: u.role||'', customRole: u.customRole||'', isDeveloper: u.isDeveloper? 'oui':'non'}));
        } catch(e){
            return [];
        }
    }

    // Je récupère l'inventaire depuis localStorage (tableau d'objets)
    function getInventory(){
        const raw = localStorage.getItem('iset_inventory');
        if(!raw) return [];
        try{
            const arr = JSON.parse(raw);
            return arr;
        } catch(e){
            return [];
        }
    }

    // Handlers pour les boutons
    document.addEventListener('DOMContentLoaded', function(){
        const bUsers = document.getElementById('exportUsers');
        const bInv = document.getElementById('exportInventory');

        if(bUsers){
            bUsers.addEventListener('click', function(){
                const users = getUsers();
                if(!users.length){
                    alert('Aucun utilisateur à exporter.');
                    return;
                }
                const csv = toCSV(users);
                // Je définis un nom de fichier contenant la date
                const name = 'users_' + new Date().toISOString().slice(0,10) + '.csv';
                download(name, csv);
            });
        }

        if(bInv){
            bInv.addEventListener('click', function(){
                const inv = getInventory();
                if(!inv.length){
                    alert('Aucun article d\'inventaire à exporter.');
                    return;
                }
                const csv = toCSV(inv);
                const name = 'inventory_' + new Date().toISOString().slice(0,10) + '.csv';
                download(name, csv);
            });
        }
    });

})();
