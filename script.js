const headerTop = document.querySelector('.header-top');
const form = document.querySelector('form');
const input = document.querySelector("input[type='text']");
const submitBtn = document.querySelector('.submit-btn');
const loader = document.querySelector('.loader');
const locationInfoCard = document.createElement('div');
locationInfoCard.classList.add('location-info-card');

const getData = async (ipAddress) => {
    const API_KEY = 'at_56A1zE8Ae6PDFXJ7Upr4DkfmZRhR1';
    const response = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`);
    const data = await response.json();
    return data;
}

const regexCheck = (input) => {
    const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.([25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipAddressRegex.test(input);
}

const isInputValid = (errMsg) => {
    input.style.outline = "1.5px solid red";
    submitBtn.style.outline = "1.5px solid red";
    input.value = "";
    input.placeholder = `${errMsg}`;
    input.classList.add('error-placeholder');
}

const onFocus = () => {
    input.style.outline = "none";
    input.style.color = "hsl(0, 0%, 17%)";
    submitBtn.style.outline = "none";
    input.placeholder = 'Search for any IP address';
    input.classList.remove('error-placeholder');
}

const displayData = async () => {
    const data = await getData(input.value);
    locationInfoCard.innerHTML = `
        <div class="info-card-inner-ctr">
            <div>
                <p class="label">Ip Address</p>
                <h4>${data.ip}</h4>
            </div>
        </div>
        <div class="info-card-inner-ctr">
            <div class="split-line desktop-only mg-right"></div>
            <div>
                <p class="label">Location</p>
                <h4>${data.location.city}, ${data.location.region}</h4>
            </div>
        </div>
        <div class="info-card-inner-ctr">
            <div class="split-line desktop-only mg-right"></div>
            <div>
                <p class="label">Timezone</p>
                <h4>UTC ${data.location.timezone}</h4>
            </div>
        </div>
        <div class="info-card-inner-ctr">
            <div class="split-line desktop-only mg-right"></div>
            <div>
                <p class="label">ISP</p>
                <h4>${data.isp}</h4>
            </div>
        </div>
    `;

    headerTop.appendChild(locationInfoCard);
    input.value = '';
}

const onSubmit = (e) => {
    e.preventDefault();
    if(input.value === '') {
        isInputValid('Please fill in the IP address...');
        return;
    } else if (!regexCheck(input.value)) {
        isInputValid('The IP address is not valid...');
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
    showHideLoader('block');
    const data = await getData(input.value);
    map = L.map('map', { zoomControl: false });
    map.setView([data.location.lat, data.location.lng], 8);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([data.location.lat, data.location.lng]);
    marker.addTo(map);
    showHideLoader('none');
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

    map.flyTo([data.location.lat, data.location.lng], 8, {
        duration: 4
    });
}

const loadMapAndData = () => {
    displayData();
    initializeMap();
}

const showHideLoader = (display) => {
    loader.style.display = display;
}

form.addEventListener('submit', onSubmit);
input.addEventListener('focus', onFocus);
window.addEventListener('DOMContentLoaded', loadMapAndData);
