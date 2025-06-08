// script.js

// 3a. Define Mock Data
const keyMarketTickers = [
    { name: 'S&P 500', value: '4,500.50', change: '+0.5%' },
    { name: 'Nasdaq', value: '14,000.75', change: '+0.8%' },
    { name: 'Dow Jones', value: '35,000.20', change: '+0.3%' },
];

const mainPlayers = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: '175.20', change: '-0.2%', trend: 'down' }, // trend already has arrow
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

    let dataContainer = sectionElement;
    if (sectionId === 'custom-watchlist') {
        dataContainer = document.getElementById('watchlist-results') || createWatchlistResultsContainer(sectionElement);
    } else if (sectionId === 'key-market-tickers-content') {
        // Special case for header tickers
    } else {
        // Clear previous content for regular sections, leaving H2
        let child = sectionElement.lastElementChild;
        while (child && child.tagName !== 'H2') {
            sectionElement.removeChild(child);
            child = sectionElement.lastElementChild;
        }
    }

    if (sectionId === 'custom-watchlist' && document.getElementById('watchlist-search').value.trim() === '' && data.length === 0) {
         if(dataContainer) dataContainer.innerHTML = '';
        return;
    }

    data.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'stock-item';

        const changeString = item.change || '';
        let changeClass = '';
        let arrowIcon = '';

        if (changeString.startsWith('+')) {
            changeClass = 'stock-positive';
            arrowIcon = '▲ '; // Upward arrow
        } else if (changeString.startsWith('-')) {
            changeClass = 'stock-negative';
            arrowIcon = '▼ '; // Downward arrow
        }
        // For keyMarketTickers, item.trend is not present.
        // For mainPlayers, item.trend is present and already adds an arrow, so we avoid double arrows.
        const trendArrow = item.trend ? `<span class="trend-${item.trend}">${item.trend === 'up' ? '▲' : '▼'}</span>` : '';
        // If item.trend is present, we use its arrow and don't add another one from changeString for mainPlayers.
        // For other sections, arrowIcon will be based on changeString.
        const displayArrow = item.trend ? '' : arrowIcon; // Only show arrowIcon if no trend arrow

        if (sectionId === 'key-market-tickers-content') {
            // For header, keep it simple, arrowIcon will apply from changeString
            itemDiv.innerHTML = `<strong>${item.name}:</strong> <span class="price">${item.value}</span> <span class="change ${changeClass}">${displayArrow}${item.change}</span>`;
        } else {
            itemDiv.innerHTML = `
                <div class="info">
                    <strong>${item.symbol}</strong>
                    <span class="company-name">${item.name}</span>
                </div>
                <div class="data">
                    <span class="price">${item.price}</span>
                    <span class="change ${changeClass}">${displayArrow}${item.change}</span>
                    ${trendArrow} {/* This is for mainPlayers trend indicator, already has arrow */}
                </div>
            `;
            if (sectionId === 'little-dippers' && item.threeMonthPerf) {
                const dataDiv = itemDiv.querySelector('.data');
                if(dataDiv) {
                    const perfSpan = document.createElement('span');
                    perfSpan.className = 'three-month-perf'; // Added class for styling
                    perfSpan.textContent = `3M: ${item.threeMonthPerf}`;
                    dataDiv.appendChild(perfSpan);
                }
            }
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

function setupWatchlistSearch() {
    const searchInput = document.getElementById('watchlist-search');
    if (!searchInput) {
        console.error('Search input not found.');
        return;
    }

    let resultsContainer = document.getElementById('watchlist-results');
    if (!resultsContainer && document.getElementById('custom-watchlist')) {
        resultsContainer = createWatchlistResultsContainer(document.getElementById('custom-watchlist'));
    }

    searchInput.addEventListener('keyup', function(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        if (resultsContainer) resultsContainer.innerHTML = '';

        if (searchTerm === '') {
            return;
        }

        const filteredStocks = allMockStocks.filter(stock =>
            stock.symbol.toLowerCase().includes(searchTerm) ||
            stock.name.toLowerCase().includes(searchTerm)
        );
        displayData('custom-watchlist', filteredStocks);
    });
}

function setupRefreshButton() {
    const refreshButton = document.getElementById('refresh-data-btn');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            console.log('Data refresh clicked');
            populateAllData();
            const searchInput = document.getElementById('watchlist-search');
            if(searchInput) searchInput.value = '';
            const watchlistResults = document.getElementById('watchlist-results');
            if (watchlistResults) watchlistResults.innerHTML = '';
        });
    }
}

function populateAllData() {
    const headerTickerContainer = document.getElementById('key-market-tickers-content');
    if(headerTickerContainer) headerTickerContainer.innerHTML = '';

    displayData('key-market-tickers-content', keyMarketTickers);
    displayData('main-players', mainPlayers);
    displayData('huge-risers', hugeRisers);
    displayData('big-dippers', bigDippers);
    displayData('little-dippers', littleDippers);

    const searchInput = document.getElementById('watchlist-search');
    const watchlistResults = document.getElementById('watchlist-results');
    if (searchInput && searchInput.value === '' && watchlistResults) {
        watchlistResults.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('custom-watchlist')) {
       createWatchlistResultsContainer(document.getElementById('custom-watchlist'));
    }

    populateAllData();
    setupWatchlistSearch();
    setupRefreshButton();

    const stockEvaluatorSection = document.getElementById('stock-evaluator');
    if (stockEvaluatorSection && stockEvaluatorSection.children.length <=1 ) {
        const p = document.createElement('p');
        p.textContent = 'Stock Evaluator functionality coming soon.';
        stockEvaluatorSection.appendChild(p);
    }
});
