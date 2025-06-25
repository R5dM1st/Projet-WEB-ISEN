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
        <h1 class="title">Bienvenue sur le Projet WEB ISEN !</h1>
        <h2 class="subtitle">Une base de données contenant des navires existe ici. <br><br> 
        Vous pouvez exploiter différentes fonctionnalités pour vous amuser avec :</h2>
        - Ajouter des navires <br>
        - Visualiser les effectifs sur une carte <br><br>
        <h2 class="subtitle">Dans l'onglet visualisation :</h2>
        - Prédire le cluster d'un navire <br>
        - Prédire son type et sa trajectoire <br><br>
        <img src="front/assets/img/cartoon-cargo.png" alt="Cargo" /> <br><br>
        <p class="subtitle2">Affichez un navire avec son cluster d'appartenance !</p>
        <button id="btn-prediction-cluster" class="purchase-btn">Prediction Cluster</button>
        <br><br><br><br>
        <p class="subtitle2">Prédisez le type et la trajectoire d'un navire !</p>
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
    // Supprimer l'ancien script s'il existe
    const ancienScript = document.getElementById('visualisation-script');
    if (ancienScript) {
      ancienScript.remove();
    }

    // Créer un nouveau script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'front/js/visualisation.js';
    script.id = 'visualisation-script';

    // Une fois le script chargé, exécuter la fonction d'affichage
    script.onload = () => {
      if (typeof window.fetchAndDisplayPositions === 'function') {
        window.fetchAndDisplayPositions(); // appel manuel après le chargement
      } else {
        console.warn("fetchAndDisplayPositions non définie");
      }
    };

    document.body.appendChild(script);

    document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
  });
}


  // Ajout
  function renderAjout() {
    chargerHTMLDansAccueil('front/ajout.html', () => {
      // Charger le script ajout.js dynamiquement
      const ancienScript = document.getElementById('ajout-script');
      if (ancienScript) {
        ancienScript.remove();
      }
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'front/js/ajout.js';
      script.id = 'ajout-script';
      document.body.appendChild(script);

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
