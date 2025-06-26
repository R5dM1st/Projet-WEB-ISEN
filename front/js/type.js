export function initPrediction() {
  const container = document.getElementById('list-bateaux');
  const resultDiv = document.getElementById('result');
  const btnType = document.getElementById('btn-type');
  const btnTrajectory = document.getElementById('btn-trajectory');
  const selectId = 'select-bateau';

  async function loadBateaux() {
    container.textContent = 'Chargement des bateaux...';
    try {
      const res = await fetch('back/api/get_bateaux.php'); // Chemin adapté
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'Erreur inconnue');

      if (json.data.length === 0) {
        container.textContent = 'Aucun bateau disponible.';
        return;
      }

      // Création du select
      const select = document.createElement('select');
      select.name = 'bateau';
      select.id = selectId;

      json.data.forEach((bateau) => {
        const option = document.createElement('option');
        option.value = bateau.mmsi;
        option.textContent = `${bateau.nom} (MMSI: ${bateau.mmsi})`;
        select.appendChild(option);
      });

      container.innerHTML = '';
      container.appendChild(select);

      btnType.disabled = false;
      btnTrajectory.disabled = false;

    } catch (err) {
      container.textContent = 'Erreur chargement bateaux: ' + err.message;
    }
  }

  async function predict(action) {
    const select = document.getElementById(selectId);
    if (!select || !select.value) {
      alert('Veuillez sélectionner un bateau.');
      return;
    }

    const mmsi = select.value;
    resultDiv.textContent = 'Chargement...';

    try {
      const res = await fetch('back/api/prediction_type.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mmsi, action })
      });

      const json = await res.json();
      if (json.success) {
        resultDiv.textContent = `Prédiction (${action}) :\n${json.prediction}`;
        console.log(json.prediction);
      } else {
        resultDiv.textContent = 'Erreur : ' + json.message;
      }
    } catch (err) {
      resultDiv.textContent = 'Erreur réseau ou serveur : ' + err.message;
    }
  }

  // Bind des boutons
  btnType.addEventListener('click', () => predict('type'));
  btnTrajectory.addEventListener('click', () => predict('trajectory'));

  // Chargement initial
  loadBateaux();
}
