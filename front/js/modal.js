// Open modals
document.getElementById('openRegister').onclick = function(e) {
  e.preventDefault();
  document.getElementById('registerModal').style.display = 'block';
};

document.getElementById('openLogin').onclick = function(e) {
  e.preventDefault();
  document.getElementById('loginModal').style.display = 'block';
};

// Close modals
document.getElementById('closeRegister').onclick = function() {
  document.getElementById('registerModal').style.display = 'none';
};
document.getElementById('closeLogin').onclick = function() {
  document.getElementById('loginModal').style.display = 'none';
};

// Close modal on click outside
window.onclick = function(event) {
  if (event.target === document.getElementById('registerModal')) {
    document.getElementById('registerModal').style.display = 'none';
  }
  if (event.target === document.getElementById('loginModal')) {
    document.getElementById('loginModal').style.display = 'none';
  }
};