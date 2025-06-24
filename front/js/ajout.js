document.getElementById('ajout-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    mmsi: parseInt(document.getElementById('mmsi').value),
    horodatage: document.getElementById('horodatage').value,
    latitude: parseFloat(document.getElementById('latitude').value),
    longitude: parseFloat(document.getElementById('longitude').value),
    draft: parseFloat(document.getElementById('draft').value),
    statu: parseInt(document.getElementById('status').value),
    vitesse: parseFloat(document.getElementById('vitesse').value),
    cap: parseFloat(document.getElementById('cap').value),
    heading: parseFloat(document.getElementById('heading').value)
  };

  fetch('/api/ajout.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(json => {
    document.getElementById('ajoutResult').innerText = json.message;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('ajoutResult').innerText = "Erreur lors de l'ajout.";
  });
});
