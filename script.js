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

getData('8.8.8.8');
