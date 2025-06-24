// Affichage des messages stylés (succès/erreur)
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

document.addEventListener('DOMContentLoaded', function() {
  // Fonction utilitaire pour afficher un message
  window.showMessage = function(targetId, message, isSuccess) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = `
      <div class="alert ${isSuccess ? 'alert-success' : 'alert-error'}">
        ${message}
      </div>
    `;
    setTimeout(() => { target.innerHTML = ""; }, 5000);
  };

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
  const navProtected = document.querySelector('.nav-protected');

  if (user.logged_in) {
    navAuth.innerHTML = `
      <span>Bienvenue, ${user.username}!</span> 
      <button id="logoutBtn">Déconnexion</button>
    `;
    if (navProtected) navProtected.style.display = 'flex'; // ou 'block' selon le CSS
    setupLogout();
  } else {
    navAuth.innerHTML = `
      <a href="#" class="reg">Register</a>
      <a href="#" class="sign">Login</a>
    `;
    if (navProtected) navProtected.style.display = 'none';
    setupModalTriggers();
  }
}

  // ----- REGISTER -----
  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.onsubmit = async function(e) {
      e.preventDefault();
      const data = {
        username: this.querySelector('[name="username"]').value,
        email: this.querySelector('[name="email"]').value,
        mot_de_passe: this.querySelector('[name="mot_de_passe"]').value
      };
      const response = await fetch('back/api/register.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      showMessage('registerResult', result.message, result.success);
      if(result.success) {
        // Succès inscription
        document.getElementById('modal-register').style.display = 'none';
        // Efface les paramètres et le hash de l'URL sans recharger la page
        window.history.replaceState({}, document.title, window.location.pathname);  
        checkSession();
      }
    };
  }

  // ----- LOGIN -----
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.onsubmit = async function(e) {
      e.preventDefault();
      const data = {
        email: this.querySelector('[name="email"]').value,
        mot_de_passe: this.querySelector('[name="mot_de_passe"]').value
      };
      const response = await fetch('back/api/login.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      showMessage('loginResult', result.message, result.success);
      if(result.success) {
        // Succès connexion
        document.getElementById('modal-login').style.display = 'none';
        // Efface les paramètres et le hash de l'URL sans recharger la page
    window.history.replaceState({}, document.title, window.location.pathname);
        checkSession();
      }
    };
  }

  // Initialisation
  checkSession();
  setupModalTriggers();
});