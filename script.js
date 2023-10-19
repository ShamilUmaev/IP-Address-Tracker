const headerTop = document.querySelector('.header-top');
const form = document.querySelector('form');
const input = document.querySelector("input[type='text']");
const errorMsg = document.querySelector('.form p');
const submitBtn = document.querySelector('.submit-btn')

const getData = async (ipAddress) => {
    const API_KEY = 'at_f2YdihbI5TxaDvzq5oylh2F4lUl8l';
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`);
    const data = await response.json();
    console.log(data);
    return data;
}

const regexCheck = (input) => {
    const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipAddressRegex.test(input);
}

const isInputValid = (errMsg) => {
    input.style.outline = "1.5px solid red"
    input.style.color = "red"
    submitBtn.style.outline = "1.5px solid red"
    errorMsg.textContent = errMsg;
}

const onFocus = () => {
    input.style.outline = "none";
    input.style.color = "hsl(0, 0%, 17%)";
    submitBtn.style.outline = "none";
    errorMsg.textContent = "";
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
    if(input.value === '') {
        isInputValid('The input field is empty');
        return;
    } else if (!regexCheck(input.value)) {
        isInputValid('The IP address is not valid');
        return;
    } else {
        onFocus();
        displayData();
        updateMarker();
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
input.addEventListener('focus', onFocus);
window.addEventListener('DOMContentLoaded', loadMapAndData);
