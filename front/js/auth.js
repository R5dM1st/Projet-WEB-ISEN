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
    const logoutUrl = 'back/api/logout.php';
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.onclick = async function() {
        console.log(`Déconnexion : fetch URL = ${logoutUrl}`);
        await fetch(logoutUrl, { method: 'POST', credentials: 'include' });
        checkSession();
      }
    }
  }

  // Gère l'ouverture et la fermeture des modals
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

    document.querySelectorAll('.modal').forEach(modal => {
      modal.onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
      };
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
    const meUrl = 'back/api/me.php';
    console.log(`Vérification session : fetch URL = ${meUrl}`);
    const response = await fetch(meUrl, { credentials: 'include' });
    const user = await response.json();
    const navAuth = document.querySelector('.nav-auth');
    const navProtected = document.querySelector('.nav-protected');

    if (user.logged_in) {
      navAuth.innerHTML = `
        <span>Bienvenue, ${user.username}!</span> 
        <button id="logoutBtn">Déconnexion</button>
      `;
      if (navProtected) navProtected.style.display = 'flex';
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
      const registerUrl = 'back/api/register.php';

      try {
        console.log(`Inscription : fetch URL = ${registerUrl}`);
        const response = await fetch(registerUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          showMessage('registerResult', 'Erreur de réponse du serveur.', false);
          return;
        }

        showMessage('registerResult', result.message || 'Réponse inconnue.', result.success);

        if (result.success) {
          document.getElementById('modal-register').style.display = 'none';
          window.history.replaceState({}, document.title, window.location.pathname);
          checkSession();
        }

      } catch (networkError) {
        showMessage('registerResult', 'Impossible de contacter le serveur.', false);
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
      const loginUrl = 'back/api/login.php';

      try {
        console.log(`Connexion : fetch URL = ${loginUrl}`);
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });

        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          showMessage('loginResult', 'Erreur de réponse du serveur.', false);
          return;
        }

        showMessage('loginResult', result.message || 'Réponse inconnue.', result.success);

        if (result.success) {
          document.getElementById('modal-login').style.display = 'none';
          window.history.replaceState({}, document.title, window.location.pathname);
          checkSession();
        }

      } catch (networkError) {
        showMessage('loginResult', 'Impossible de contacter le serveur.', false);
      }
    };
  }

  // Initialisation
  checkSession();
  setupModalTriggers();
});
