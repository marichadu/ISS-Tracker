const apiUrl = 'http://api.open-notify.org/iss-now.json';
const issIconUrl = 'ressources/iss.png';
let map, issMarker;

// Initialiser la carte
function initMap() {
    map = L.map('map').setView([0, 0], 2);

    // Définir les couches de tuiles pour la vue carte et la vue satellite
    const mapView = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const satelliteView = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Ajouter la vue carte par défaut
    mapView.addTo(map);

    // Définir les couches de base
    const baseLayers = {
        "Map View": mapView,
        "Satellite View": satelliteView
    };

    // Ajouter le contrôle des couches à la carte
    L.control.layers(baseLayers).addTo(map);

    const issIcon = L.icon({
        iconUrl: issIconUrl,
        iconSize: [75, 48], // Taille augmentée
        iconAnchor: [37.5, 24]
    });

    issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
}

// Récupérer les données de localisation de l'ISS
async function fetchIssLocation() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const { latitude, longitude } = data.iss_position;
    return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
}

// Mettre à jour la localisation de l'ISS sur la carte
async function updateIssLocation() {
    const { latitude, longitude } = await fetchIssLocation();
    const newLatLng = [latitude, longitude];

    issMarker.setLatLng(newLatLng);
    map.setView(newLatLng, map.getZoom());

    // Mettre à jour l'affichage des coordonnées
    document.getElementById('longitude').textContent = longitude.toFixed(4);
    document.getElementById('latitude').textContent = latitude.toFixed(4);
}

// Initialiser la carte et commencer à mettre à jour la localisation de l'ISS
initMap();
updateIssLocation();
setInterval(updateIssLocation, 3000); // Mettre à jour toutes les 3 secondes