const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:8WqDlSfR/midjourney_sref_explorer';
let isLoading = false;
let lastFetchTime = 0;
const COOLDOWN_PERIOD = 4000; // 4 seconds cooldown
const recentSREFs = new Set(); // Store recently shown SREFs
let MAX_RECENT_SREFS = 20; // Initial value, will be updated dynamically
let allFetchedSREFs = []; // Store all fetched SREFs
let totalSREFsCount = 0; // Total number of SREFs in the database

document.addEventListener('DOMContentLoaded', function() {
    fetchRandomSref();
    document.getElementById('exploreAgain').addEventListener('click', handleExploreClick);
    document.getElementById('copySref').addEventListener('click', copySrefCode);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateThemeToggleButton('light');
    }
});

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    updateThemeToggleButton(currentTheme);
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

function handleExploreClick() {
    const now = Date.now();
    if (!isLoading && (now - lastFetchTime) >= COOLDOWN_PERIOD) {
        fetchRandomSref();
    } else {
        console.log('Please wait before requesting again.');
        updateButtonState();
    }
}

async function fetchRandomSref() {
    if (isLoading) return;
    
    setLoading(true);
    lastFetchTime = Date.now();

    // Fade out the current content
    const imageGrid = document.getElementById('imageGrid');
    const srefCode = document.getElementById('srefCode');
    imageGrid.classList.add('fade-out');
    srefCode.classList.add('fade-out');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Short delay to ensure fade-out is complete
        await new Promise(resolve => setTimeout(resolve, 300));

        if (Array.isArray(data) && data.length > 0) {
            allFetchedSREFs = allFetchedSREFs.concat(data);
            
            // Update total SREFs count and MAX_RECENT_SREFS
            totalSREFsCount = Math.max(totalSREFsCount, allFetchedSREFs.length);
            updateMaxRecentSREFs();

            const uniqueSref = findUniqueSref(allFetchedSREFs);
            if (uniqueSref) {
                displaySref(uniqueSref);
            } else {
                throw new Error('All available SREFs have been shown. Please check back later for new SREFs!');
            }
        } else {
            throw new Error('No SREF data received or data is not in expected format');
        }
    } catch (error) {
        console.error('Error fetching SREF:', error);
        srefCode.textContent = 'Error fetching SREF. Please try again.';
        showToast(error.message, true);
    } finally {
        // Fade in the new content
        imageGrid.classList.remove('fade-out');
        srefCode.classList.remove('fade-out');
        setLoading(false);
    }
}

function updateMaxRecentSREFs() {
    // Set MAX_RECENT_SREFS to be 90% of total SREFs, with a minimum of 20
    MAX_RECENT_SREFS = Math.max(20, Math.floor(totalSREFsCount * 0.9));
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
    const srefCode = document.getElementById('srefCode');

    // Clear existing images
    imageGrid.innerHTML = '';

    // Add new images
    for (let i = 1; i <= 4; i++) {
        const imageUrl = srefData[`Image_${i}`];
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `SREF Image ${i}`;
            img.classList.add('fade-out'); // Start faded out
            imageGrid.appendChild(img);

            // Trigger reflow to ensure the fade-out class is applied before fading in
            void img.offsetWidth;
            img.classList.remove('fade-out');
        }
    }

    srefCode.textContent = `--SREF ${srefData.SREF_Code}`;
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
    const srefCodeElement = document.getElementById('srefCode');
    const srefText = srefCodeElement.textContent;
    
    // Convert 'SREF' to lowercase, keeping the rest unchanged
    const formattedSref = srefText.replace(/--SREF/i, '--sref');

    navigator.clipboard.writeText(formattedSref)
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
        toast.style.backgroundColor = document.body.classList.contains('light-mode') ? '#ffcccc' : '#660000';
        toast.style.color = document.body.classList.contains('light-mode') ? '#660000' : '#ffcccc';
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // Automatically remove the toast after 5 seconds
    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 5000);
}