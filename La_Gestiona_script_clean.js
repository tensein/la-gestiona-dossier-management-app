<![CDATA[document.addEventListener('DOMContentLoaded', () => {
    let dossiers = JSON.parse(localStorage.getItem('dossiers')) || [];

    const form = document.getElementById('form-add-dossier');
    const etatSelect = document.getElementById('etat-dossier');
    const termineFields = document.getElementById('termine-fields');
    const autresDetail = document.getElementById('autres-detail');
    const autresDetailInput = document.getElementById('autres-detail-input');
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('section');
    const etaTabs = document.querySelectorAll('.eta-tab');
    const etaContent = document.querySelectorAll('.eta-content');

    function generateDossierNumber() {
        return Date.now().toString();
    }

    function formatDossierName(name) {
        return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/^./, str => str.toUpperCase());
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    function updateDossiersList() {
        const list = document.getElementById('dossiers-list');
        if (!list) return;
        list.innerHTML = dossiers.map(d => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded shadow-sm">
                <div>
                    <div class="font-medium">${d.name}</div>
                    <div class="text-sm text-gray-600">${formatDate(d.dateArrivee)}</div>
                </div>
                <button onclick="deleteDossier('${d.number}')" class="text-red-600 hover:text-red-800 px-2 py-1">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    window.deleteDossier = (number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
            dossiers = dossiers.filter(d => d.number !== number);
            localStorage.setItem('dossiers', JSON.stringify(dossiers));
            updateDossiersList();
        }
    };

    etatSelect.addEventListener('change', () => {
        if (etatSelect.value === 'termine') {
            termineFields.classList.remove('hidden');
            document.getElementById('date-fin').required = true;
            document.getElementById('nb-ecritures').required = true;
        } else {
            termineFields.classList.add('hidden');
            document.getElementById('date-fin').required = false;
            document.getElementById('nb-ecritures').required = false;
        }
    });

    autresDetail.addEventListener('change', () => {
        autresDetailInput.classList.toggle('hidden', !autresDetail.checked);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            number: generateDossierNumber(),
            name: formatDossierName(document.getElementById('dossier-name').value),
            dateArrivee: document.getElementById('date-arrivee').value,
            etat: etatSelect.value,
            dateFin: document.getElementById('date-fin').value || null,
            nbEcritures: document.getElementById('nb-ecritures').value || 0,
            piecesSaisies: Array.from(document.querySelectorAll('input[name="pieces-saisies"]:checked')).map(i => i.value),
            piecesManquantes: Array.from(document.querySelectorAll('input[name="pieces-manquantes"]:checked')).map(i => i.value),
            autresDetail: autresDetail.checked ? autresDetailInput.querySelector('input').value : '',
            remarque: document.getElementById('remarque').value
        };
        dossiers.push(formData);
        localStorage.setItem('dossiers', JSON.stringify(dossiers));
        form.reset();
        termineFields.classList.add('hidden');
        autresDetailInput.classList.add('hidden');
        updateDossiersList();
        alert('Dossier ajouté avec succès!');
    });

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = `section-${button.dataset.section}`;
            navButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-700'));
            button.classList.add('active', 'bg-blue-700');
            sections.forEach(section => {
                section.classList.add('hidden');
                if (section.id === sectionId) section.classList.remove('hidden');
            });
            if (sectionId === 'section-dos') updateDossiersList();
        });
    });

    etaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = `tab-${tab.dataset.tab}`;
            etaTabs.forEach(t => t.classList.remove('active', 'bg-blue-600', 'text-white'));
            tab.classList.add('active', 'bg-blue-600', 'text-white');
            etaContent.forEach(content => {
                content.classList.add('hidden');
                if (content.id === tabId) content.classList.remove('hidden');
            });
        });
    });

    updateDossiersList();
});
]]>
