const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';

document.addEventListener('DOMContentLoaded', () => {
    fetchFavorites();
});

function fetchFavorites() {
    showLoading();
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length === 0) {
        document.getElementById('favorites-list').innerHTML = 'No favorites added';
        return;
    }

    Promise.all(favorites.map(id => fetch(`${API_URL}?vs_currency=usd&ids=${id}`)
        .then(response => response.json())))
        .then(data => {
            const coins = data.flat();
            displayFavorites(coins);
        })
        .catch(error => console.error('Error fetching favorite coins:', error));
}

function displayFavorites(coins) {
    const list = document.getElementById('favorites-list');
    list.innerHTML = coins.map(coin => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${coin.name} (${coin.symbol.toUpperCase()})</h5>
                <p class="card-text">Price: $${coin.current_price}</p>
                <p class="card-text">Volume: $${coin.total_volume}</p>
                <a href="coin.html?id=${coin.id}" class="btn btn-link">Details</a>
            </div>
        </div>
    `).join('');
}

function showLoading() {
    const list = document.getElementById('favorites-list');
    list.innerHTML = '<div class="loading"></div>';
}
