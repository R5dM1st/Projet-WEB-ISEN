const selectMmsi = document.getElementById('mmsi');
const ajoutForm = document.getElementById('ajout-form');
const ajoutResult = document.getElementById('ajoutResult');
const submitBtn = ajoutForm.querySelector('button[type="submit"]');
document.getElementById("ajout-form").addEventListener("submit", function (e) {
  const lat = parseFloat(document.getElementById("latitude").value);
  const lon = parseFloat(document.getElementById("longitude").value);

  // Limites géographiques du Golfe du Mexique
  const minLat = 18.0, maxLat = 31.0;
  const minLon = -98.0, maxLon = -81.0;

  let erreurs = [];

  if (lat < minLat || lat > maxLat) {
    erreurs.push("La latitude est hors du Golfe du Mexique (18 à 31°N).");
  }
  if (lon < minLon || lon > maxLon) {
    erreurs.push("La longitude est hors du Golfe du Mexique (-98 à -81°W).");
  }

  if (erreurs.length > 0) {
    e.preventDefault();
    const resultDiv = document.getElementById("ajoutResult");
    resultDiv.innerHTML = `<div class="alert alert-danger">${erreurs.join("<br>")}</div>`;
  }
});
if (!selectMmsi || !ajoutForm || !ajoutResult || !submitBtn) {
  console.error('Un élément du DOM est introuvable');
  throw new Error('Éléments DOM manquants');
}

let timerMessage = null;

function afficherMessage(message, type = 'info', duree = 5000) {
  // Nettoie timer précédent
  if (timerMessage) {
    clearTimeout(timerMessage);
    timerMessage = null;
  }

  ajoutResult.style.transition = 'opacity 0.4s ease';
  ajoutResult.style.opacity = 0;

  setTimeout(() => {
    ajoutResult.textContent = message;
    ajoutResult.style.padding = '10px';
    ajoutResult.style.borderRadius = '5px';
    ajoutResult.style.marginTop = '10px';
    ajoutResult.style.fontWeight = '600';
    ajoutResult.style.color = type === 'success' ? '#155724' :
                             type === 'error' ? '#721c24' :
                             '#0c5460';
    ajoutResult.style.backgroundColor = type === 'success' ? '#d4edda' :
                                       type === 'error' ? '#f8d7da' :
                                       '#d1ecf1';
    ajoutResult.style.border = type === 'success' ? '1px solid #c3e6cb' :
                              type === 'error' ? '1px solid #f5c6cb' :
                              '1px solid #bee5eb';
    ajoutResult.style.opacity = 1;
  }, 400);

  if (duree > 0) {
    timerMessage = setTimeout(() => {
      ajoutResult.style.opacity = 0;
      setTimeout(() => {
        ajoutResult.textContent = '';
        ajoutResult.style.padding = '';
        ajoutResult.style.border = '';
        ajoutResult.style.backgroundColor = '';
        ajoutResult.style.opacity = '';
      }, 400);
    }, duree);
  }
}

async function loadBateaux() {
  try {
    const response = await fetch('http://localhost/Projet-WEB-ISEN/back/api/get_bateaux.php');
    if (!response.ok) throw new Error('Erreur HTTP ' + response.status);

    const data = await response.json();
    console.log('Liste des bateaux reçue :', data.data);

    if (data.success && Array.isArray(data.data)) {
      selectMmsi.innerHTML = '<option value="">-- Sélectionner un bateau --</option>';
      data.data.forEach(bateau => {
        const option = document.createElement('option');
        option.value = bateau.mmsi;
        option.textContent = `${bateau.nom} (${bateau.mmsi})`;
        selectMmsi.appendChild(option);
      });
    } else {
      selectMmsi.innerHTML = '<option value="">Erreur chargement bateaux</option>';
      afficherMessage('Erreur : ' + (data.message || 'Données invalides'), 'error', 0);
    }
  } catch (error) {
    selectMmsi.innerHTML = '<option value="">Erreur chargement bateaux</option>';
    afficherMessage('Erreur réseau : ' + error.message, 'error', 0);
  }
}

loadBateaux();

ajoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  afficherMessage('Envoi en cours...', 'info', 0);

  const formData = new FormData(ajoutForm);

  const payload = {
    mmsi: formData.get('mmsi'),
    date_heure: formData.get('horodatage'),
    latitude: parseFloat(formData.get('latitude')),
    longitude: parseFloat(formData.get('longitude')),
    draft: parseFloat(formData.get('draft')),
    status: parseInt(formData.get('status'), 10),
    vitesse: parseFloat(formData.get('vitesse')),
    cap: parseFloat(formData.get('cap')),
    heading: parseFloat(formData.get('heading'))
  };

  try {
    const response = await fetch('http://localhost/Projet-WEB-ISEN/back/api/ajout.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Erreur HTTP ' + response.status);
    const result = await response.json();

    if (result.success) {
      afficherMessage('Point de position ajouté avec succès !', 'success');
      ajoutForm.reset();
    } else {
      afficherMessage('Erreur : ' + (result.message || 'Échec de l\'ajout'), 'error');
    }
  } catch (error) {
    afficherMessage('Erreur réseau lors de l\'envoi du formulaire : ' + error.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});
