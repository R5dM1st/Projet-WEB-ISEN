document.addEventListener('DOMContentLoaded', function() {
  // Gère la déconnexion
  function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = async function() {
        await fetch('back/api/logout.php', { method: 'POST', credentials: 'include' });
        checkSession();
      }
    }
  }

  // Gère l'ouverture et la fermeture des modals après MAJ du HTML
  function setupModalTriggers() {
    const regBtn = document.querySelector('.reg');
    if (regBtn) regBtn.onclick = function(e) {
      e.preventDefault();
      document.getElementById('modal-register').style.display = 'flex';
    };
    const signBtn = document.querySelector('.sign');
    if (signBtn) signBtn.onclick = function(e) {
      e.preventDefault();
      document.getElementById('modal-login').style.display = 'flex';
    };

    // Gestion fermeture modals (croix ou fond)
    document.querySelectorAll('.modal').forEach(modal => {
      // Ferme si on clique sur le fond gris
      modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
      };
      // Ferme si on clique sur la croix
      const closeBtn = modal.querySelector('.close');
      if (closeBtn) {
        closeBtn.onclick = function() {
          modal.style.display = 'none';
        };
      }
    });
  }

  // Vérifie la session utilisateur et adapte l'affichage
  async function checkSession() {
    const response = await fetch('back/api/me.php', { credentials: 'include' });
    const user = await response.json();
    const navAuth = document.querySelector('.nav-auth');
    if (user.logged_in) {
      navAuth.innerHTML = `<span>Bienvenue, ${user.username}!</span> <button id="logoutBtn">Déconnexion</button>`;
      setupLogout();
    } else {
      navAuth.innerHTML = `
        <a href="#" class="reg">Register</a>
        <a href="#" class="sign">Login</a>
      `;
      setupModalTriggers(); // Important après modification du HTML
    }
  }

  // Initialisation : vérifie la session et installe les handlers modaux
  checkSession();
  setupModalTriggers();
});