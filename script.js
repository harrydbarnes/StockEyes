// script.js

// 3a. Define Mock Data
const keyMarketTickers = [
    { name: 'S&P 500', value: '4,500.50', change: '+0.5%' },
    { name: 'Nasdaq', value: '14,000.75', change: '+0.8%' },
    { name: 'Dow Jones', value: '35,000.20', change: '+0.3%' },
];

const mainPlayers = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '175.20', change: '-0.2%', trend: 'down' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: '330.50', change: '+1.1%', trend: 'up' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '2,750.80', change: '+0.7%', trend: 'up' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '3,300.00', change: '-0.5%', trend: 'down' },
];

const hugeRisers = [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: '1,100.00', change: '+8.5%' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '305.00', change: '+6.2%' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: '150.75', change: '+5.8%' },
];

const bigDippers = [
    { symbol: 'PYPL', name: 'PayPal Holdings', price: '180.25', change: '-5.1%' },
    { symbol: 'DIS', name: 'Walt Disney Co', price: '155.60', change: '-4.2%' },
    { symbol: 'BABA', name: 'Alibaba Group', price: '160.90', change: '-6.0%' },
];

const littleDippers = [
    { symbol: 'INTC', name: 'Intel Corp.', price: '52.50', change: '-0.8%', threeMonthPerf: '+5%' },
    { symbol: 'CSCO', name: 'Cisco Systems', price: '58.75', change: '-0.5%', threeMonthPerf: '+3%' },
    { symbol: 'PFE', name: 'Pfizer Inc.', price: '48.90', change: '-0.3%', threeMonthPerf: '+7%' },
];

const allMockStocks = [
    ...mainPlayers,
    ...hugeRisers,
    ...bigDippers,
    ...littleDippers,
    { symbol: 'NFLX', name: 'Netflix Inc.', price: '600.00', change: '+1.0%' },
    { symbol: 'CRM', name: 'Salesforce', price: '250.00', change: '-0.1%' },
    { symbol: 'V', name: 'Visa Inc.', price: '220.00', change: '+0.4%' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: '160.00', change: '+0.9%' },
    { symbol: 'WMT', name: 'Walmart Inc.', price: '140.00', change: '-0.2%' },
];


// 3b. Function to display data
function displayData(sectionId, data) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) {
        console.error(`Section with ID ${sectionId} not found.`);
        return;
    }

    // Clear previous content except for specific elements like search input or headers
    let child = sectionElement.lastElementChild;
    while (child) {
        if (child.tagName !== 'H2' && child.id !== 'watchlist-search' && child.id !== 'watchlist-results' && child.tagName !== 'BUTTON') {
            sectionElement.removeChild(child);
        }
        child = sectionElement.lastElementChild;
        if (child && (child.tagName === 'H2' || child.id === 'watchlist-search' || child.id === 'watchlist-results' || child.tagName === 'BUTTON')) {
            break;
        }
    }

    const dataContainer = sectionId === 'custom-watchlist' ?
        (document.getElementById('watchlist-results') || createWatchlistResultsContainer(sectionElement))
        : sectionElement;

    if (sectionId === 'custom-watchlist' && data.length === 0 && document.getElementById('watchlist-search').value.trim() === '') {
        // Do not display anything if search is empty and no initial data for watchlist
        return;
    }

    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'stock-item stock-ticker'; // Added stock-ticker for styling

        if (sectionId === 'key-market-tickers') { // Special handling for key market tickers
            itemDiv.innerHTML = `<strong>${item.name}:</strong> ${item.value} (${item.change})`;
        } else if (sectionId === 'little-dippers') {
            itemDiv.innerHTML = `<strong>${item.symbol} (${item.name})</strong>: ${item.price} (${item.change}) <small>3M: ${item.threeMonthPerf}</small>`;
        } else if (item.symbol) { // For most stock sections
            itemDiv.innerHTML = `<strong>${item.symbol} (${item.name})</strong>: ${item.price} (${item.change})`;
            if (item.trend) {
                itemDiv.innerHTML += ` <span class="trend-${item.trend}">${item.trend === 'up' ? '▲' : '▼'}</span>`;
            }
        } else { // Fallback for other data structures
            itemDiv.innerHTML = `<strong>${item.name || 'N/A'}</strong>: ${item.value || item.price || 'N/A'}`;
        }
        dataContainer.appendChild(itemDiv);
    });
}

function createWatchlistResultsContainer(watchlistSection) {
    let resultsDiv = document.getElementById('watchlist-results');
    if (!resultsDiv) {
        resultsDiv = document.createElement('div');
        resultsDiv.id = 'watchlist-results';
        watchlistSection.appendChild(resultsDiv);
    }
    return resultsDiv;
}


// 3d. Implement search functionality for "Custom Watchlist"
function setupWatchlistSearch() {
    const searchInput = document.getElementById('watchlist-search');
    const watchlistSection = document.getElementById('custom-watchlist');

    if (!searchInput || !watchlistSection) {
        console.error('Search input or watchlist section not found.');
        return;
    }

    let resultsContainer = document.getElementById('watchlist-results');
    if (!resultsContainer) {
        resultsContainer = createWatchlistResultsContainer(watchlistSection);
    }

    searchInput.addEventListener('keyup', function(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        resultsContainer.innerHTML = ''; // Clear previous results

        if (searchTerm === '') {
            // Optionally, display some initial items or nothing
            // displayData('custom-watchlist', []); // Clears or displays initial if modified
            return;
        }

        const filteredStocks = allMockStocks.filter(stock =>
            stock.symbol.toLowerCase().includes(searchTerm) ||
            stock.name.toLowerCase().includes(searchTerm)
        );
        displayData('custom-watchlist', filteredStocks);
    });
}


// 3e. Placeholder for Refresh Data button functionality
function setupRefreshButton() {
    const refreshButton = document.getElementById('refresh-data-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            console.log('Data refresh clicked');
            // Re-populate data
            populateAllData();
            // Clear search if needed
            const searchInput = document.getElementById('watchlist-search');
            if(searchInput) searchInput.value = '';
            // Ensure watchlist results are cleared if search is cleared
            const watchlistResults = document.getElementById('watchlist-results');
            if (watchlistResults) watchlistResults.innerHTML = '';

        });
    }
}

// Helper function to populate all sections
function populateAllData() {
    displayData('key-market-tickers-content', keyMarketTickers); // Target specific div for key tickers
    displayData('main-players', mainPlayers);
    displayData('huge-risers', hugeRisers);
    displayData('big-dippers', bigDippers);
    displayData('little-dippers', littleDippers);
    // displayData('custom-watchlist', []); // Initially empty or show some default items
}

// Run functions on page load
document.addEventListener('DOMContentLoaded', function() {
    populateAllData();
    setupWatchlistSearch();
    setupRefreshButton();
});
