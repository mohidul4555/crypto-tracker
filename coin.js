const API_URL = 'https://api.coingecko.com/api/v3/coins';
let coinId;

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    coinId = params.get('id');
    if (coinId) {
        fetchCoinDetails(coinId);
        fetchCoinMarketChart(coinId, 1); // Default to 1 day
    }

    document.getElementById('range-1d').addEventListener('click', () => fetchCoinMarketChart(coinId, 1));
    document.getElementById('range-30d').addEventListener('click', () => fetchCoinMarketChart(coinId, 30));
    document.getElementById('range-3m').addEventListener('click', () => fetchCoinMarketChart(coinId, 90));
});

function fetchCoinDetails(id) {
    showLoading();
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(data => displayCoinDetails(data))
        .catch(error => console.error('Error fetching coin details:', error));
}

function displayCoinDetails(coin) {
    const details = document.getElementById('coin-details');
    details.innerHTML = `
        <h2>${coin.name} (${coin.symbol.toUpperCase()})</h2>
        <img src="${coin.image.large}" alt="${coin.name}">
        <p>Rank: ${coin.market_cap_rank}</p>
        <p>Current Price: $${coin.market_data.current_price.usd}</p>
        <p>Market Cap: $${coin.market_data.market_cap.usd}</p>
        <p>${coin.description.en}</p>
    `;
}

function fetchCoinMarketChart(id, days) {
    showLoadingChart();
    fetch(`${API_URL}/${id}/market_chart?vs_currency=usd&days=${days}`)
        .then(response => response.json())
        .then(data => displayCoinMarketChart(data, days))
        .catch(error => console.error('Error fetching coin market chart:', error));
}

function displayCoinMarketChart(data, days) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    const labels = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Price (last ${days} days)`,
                data: prices,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

function showLoading() {
    const details = document.getElementById('coin-details');
    details.innerHTML = '<div class="loading"></div>';
}

function showLoadingChart() {
    const ctx = document.getElementById('price-chart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText('Loading...', ctx.canvas.width / 2, ctx.canvas.height / 2);
}
