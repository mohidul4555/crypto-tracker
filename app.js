const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
let coins = [];
let filteredCoins = [];
let currentPage = 1;
let perPage = 10;
let totalCoins = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetchCoins();
    document.getElementById('search-input').addEventListener('input', debounce(searchCoins, 300));
});

function fetchCoins(page = 1) {
    showLoading();
    fetch(`${API_URL}?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}`)
        .then(response => response.json())
        .then(data => {
            coins = data;
            totalCoins = data.length;
            displayCoins(coins);
            setupPagination();
        })
        .catch(error => console.error('Error fetching coins:', error));
}

function displayCoins(coins) {
    const list = document.getElementById('crypto-list');
    list.innerHTML = coins.map(coin => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${coin.name} (${coin.symbol.toUpperCase()})</h5>
                <p class="card-text">Price: $${coin.current_price}</p>
                <p class="card-text">Volume: $${coin.total_volume}</p>
                <button class="btn btn-primary" onclick="addToFavorites('${coin.id}')">Add to Favorites</button>
                <a href="coin.html?id=${coin.id}" class="btn btn-link">Details</a>
            </div>
        </div>
    `).join('');
}

function showLoading() {
    const list = document.getElementById('crypto-list');
    list.innerHTML = '<div class="loading"></div>';
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function searchCoins() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(query));
    displayCoins(filteredCoins);
}

function addToFavorites(coinId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(coinId)) {
        favorites.push(coinId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Added to favorites');
    } else {
        alert('Already in favorites');
    }
    console.log('Favorites:', favorites); // Debug statement
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    for (let i = 1; i <= Math.ceil(totalCoins / perPage); i++) {
        pagination.innerHTML += `<button class="btn btn-secondary" onclick="fetchCoins(${i})">${i}</button>`;
    }
}
