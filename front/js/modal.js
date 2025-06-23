 
    // Ouvre une modale
    document.querySelector('.reg').addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('modal-register').style.display = 'flex';
    });

    document.querySelector('.sign').addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('modal-login').style.display = 'flex';
    });

    // Ferme une modale
    document.querySelectorAll('.close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'none';
      });
    });

    // Ferme au clic à l'extérieur
    window.addEventListener('click', function (e) {
      document.querySelectorAll('.modal').forEach(function (modal) {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
