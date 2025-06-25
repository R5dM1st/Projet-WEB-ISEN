console.log("Chargement du script visualisation.js");

// Variable globale pour garder l'instance DataTable
let dataTable = null;

$(document).ready(function () {
  // Initialisation du daterangepicker
  $('#dateRange').daterangepicker({
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Réinitialiser',
      format: 'YYYY-MM-DD'
    }
  });

  // Filtre personnalisé DataTables sur la colonne Date (index 2)
  $.fn.dataTable.ext.search.push(function (settings, data) {
    const dateFilter = $('#dateRange').val();
    if (!dateFilter) return true; // Pas de filtre

    const [start, end] = dateFilter.split(' - ');
    const date = data[2]; // colonne Date

    if (!date) return false;

    return date >= start && date <= end;
  });

  // Appliquer filtre à l'application du daterangepicker
  $('#dateRange').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    if (dataTable) dataTable.draw();
  });

  // Réinitialiser filtre
  $('#dateRange').on('cancel.daterangepicker', function () {
    $(this).val('');
    if (dataTable) dataTable.draw();
  });

  // Charger et afficher la table au démarrage
  fetchAndDisplayPositions();
});


async function fetchAndDisplayPositions() {
  try {
    const response = await fetch(`back/api/get_positions.php?page=1&limit=100000000`);
    const data = await response.json();

    if (!data.success || !Array.isArray(data.data)) {
      console.error("Erreur de chargement des données :", data.message || "Format inattendu");
      return;
    }

    const positions = data.data;
    const tableContainer = document.getElementById("table-container");
    tableContainer.innerHTML = "";

    // Création table
    const table = document.createElement("table");
    table.id = "positionsTable";
    table.className = "display nowrap";
    table.style.width = "100%";

    // En-têtes
    const thead = document.createElement("thead");
    const headers = [
      "MMSI", "Nom", "Date", "Latitude", "Longitude", "SOG",
      "COG", "Cap", "État", "Longueur", "Largeur", "Tirant d’eau"
    ];
    const headerRow = document.createElement("tr");
    headers.forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corps
    const tbody = document.createElement("tbody");
    positions.forEach(pos => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pos.mmsi ?? pos.MMSI ?? 'N/A'}</td>
        <td>${pos.nom ?? pos.name ?? 'N/A'}</td>
        <td>${pos.date_heure ?? pos.date ?? 'N/A'}</td>
        <td>${pos.latitude ?? pos.Latitude ?? 'N/A'}</td>
        <td>${pos.longitude ?? pos.Longitude ?? 'N/A'}</td>
        <td>${pos.sog ?? pos.vitesse ?? pos.Vitesse ?? 'N/A'}</td>
        <td>${pos.cog ?? pos.heading ?? 'N/A'}</td>
        <td>${pos.cap ?? 'N/A'}</td>
        <td>${pos.status ?? pos.etat ?? 'N/A'}</td>
        <td>${pos.longueur ?? 'N/A'}</td>
        <td>${pos.largeur ?? 'N/A'}</td>
        <td>${pos.draft ?? pos.tirantEau ?? pos.tirant_d_eau ?? 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    tableContainer.appendChild(table);

    // Détruire l'ancienne instance si elle existe
    if ($.fn.DataTable.isDataTable('#positionsTable')) {
      $('#positionsTable').DataTable().destroy();
    }

    // Initialiser DataTables
    dataTable = $('#positionsTable').DataTable({
      responsive: true,
      order: [[2, 'desc']], // Tri par date
      pageLength: 30,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json"
      }
    });

  } catch (err) {
    console.error("Erreur lors du chargement des positions :", err);
  }
}
