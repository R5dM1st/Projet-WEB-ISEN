$(document).ready(function () {
    const table = $('#table-bateaux').DataTable({
        processing: true,
        serverSide: true,
        searching: false, // 🔥 Supprime la barre de recherche auto
        ajax: {
            url: 'back/api/get_positions.php',
            type: 'GET',
            data: function (d) {
                d.nom = $('#nomBateau').val();
                d.dateStart = $('#dateStart').val();
                d.dateEnd = $('#dateEnd').val();
                d.search = { value: $('#searchBox').val() }; // facultatif si tu ajoutes un champ manuel
            },
            error: function (xhr) {
                console.error("Erreur AJAX :", xhr.responseText);
                alert("Erreur lors du chargement des données.");
            }
        },
        pageLength: 30,
        lengthMenu: [10, 30, 50, 100],
        columns: [
            { data: 'MMSI' },
            { data: 'nom' },
            { data: 'date_heure' },
            { data: 'Latitude' },
            { data: 'Longitude' },
            { data: 'sog' },
            { data: 'cog' },
            { data: 'cap' },
            { data: 'status' },
            { data: 'longueur' },
            { data: 'largeur' },
            { data: 'draft' }
        ],
        order: [[2, 'desc']],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json"
        }
    });

    $('#filterBtn').on('click', function () {
        table.ajax.reload();
    });

    $('#resetBtn').on('click', function () {
        $('#nomBateau').val('');
        $('#dateStart').val('');
        $('#dateEnd').val('');
        $('#searchBox').val('');
        table.ajax.reload(); // recharge sans filtre
    });

    // 🔁 Quand on clique sur une ligne
    $('#table-bateaux tbody').on('click', 'tr', function () {
        const data = table.row(this).data();
        if (data && data.MMSI) {
            $('#modal-mmsi').text(`MMSI: ${data.MMSI}`);
            $('#predictionModal').show();
            $('#modalOverlay').show();
            $('#prediction-result').text('');
            $('#btn-predict-type').data('mmsi', data.MMSI);
            $('#btn-predict-trajectory').data('mmsi', data.MMSI);
        }
    });

    // 🎯 Actions de prédiction
    async function predictBateau(mmsi, action) {
        $('#prediction-result').text('Chargement...');
        try {
            const res = await fetch('back/api/prediction_type.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mmsi, action })
            });
            const json = await res.json();
            if (json.success) {
                $('#prediction-result').text(`Prédiction (${action}) :\n${json.prediction}`);
            } else {
                $('#prediction-result').text(`Erreur : ${json.message}`);
            }
        } catch (err) {
            $('#prediction-result').text(`Erreur réseau : ${err.message}`);
        }
    }

    $('#btn-predict-type').on('click', function () {
        const mmsi = $(this).data('mmsi');
        predictBateau(mmsi, 'type');
    });

    $('#btn-predict-trajectory').on('click', function () {
        const mmsi = $(this).data('mmsi');
        predictBateau(mmsi, 'trajectory');
    });

    // 🧼 Fermer la modale
    window.closePredictionModal = function () {
        $('#predictionModal').hide();
        $('#modalOverlay').hide();
    };

    $('#modalOverlay').on('click', function () {
        closePredictionModal();
    });
});
