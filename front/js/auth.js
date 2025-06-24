document.addEventListener('DOMContentLoaded', function() {
  const formAjout = document.getElementById('form-ajout');
  if (formAjout) {
    formAjout.onsubmit = async function(e) {
      e.preventDefault();

      const data = {
        titre: this.querySelector('[name="titre"]').value,
        contenu: this.querySelector('[name="contenu"]').value
      };

      const ajoutUrl = 'back/api/ajout.php';

      try {
        console.log(`Ajout : fetch URL = ${ajoutUrl}`);
        const response = await fetch(ajoutUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // si la session est nécessaire
          body: JSON.stringify(data)
        });
        console.log(JSON.stringify(data));
        let result;
        try {
          result = await response.json();
        
        } catch (jsonError) {
          console.log('Erreur JSON:', jsonError);
          showMessage('registerResult', 'Erreur de réponse du serveur.', false);
          return;
        }

        showMessage('ajoutResult', result.message || 'Réponse inconnue.', result.success);
        if (result.success) {
          formAjout.reset(); // Vide le formulaire après succès
        }

      } catch (networkError) {
        showMessage('ajoutResult', 'Impossible de contacter le serveur.', false);
      }
    };
  }
});
