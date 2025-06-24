// Styles alertes succès/erreur
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .alert {
      padding: 12px 18px;
      border-radius: 5px;
      margin: 10px 0;
      font-weight: bold;
      font-size: 1em;
      text-align: center;
    }
    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('DOMContentLoaded', function () {
  // Fonction utilitaire
  window.showMessage = function(targetId, message, isSuccess) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = `
      <div class="alert ${isSuccess ? 'alert-success' : 'alert-error'}">
        ${message}
      </div>
    `;
    console.log('Message affiché :', message);
    setTimeout(() => { target.innerHTML = ""; }, 5000);
  };

  const form = document.getElementById('ajout-form');
  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();

      const data = {
        mmsi: parseInt(document.getElementById('mmsi').value),
        horodatage: document.getElementById('horodatage').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        draft: parseFloat(document.getElementById('draft').value),
        status: parseInt(document.getElementById('status').value),
        vitesse: parseFloat(document.getElementById('vitesse').value),
        cap: parseFloat(document.getElementById('cap').value),
        heading: parseFloat(document.getElementById('heading').value)
      };

      const url = 'back/api/ajout.php';

      try {
        console.log('Ajout de point : envoi des données', data);
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });

        let result;
        try {
          result = await response.json();
        } catch (err) {
          showMessage('ajoutResult', 'Erreur dans la réponse du serveur.', false);
          return;
        }

        showMessage('ajoutResult', result.message || 'Réponse inconnue.', result.success);
        if (result.success) {
          form.reset(); // Réinitialise les champs
        }
      } catch (err) {
        console.error('Erreur fetch :', err);
        showMessage('ajoutResult', 'Erreur réseau ou serveur injoignable.', false);
      }
    };
  }
});
