const apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
const issIconUrl = 'ressources/iss.png';
let map, issMarker;

// Initialiser la carte
function initMap() {
    map = L.map('map').setView([0, 0], 2);

    // Définir les couches de tuiles pour la vue carte et la vue satellite
    const mapView = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    const satelliteView = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>'
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
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const latitude = data.latitude;
        const longitude = data.longitude;

        return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
    } catch (error) {
        console.error('Fetch error:', error);
        return { latitude: 0, longitude: 0 }; // Default position in case of an error
    }
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
