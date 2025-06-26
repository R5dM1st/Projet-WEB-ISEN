document.addEventListener('DOMContentLoaded', () => {
  const accueilDiv = document.getElementById('accueil');
  if (!accueilDiv) return;

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

  // ----------------------------
  // Pages
  // ----------------------------
function nextTick() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}
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
    document.getElementById('btn-prediction-cluster')?.addEventListener('click', renderCluster);
    document.getElementById('btn-prediction-type')?.addEventListener('click', renderType);
  }

  function renderCluster() {
    chargerHTMLDansAccueil('front/prediction_cluster.html', async () => {
      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
      try {
        const module = await import('./cluster.js');
        if (typeof module.initCluster === 'function') {
          module.initCluster();
        } else {
          console.warn('initCluster() manquant dans cluster.js');
        }
      } catch (err) {
        console.error('Erreur import cluster.js:', err);
      }
    });
  }

  function renderType() {
  // Ajout d'un timestamp pour éviter le cache navigateur
  const fichier = `front/prediction_type.html?_=${Date.now()}`;

  fetch(fichier)
    .then(res => res.text())
    .then(async (html) => {
      accueilDiv.innerHTML = html;

      // Attente que DOM soit inséré dans la page avant d'agir
      await nextTick();

      document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);

      try {
        const module = await import('./type.js');
        if (typeof module.initPrediction === 'function') {
          module.initPrediction();
        } else {
          console.warn('initPrediction() manquant dans type.js');
        }
      } catch (err) {
        console.error('Erreur import type.js:', err);
      }
    })
    .catch(err => {
      console.error("Erreur de chargement :", err);
      accueilDiv.innerHTML = "<p>Erreur lors du chargement de la page.</p>";
    });
}

  function renderVisualisation() {
    chargerHTMLDansAccueil('front/visualisation.html', () => {
      const oldScript = document.getElementById('visualisation-script');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.src = 'front/js/visualisation.js';
      script.id = 'visualisation-script';
      script.onload = () => {
        if (typeof window.initDataTable === 'function') {
          window.initDataTable();
        }
        document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
      };
      document.body.appendChild(script);
    });
  }

  function renderAjout() {
    chargerHTMLDansAccueil('front/ajout.html', () => {
      const oldScript = document.getElementById('ajout-script');
      if (oldScript) oldScript.remove();

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'front/js/ajout.js';
      script.id = 'ajout-script';
      script.onload = () => {
        document.getElementById('btn-accueil-back')?.addEventListener('click', renderAccueil);
      };
      document.body.appendChild(script);
    });
  }

  // ----------------------------
  // Initialisation
  // ----------------------------
  renderAccueil();

  document.getElementById('nav-ajout')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderAjout();
  });

  document.getElementById('nav-visualisation')?.addEventListener('click', (e) => {
    e.preventDefault();
    renderVisualisation();
  });
});
