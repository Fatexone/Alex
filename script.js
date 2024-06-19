const biens = {
    france: {
        paris: [
            { adresse: "12 Rue de Rivoli, 75001 Paris", description: "Appartement spacieux avec vue sur le Louvre", lat: 48.8566, lng: 2.3522, prix: 1200000, superficie: 120, prix_m2: 10000 },
            { adresse: "22 Rue Montmartre, 75002 Paris", description: "Bureaux modernes en plein centre", lat: 48.8635, lng: 2.3444, prix: 800000, superficie: 80, prix_m2: 10000 },
            { adresse: "33 Rue de Bretagne, 75003 Paris", description: "Loft industriel dans le Marais", lat: 48.8627, lng: 2.3609, prix: 950000, superficie: 95, prix_m2: 10000 },
            { adresse: "44 Rue Saint-Antoine, 75004 Paris", description: "Immeuble résidentiel près de la Bastille", lat: 48.8544, lng: 2.3695, prix: 1500000, superficie: 150, prix_m2: 10000 }
        ],
        marseille: [
            { adresse: "1 Rue de Marseille, 13001 Marseille", description: "Appartement avec vue sur le Vieux-Port", lat: 43.2965, lng: 5.3698, prix: 700000, superficie: 100, prix_m2: 7000 },
            { adresse: "2 Rue de la République, 13002 Marseille", description: "Loft moderne en centre-ville", lat: 43.297, lng: 5.374, prix: 650000, superficie: 90, prix_m2: 7222 },
            { adresse: "3 Avenue des Chartreux, 13004 Marseille", description: "Maison de ville avec jardin", lat: 43.300, lng: 5.400, prix: 850000, superficie: 120, prix_m2: 7083 },
            { adresse: "4 Boulevard Longchamp, 13001 Marseille", description: "Appartement près du Palais Longchamp", lat: 43.303, lng: 5.379, prix: 600000, superficie: 80, prix_m2: 7500 }
        ],
        // ... les autres villes et biens
    },
    maroc: {
        rabat: [
            { adresse: "1 Avenue Mohammed V, Rabat", description: "Appartement spacieux en centre-ville", lat: 34.020882, lng: -6.84165, prix: 500000, superficie: 100, prix_m2: 5000 },
            { adresse: "2 Rue de Marrakech, Rabat", description: "Loft moderne près de la plage", lat: 34.021882, lng: -6.84765, prix: 450000, superficie: 90, prix_m2: 5000 },
            { adresse: "3 Boulevard Hassan II, Rabat", description: "Immeuble résidentiel avec jardin", lat: 34.022882, lng: -6.84365, prix: 550000, superficie: 110, prix_m2: 5000 }
        ],
        casablanca: [
            { adresse: "1 Boulevard de la Corniche, Casablanca", description: "Appartement avec vue sur l'océan", lat: 33.603077, lng: -7.631761, prix: 750000, superficie: 150, prix_m2: 5000 },
            { adresse: "2 Rue de Paris, Casablanca", description: "Loft moderne en centre-ville", lat: 33.605077, lng: -7.630761, prix: 650000, superficie: 130, prix_m2: 5000 },
            { adresse: "3 Avenue des FAR, Casablanca", description: "Immeuble résidentiel près du parc", lat: 33.606077, lng: -7.629761, prix: 700000, superficie: 140, prix_m2: 5000 }
        ],
        // ... les autres villes et biens
    }
};

let map;
let markers = [];
let selectedMarker = null;
let placesService;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2
    });
    placesService = new google.maps.places.PlacesService(map);
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

function addMarker(position, color = 'red', isSelected = false) {
    const marker = new google.maps.Marker({
        position,
        map,
        animation: isSelected ? google.maps.Animation.BOUNCE : null,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: 'white'
        }
    });
    markers.push(marker);
    return marker;
}

function displayVilles() {
    const paysSelect = document.getElementById('paysSelect');
    const villeSelect = document.getElementById('villeSelect');
    const selectedPays = paysSelect.value;

    villeSelect.innerHTML = '<option value="">--Sélectionner une ville--</option>';

    if (selectedPays && biens[selectedPays]) {
        for (const ville in biens[selectedPays]) {
            const option = document.createElement('option');
            option.value = ville;
            option.text = ville.charAt(0).toUpperCase() + ville.slice(1);
            villeSelect.add(option);
        }
    }

    clearMarkers();
    map.setCenter({ lat: 0, lng: 0 });
    map.setZoom(2);
}

