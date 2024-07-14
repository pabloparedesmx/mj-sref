const API_URL = '/api/random-sref';
let isLoading = false;
let lastFetchTime = 0;
const COOLDOWN_PERIOD = 4000; // 4 seconds cooldown
const recentSREFs = new Set(); // Store recently shown SREFs
const MAX_RECENT_SREFS = 10; // Maximum number of recent SREFs to remember
let allFetchedSREFs = []; // Store all fetched SREFs

document.addEventListener('DOMContentLoaded', function() {
    fetchRandomSref();
    document.getElementById('exploreAgain').addEventListener('click', handleExploreClick);
    document.getElementById('copySref').addEventListener('click', copySrefCode);
});

function handleExploreClick() {
    const now = Date.now();
    if (!isLoading && (now - lastFetchTime) >= COOLDOWN_PERIOD) {
        fetchRandomSref();
    } else {
        console.log('Please wait before requesting again.');
        updateButtonState();
    }
}

function fetchRandomSref() {
    if (isLoading) return;
    
    setLoading(true);
    lastFetchTime = Date.now();

    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);  // Log the received data
            if (Array.isArray(data) && data.length > 0) {
                allFetchedSREFs = allFetchedSREFs.concat(data);
                const uniqueSref = findUniqueSref(allFetchedSREFs);
                if (uniqueSref) {
                    displaySref(uniqueSref);
                } else {
                    throw new Error('All available SREFs have been shown. Please check back later for new SREFs!');
                }
            } else {
                throw new Error('No SREF data received or data is not in expected format');
            }
        })
        .catch(error => {
            console.error('Error fetching SREF:', error);
            document.getElementById('srefCode').textContent = 'Error fetching SREF. Please try again.';
            showToast(error.message, true);
        })
        .finally(() => {
            setLoading(false);
        });
}

// ... (rest of the functions: findUniqueSref, addToRecentSREFs, displaySref, displayImages, updateButtonState, setLoading, copySrefCode, showToast)