(function() {
  // Ajout dynamique du style pour les alertes
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
  // Fonction pour afficher un message stylé (succès/erreur)
  window.showMessage = function(targetId, message, isSuccess) {
    const target = document.getElementById(targetId);
    target.innerHTML = `
      <div class="alert ${isSuccess ? 'alert-success' : 'alert-error'}">
        ${message}
      </div>
    `;
    setTimeout(() => { target.innerHTML = ""; }, 5000);
  };

  // Inscription
  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.onsubmit = async function(e) {
      e.preventDefault();
      const data = {
        username: this.username.value,
        email: this.email.value,
        mot_de_passe: this.mot_de_passe.value
      };
      const response = await fetch('back/api/register.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result);
      showMessage('registerResult', result.message, result.success);
      if(result.success) this.reset();
    };
  }

  // Connexion
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.onsubmit = async function(e) {
      e.preventDefault();
      const data = {
        email: this.email.value,
        mot_de_passe: this.mot_de_passe.value
      };
      const response = await fetch('back/api/login.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result);
      showMessage('loginResult', result.message, result.success);
      if(result.success) this.reset();
    };
  }
});