function displayBiens() {
    const paysSelect = document.getElementById('paysSelect');
    const villeSelect = document.getElementById('villeSelect');
    const bienSelect = document.getElementById('bienSelect');
    const selectedPays = paysSelect.value;
    const selectedVille = villeSelect.value;

    bienSelect.innerHTML = '<option value="">--Sélectionner un bien--</option>';
    clearMarkers();

    if (selectedPays && selectedVille && biens[selectedPays][selectedVille]) {
        biens[selectedPays][selectedVille].forEach((bien, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = bien.adresse;
            bienSelect.add(option);
            addMarker({ lat: bien.lat, lng: bien.lng });
        });
        map.setCenter({ lat: biens[selectedPays][selectedVille][0].lat, lng: biens[selectedPays][selectedVille][0].lng });
        map.setZoom(12);
    }
}
function displayBien() {
    const paysSelect = document.getElementById('paysSelect');
    const villeSelect = document.getElementById('villeSelect');
    const bienSelect = document.getElementById('bienSelect');
    const bienDetails = document.getElementById('bienDetails');
    const selectedPays = paysSelect.value;
    const selectedVille = villeSelect.value;
    const selectedBienIndex = bienSelect.value;

    if (selectedPays && selectedVille && selectedBienIndex && biens[selectedPays][selectedVille][selectedBienIndex]) {
        const bien = biens[selectedPays][selectedVille][selectedBienIndex];
        bienDetails.innerHTML = `
            <h3>${bien.adresse}</h3>
            <p>${bien.description}</p>
            <p>Prix: ${bien.prix.toLocaleString()} €</p>
            <p>Superficie: ${bien.superficie} m²</p>
            <p>Prix par mètre carré: ${bien.prix_m2.toLocaleString()} €/m²</p>
        `;

        const bienPosition = { lat: bien.lat, lng: bien.lng };

        if (selectedMarker) {
            selectedMarker.setAnimation(null);
        }

        selectedMarker = addMarker(bienPosition, 'blue', true);

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <h3>${bien.adresse}</h3>
                <p>${bien.description}</p>
                <p>Prix: ${bien.prix.toLocaleString()} €</p>
                <p>Superficie: ${bien.superficie} m²</p>
                <p>Prix par mètre carré: ${bien.prix_m2.toLocaleString()} €/m²</p>
            `
        });

        selectedMarker.addListener('click', () => {
            infoWindow.open(map, selectedMarker);
        });

        map.setCenter(bienPosition);
        map.setZoom(15);
    } else {
        bienDetails.innerHTML = '';
        if (selectedMarker) {
            selectedMarker.setAnimation(null);
        }
        map.setCenter({ lat: 0, lng: 0 });
        map.setZoom(2);
    }
}


function displayCommerces() {
    const commercesList = document.getElementById('commercesList');
    const selectedCommerces = document.querySelector('input[name="commerces"]:checked')?.value;

    if (selectedCommerces && selectedMarker) {
        commercesList.innerHTML = `<h3>${selectedCommerces}</h3><ul id="commercesListItems"></ul>`;
        clearMarkers();
        addMarker(selectedMarker.getPosition(), 'blue', true);
        searchNearby(selectedMarker.getPosition(), selectedCommerces.toLowerCase());
    } else {
        commercesList.innerHTML = '';
    }
}

function searchNearby(location, type) {
    const request = {
        location,
        radius: '1000', // 1km radius
        type
    };

    placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const commercesListItems = document.getElementById('commercesListItems');
            results.forEach(result => {
                if (result.types.includes(type)) {
                    const distance = google.maps.geometry.spherical.computeDistanceBetween(location, result.geometry.location);
                    const listItem = document.createElement('li');
                    listItem.textContent = `${result.name} - ${(distance / 1000).toFixed(2)} km`;
                    listItem.onclick = () => displayRoute(result.geometry.location);
                    commercesListItems.appendChild(listItem);
                    addMarker(result.geometry.location, 'green');
                }
            });
        }
    });
}

function displayRoute(destination) {
    const request = {
        origin: selectedMarker.getPosition(),
        destination,
        travelMode: google.maps.TravelMode.WALKING // Default to walking
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        }
    });
}

function resetSelection() {
    location.reload();
}
