const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:8WqDlSfR/midjourney_sref_explorer';
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

function findUniqueSref(data) {
    for (let sref of data) {
        if (!recentSREFs.has(sref.SREF_Code)) {
            addToRecentSREFs(sref.SREF_Code);
            return sref;
        }
    }
    return null; // All SREFs in data have been shown recently
}

function addToRecentSREFs(srefCode) {
    recentSREFs.add(srefCode);
    if (recentSREFs.size > MAX_RECENT_SREFS) {
        const oldestSref = recentSREFs.values().next().value;
        recentSREFs.delete(oldestSref);
    }
}

function displaySref(srefData) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.classList.add('fade-out');
    
    setTimeout(() => {
        document.getElementById('srefCode').textContent = `--SREF ${srefData.SREF_Code}`;
        displayImages(srefData);
        imageGrid.classList.remove('fade-out');
        imageGrid.classList.add('fade-in');
    }, 500);
}

function displayImages(srefData) {
    const imageGrid = document.getElementById('imageGrid');
    imageGrid.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        const imageUrl = srefData[`Image_${i}`];
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `SREF Image ${i}`;
            imageGrid.appendChild(img);
        }
    }
}

function updateButtonState() {
    const exploreButton = document.getElementById('exploreAgain');
    const now = Date.now();
    const timeElapsed = now - lastFetchTime;
    
    if (timeElapsed < COOLDOWN_PERIOD) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - timeElapsed) / 1000);
        exploreButton.textContent = `Wait (${remainingTime}s)`;
        exploreButton.disabled = true;
        setTimeout(updateButtonState, 1000);
    } else {
        exploreButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
                <path fill="currentColor" d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596l53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971zM12 176h84l52.781 56.551l53.333-57.143l-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12m372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176z"/>
            </svg>
            EXPLORE AGAIN
        `;
        exploreButton.disabled = false;
    }
}

function setLoading(loading) {
    isLoading = loading;
    const exploreButton = document.getElementById('exploreAgain');
    if (loading) {
        exploreButton.disabled = true;
        exploreButton.textContent = 'Loading...';
    } else {
        updateButtonState();
    }
}

function copySrefCode() {
    const srefCode = document.getElementById('srefCode').textContent;
    navigator.clipboard.writeText(srefCode)
        .then(() => {
            showToast('SREF Code copied to clipboard!');
        })
        .catch(err => {
            console.error('Error copying text:', err);
            showToast('Failed to copy SREF Code', true);
        });
}

function showToast(message, isError = false) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (isError) {
        toast.style.backgroundColor = 'red';
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 5000);
}