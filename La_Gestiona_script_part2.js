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
