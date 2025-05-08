// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize dossiers from localStorage or create empty array
    let dossiers = JSON.parse(localStorage.getItem('dossiers')) || [];

    // DOM Elements
    const app = {
        form: document.getElementById('form-add-dossier'),
        etatSelect: document.getElementById('etat-dossier'),
        termineFields: document.getElementById('termine-fields'),
        autresDetail: document.getElementById('autres-detail'),
        autresDetailInput: document.getElementById('autres-detail-input'),
        navButtons: document.querySelectorAll('.nav-btn'),
        sections: document.querySelectorAll('section'),
        etaTabs: document.querySelectorAll('.eta-tab'),
        etaContent: document.querySelectorAll('.eta-content'),
        dossiersList: document.getElementById('dossiers-list')
    };

    // Helper Functions
    const generateDossierNumber = () => {
        return Date.now().toString();
    };

    const formatDossierName = (name) => {
        return name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/^./, str => str.toUpperCase());
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Navigation
    app.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = `section-${button.dataset.section}`;
            
            // Update active button
            app.navButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-700'));
            button.classList.add('active', 'bg-blue-700');
            
            // Show selected section
            app.sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                }
            });

            // Refresh lists when switching sections
            if (sectionId === 'section-dos') updateDossiersList();
            if (sectionId === 'section-mod') updateModifierList();
            if (sectionId === 'section-sup') updateSupprimerList();
            if (sectionId === 'section-eta') updateEtatsLists();
        });
    });

    // États tabs
    app.etaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = `tab-${tab.dataset.tab}`;
            
            // Update active tab
            app.etaTabs.forEach(t => t.classList.remove('active', 'bg-blue-600', 'text-white'));
            tab.classList.add('active', 'bg-blue-600', 'text-white');
            
            // Show selected content
            app.etaContent.forEach(content => {
                content.classList.add('hidden');
                if (content.id === tabId) {
                    content.classList.remove('hidden');
                }
            });
        });
    });

    // Dynamic form behavior
    app.etatSelect.addEventListener('change', () => {
        if (app.etatSelect.value === 'termine') {
            app.termineFields.classList.remove('hidden');
            document.getElementById('date-fin').required = true;
            document.getElementById('nb-ecritures').required = true;
        } else {
            app.termineFields.classList.add('hidden');
            document.getElementById('date-fin').required = false;
            document.getElementById('nb-ecritures').required = false;
        }
    });

    app.autresDetail.addEventListener('change', () => {
        app.autresDetailInput.classList.toggle('hidden', !app.autresDetail.checked);
    });

    // Form submission
    app.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            number: generateDossierNumber(),
            name: formatDossierName(document.getElementById('dossier-name').value),
            dateArrivee: document.getElementById('date-arrivee').value,
            etat: app.etatSelect.value,
            dateFin: document.getElementById('date-fin').value || null,
            nbEcritures: document.getElementById('nb-ecritures').value || 0,
            piecesSaisies: Array.from(document.querySelectorAll('input[name="pieces-saisies"]:checked'))
                .map(input => input.value),
            piecesManquantes: Array.from(document.querySelectorAll('input[name="pieces-manquantes"]:checked'))
                .map(input => input.value),
            autresDetail: app.autresDetail.checked ? app.autresDetailInput.querySelector('input').value : '',
            remarque: document.getElementById('remarque').value
        };

        // Add new dossier
        dossiers.push(formData);
        
        // Save to localStorage
        localStorage.setItem('dossiers', JSON.stringify(dossiers));
        
        // Reset form
        app.form.reset();
        app.termineFields.classList.add('hidden');
        app.autresDetailInput.classList.add('hidden');
        
        // Update lists
        updateDossiersList();
        
        // Show success message
        alert('Dossier ajouté avec succès!');
    });

    // Update lists functions
    function updateDossiersList() {
        const list = document.getElementById('dossiers-list');
        if (!list) return;
        
        list.innerHTML = dossiers.map(dossier => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded shadow-sm">
                <div>
                    <div class="font-medium">${dossier.name}</div>
                    <div class="text-sm text-gray-600">${formatDate(dossier.dateArrivee)}</div>
                </div>
                <button onclick="deleteDossier('${dossier.number}')" 
                        class="text-red-600 hover:text-red-800 px-2 py-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function updateModifierList() {
        const list = document.getElementById('modifier-list');
        if (!list) return;

        list.innerHTML = dossiers.map(dossier => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded shadow-sm">
                <div>
                    <div class="font-medium">${dossier.name}</div>
                    <div class="text-sm text-gray-600">${formatDate(dossier.dateArrivee)}</div>
                </div>
                <div class="space-x-2">
                    <button onclick="modifyDossier('${dossier.number}')" 
                            class="text-blue-600 hover:text-blue-800 px-2 py-1">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteDossier('${dossier.number}')" 
                            class="text-red-600 hover:text-red-800 px-2 py-1">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    function updateSupprimerList() {
        const list = document.getElementById('supprimer-list');
        if (!list) return;

        list.innerHTML = dossiers.map(dossier => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded shadow-sm">
                <div>
                    <div class="font-medium">${dossier.name}</div>
                    <div class="text-sm text-gray-600">${formatDate(dossier.dateArrivee)}</div>
                </div>
                <button onclick="deleteDossier('${dossier.number}')" 
                        class="text-red-600 hover:text-red-800 px-2 py-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    function updateEtatsLists() {
        // Dossiers traités
        const traitesList = document.getElementById('traites-list');
        if (traitesList) {
            const dossierstraites = dossiers.filter(d => d.etat === 'termine');
            traitesList.innerHTML = dossierstraites.map(dossier => `
                <div class="p-2 border-b">
                    <div class="flex justify-between">
                        <span>${formatDate(dossier.dateArrivee)}</span>
                        <span>${dossier.name}</span>
                        <span>${dossier.nbEcritures}</span>
                    </div>
                </div>
            `).join('');
        }

        // Pièces manquantes
        const manquantsList = document.getElementById('manquants-list');
        if (manquantsList) {
            const dossiersManquants = dossiers.filter(d => d.piecesManquantes.length > 0);
            manquantsList.innerHTML = dossiersManquants.map(dossier => `
                <div class="p-2 border-b">
                    <div class="flex justify-between">
                        <span>${formatDate(dossier.dateArrivee)}</span>
                        <span>${dossier.name}</span>
                        <span>${removeAccents(dossier.piecesManquantes.join(', '))}</span>
                    </div>
                </div>
            `).join('');
        }

        // Écritures total
        const ecrituresList = document.getElementById('ecritures-list');
        if (ecrituresList) {
            const dossiersGrouped = dossiers.reduce((acc, dossier) => {
                if (!acc[dossier.name]) {
                    acc[dossier.name] = 0;
                }
                acc[dossier.name] += parseInt(dossier.nbEcritures) || 0;
                return acc;
            }, {});

            let total = 0;
            ecrituresList.innerHTML = Object.entries(dossiersGrouped)
                .map(([name, count]) => {
                    total += count;
                    return `
                        <div class="p-2 border-b">
                            <div class="flex justify-between">
                                <span>${name}</span>
                                <span>${count}</span>
                            </div>
                        </div>
                    `;
                })
                .join('') + `
                    <div class="p-2 font-bold">
                        <div class="flex justify-between">
                            <span>Total</span>
                            <span>${total}</span>
                        </div>
                    </div>
                `;
        }
    }

    // Make functions available globally
    window.deleteDossier = (number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
            dossiers = dossiers.filter(d => d.number !== number);
            localStorage.setItem('dossiers', JSON.stringify(dossiers));
            updateDossiersList();
            updateModifierList();
            updateSupprimerList();
            updateEtatsLists();
        }
    };

    window.modifyDossier = (number) => {
        const dossier = dossiers.find(d => d.number === number);
        if (!dossier) return;

        // Fill form with dossier data
        document.getElementById('dossier-number').value = dossier.number;
        document.getElementById('dossier-name').value = dossier.name;
        document.getElementById('date-arrivee').value = dossier.dateArrivee;
        app.etatSelect.value = dossier.etat;
        
        if (dossier.etat === 'termine') {
            app.termineFields.classList.remove('hidden');
            document.getElementById('date-fin').value = dossier.dateFin;
            document.getElementById('nb-ecritures').value = dossier.nbEcritures;
        }

        // Check appropriate checkboxes
        document.querySelectorAll('input[name="pieces-saisies"]').forEach(input => {
            input.checked = dossier.piecesSaisies.includes(input.value);
        });

        document.querySelectorAll('input[name="pieces-manquantes"]').forEach(input => {
            input.checked = dossier.piecesManquantes.includes(input.value);
        });

        if (dossier.autresDetail) {
            app.autresDetail.checked = true;
            app.autresDetailInput.classList.remove('hidden');
            app.autresDetailInput.querySelector('input').value = dossier.autresDetail;
        }

        document.getElementById('remarque').value = dossier.remarque;

        // Switch to add section (which now acts as modify)
        app.navButtons.forEach(btn => {
            if (btn.dataset.section === 'ajt') btn.click();
        });

        // Change form submit button
        const submitBtn = app.form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Modifier';
        submitBtn.classList.add('modify-mode');

        // Update form submit handler for modification
        const originalSubmitHandler = app.form.onsubmit;
        app.form.onsubmit = (e) => {
            e.preventDefault();

            // Update dossier
            const index = dossiers.findIndex(d => d.number === number);
            if (index !== -1) {
                dossiers[index] = {
                    ...dossiers[index],
                    name: formatDossierName(document.getElementById('dossier-name').value),
                    dateArrivee: document.getElementById('date-arrivee').value,
                    etat: app.etatSelect.value,
                    dateFin: document.getElementById('date-fin').value || null,
                    nbEcritures: document.getElementById('nb-ecritures').value || 0,
                    piecesSaisies: Array.from(document.querySelectorAll('input[name="pieces-saisies"]:checked'))
                        .map(input => input.value),
                    piecesManquantes: Array.from(document.querySelectorAll('input[name="pieces-manquantes"]:checked'))
                        .map(input => input.value),
                    autresDetail: app.autresDetail.checked ? app.autresDetailInput.querySelector('input').value : '',
                    remarque: document.getElementById('remarque').value
                };

                localStorage.setItem('dossiers', JSON.stringify(dossiers));
                
                // Reset form and UI
                app.form.reset();
                app.termineFields.classList.add('hidden');
                app.autresDetailInput.classList.add('hidden');
                submitBtn.textContent = 'Ajouter';
                submitBtn.classList.remove('modify-mode');
                app.form.onsubmit = originalSubmitHandler;

                // Update lists
                updateDossiersList();
                updateModifierList();
                updateSupprimerList();
                updateEtatsLists();

                alert('Dossier modifié avec succès!');
            }
        };
    };

    // Initial list updates
    updateDossiersList();
    updateModifierList();
    updateSupprimerList();
    updateEtatsLists();
});
