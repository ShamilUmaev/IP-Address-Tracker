const headerTop = document.querySelector('.header-top');
const form = document.querySelector('form');
const input = document.querySelector("input[type='text']");

const getData = async (ipAddress) => {
    const API_KEY = 'at_JoyDSiNRFOX1PORc0djxuFA4rULSk';
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`);
    const data = await response.json();
    console.log(data);
    return data;
}

const regexCheck = (input) => {
    const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipAddressRegex.test(input);
}

const displayData = async () => {
    const data = await getData(input.value);
    const locationInfoCard = document.createElement('div');
    locationInfoCard.classList.add('location-info-card');
    locationInfoCard.innerHTML = `
        <div class="ip-address-ctr">
            <p class="label">Ip Address</p>
            <h4>${data.ip}</h4>
        </div>
        <div class="location-ctr">
            <p class="label">Location</p>
            <h4>${data.location.city}, ${data.location.region}</h4>
        </div>
        <div class="timezone-ctr">
            <p class="label">Timezone</p>
            <h4>UTC ${data.location.timezone}</h4>
        </div>
        <div class="isp-ctr">
            <p class="label">ISP</p>
            <h4>${data.isp}</h4>
        </div>
    `;

    headerTop.appendChild(locationInfoCard);
    input.value = '';
}

const onSubmit = (e) => {
    e.preventDefault();
    if(input.value !== '' && regexCheck(input.value)) {
        displayData();
        updateMarker();
    } else {
        console.log('Error');
    }
}

let map;
let marker;

const initializeMap = async () => {
    const data = await getData(input.value);
    map = L.map('map');
    map.setView([data.location.lat, data.location.lng], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([data.location.lat, data.location.lng]);
    marker.addTo(map);
    // marker.bindPopup(`<h3>${data.location.city}, ${data.location.region}</h3>`)
    // marker.openPopup();   
}

const updateMarker = async () => {
    const data = await getData(input.value);
    if(marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([data.location.lat, data.location.lng]);
    marker.addTo(map);
    // marker.bindPopup(`<h3>${data.location.city}, ${data.location.region}</h3>`)
    // marker.openPopup(); 

    map.setView([data.location.lat, data.location.lng], 8);
}

const loadMapAndData = () => {
    displayData();
    initializeMap();
}

form.addEventListener('submit', onSubmit);
window.addEventListener('DOMContentLoaded', loadMapAndData);
