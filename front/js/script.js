document.addEventListener('DOMContentLoaded', function () {
  const accueilDiv = document.getElementById('accueil');

  if (!accueilDiv) return;

  // Fonction pour injecter un fichier HTML dans #accueil
  function chargerHTMLDansAccueil(fichier, callback) {
    fetch(fichier)
      .then(res => res.text())
      .then(html => {
        accueilDiv.innerHTML = html;
        if (callback) callback();
      })
      .catch(err => {
        console.error("Erreur de chargement :", err);
        accueilDiv.innerHTML = "<p>Erreur lors du chargement de la page.</p>";
      });
  }

  // Page d'accueil
  function renderAccueil() {
    accueilDiv.innerHTML = `
      <main class="main-content" id="main-accueil">
        <h1 class="title">PROJET WEB ISEN</h1>
        <p class="subtitle">Affichez un navire avec son cluster d'appartenance !</p>
        <button id="btn-prediction-cluster" class="purchase-btn">Prediction Cluster</button>
        <br><br><br><br>
        <p class="subtitle">Prédisez le type et la trajectoire d'un navire !</p>
        <button id="btn-prediction-type" class="purchase-btn">Prediction Type</button>
      </main>
    `;
    document.getElementById('btn-prediction-cluster').onclick = renderCluster;
    document.getElementById('btn-prediction-type').onclick = renderType;
  }

  // Prediction Cluster
  function renderCluster() {
    chargerHTMLDansAccueil('front/prediction_cluster.html', () => {
      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
    });
  }

  // Prediction Type
  function renderType() {
    chargerHTMLDansAccueil('front/prediction_type.html', () => {
      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
    });
  }

  // Visualisation
  function renderVisualisation() {
    chargerHTMLDansAccueil('front/visualisation.html', () => {
      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
    });
  }

  // Ajout
  function renderAjout() {
    chargerHTMLDansAccueil('front/ajout.html', () => {
      document.getElementById('ajout-form')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        fetch('/api/ajout.php', {
          method: 'POST',
          body: data
        })
        .then(res => res.text())
        .then(txt => document.getElementById('ajoutResult').innerText = txt)
        .catch(err => console.error(err));
      });

      document.getElementById('form-trajectoire')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(this);
        fetch('/api/predict_trajectory.php', {
          method: 'POST',
          body: data
        })
        .then(res => res.json())
        .then(json => {
          document.getElementById('resultat-trajectoire').innerHTML = `
            <p><strong>Latitude prédite :</strong> ${json.lat}</p>
            <p><strong>Longitude prédite :</strong> ${json.lon}</p>
          `;
        })
        .catch(err => {
          console.error(err);
          document.getElementById('resultat-trajectoire').innerText = "Erreur de prédiction.";
        });
      });

      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
    });
  }

  // Initialisation
  renderAccueil();

  // Navigation
  document.getElementById('nav-ajout')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAjout();
  });

  document.getElementById('nav-visualisation')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderVisualisation();
  });
});
