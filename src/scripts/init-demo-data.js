// init-demo-data.js
// Initialise les données de démonstration si le localStorage est vide

(function(){
    // Vérifie et initialise l'inventaire de démonstration
    function initializeDemoInventory(){
        const existing = localStorage.getItem('iset_inventory');
        
        // Vérifie si les anciennes données contiennent le champ "price" (structure obsolète)
        if(existing){
            try {
                const data = JSON.parse(existing);
                if(Array.isArray(data) && data.length > 0 && data[0].price !== undefined){
                    // Anciennes données détectées - les supprimer pour éviter les conflits
                    console.log('⚠️ Anciennes données avec prix détectées - suppression pour migration');
                    localStorage.removeItem('iset_inventory');
                } else {
                    // Données valides (structure avec brand)
                    console.log('✓ Inventaire chargé depuis le stockage local');
                    return;
                }
            } catch(e) {
                console.log('⚠️ Erreur lors de la vérification des données - réinitialisation');
                localStorage.removeItem('iset_inventory');
            }
        }

        console.log('🚀 Initialisation de l\'inventaire de démonstration...');

        // Données de démonstration
        const demoItems = [
            {
                id: 'P001',
                name: 'Clavier USB',
                category: 'Périphériques',
                brand: 'Logitech',
                qty: 25,
                location: 'Rayon A',
                date: new Date().toISOString()
            },
            {
                id: 'P002',
                name: 'Souris sans fil',
                category: 'Périphériques',
                brand: 'Corsair',
                qty: 30,
                location: 'Rayon A',
                date: new Date().toISOString()
            },
            {
                id: 'P003',
                name: 'Écran 24 pouces',
                category: 'Moniteurs',
                brand: 'LG',
                qty: 5,
                location: 'Rayon B',
                date: new Date().toISOString()
            },
            {
                id: 'P004',
                name: 'Câble HDMI',
                category: 'Câbles',
                brand: 'ASUS',
                qty: 100,
                location: 'Rayon C',
                date: new Date().toISOString()
            },
            {
                id: 'P005',
                name: 'Hub USB 4 ports',
                category: 'Accessoires',
                brand: 'Belkin',
                qty: 45,
                location: 'Rayon D',
                date: new Date().toISOString()
            },
            {
                id: 'P006',
                name: 'Casque audio',
                category: 'Périphériques',
                brand: 'Sony',
                qty: 12,
                location: 'Rayon E',
                date: new Date().toISOString()
            },
            {
                id: 'P007',
                name: 'Webcam HD',
                category: 'Caméras',
                brand: 'Logitech',
                qty: 8,
                location: 'Rayon E',
                date: new Date().toISOString()
            },
            {
                id: 'P008',
                name: 'Unité centrale',
                category: 'Ordinateurs',
                brand: 'Dell',
                qty: 20,
                location: 'Rayon F',
                date: new Date().toISOString()
            },
            {
                id: 'P009',
                name: 'Chaise de bureau',
                category: 'Mobilier',
                brand: 'Steelcase',
                qty: 35,
                location: 'Rayon F',
                date: new Date().toISOString()
            },
            {
                id: 'P010',
                name: 'Tableau blanc',
                category: 'Mobilier',
                brand: 'Legamaster',
                qty: 2,
                location: 'Rayon G',
                date: new Date().toISOString()
            }
        ];

        localStorage.setItem('iset_inventory', JSON.stringify(demoItems));
        console.log('✓ ' + demoItems.length + ' articles de démonstration créés');
    }

    // Initialise immédiatement avant tout autre script
    initializeDemoInventory();

})();
