document.addEventListener('DOMContentLoaded', fetchAllSrefs);

async function fetchAllSrefs() {
    try {
        const response = await fetch('/api/all-srefs');
        const data = await response.json();
        displaySrefs(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displaySrefs(srefs) {
    const grid = document.getElementById('sref-grid');
    srefs.forEach(sref => {
        const srefElement = createSrefElement(sref);
        grid.appendChild(srefElement);
    });
}

function createSrefElement(sref) {
    const element = document.createElement('div');
    element.className = 'sref-item';
    element.innerHTML = `
        <div class="image-grid">
            ${[1, 2, 3, 4].map(i => `<img src="${sref['Image_' + i]}" alt="SREF Image ${i}">`).join('')}
        </div>
        <p class="sref-code">--sref ${sref.SREF_Code}</p>
        <button onclick="copySrefCode('${sref.SREF_Code}')">Copy SREF Code</button>
    `;
    return element;
}

function copySrefCode(code) {
    navigator.clipboard.writeText(`--sref ${code}`)
        .then(() => alert('SREF code copied!'))
        .catch(err => console.error('Error copying code:', err));
}
