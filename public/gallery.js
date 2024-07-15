const API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:8WqDlSfR/midjourney_sref_explorer_all';

document.addEventListener('DOMContentLoaded', fetchAllSrefs);

async function fetchAllSrefs() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displaySrefs(data);
    } catch (error) {
        console.error('Error fetching SREFs:', error);
        showToast('Error fetching SREFs. Please try again later.', true);
    }
}

function displaySrefs(srefs) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    srefs.forEach(sref => {
        const srefItem = document.createElement('div');
        srefItem.className = 'sref-item';

        const imagesHtml = `
            <div class="sref-images">
                ${[1, 2, 3, 4].map(i => `
                    <img src="${sref[`Image_${i}`]}" alt="SREF Image ${i}">
                `).join('')}
            </div>
        `;

        const srefCode = `<div class="sref-code">--sref ${sref.SREF_Code}</div>`;
        const copyButton = `<button class="copy-sref" data-sref="${sref.SREF_Code}">COPY SREF CODE</button>`;

        srefItem.innerHTML = imagesHtml + srefCode + copyButton;
        gallery.appendChild(srefItem);
    });

    // Add event listeners to copy buttons
    document.querySelectorAll('.copy-sref').forEach(button => {
        button.addEventListener('click', copySrefCode);
    });
}

function copySrefCode(event) {
    const srefCode = `--sref ${event.target.dataset.sref}`;
    navigator.clipboard.writeText(srefCode)
        .then(() => showToast('SREF Code copied to clipboard!'))
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

    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 5000);
}
