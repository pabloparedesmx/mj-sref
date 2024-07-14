document.addEventListener('DOMContentLoaded', function() {
    fetchAINews();
});

function fetchAINews() {
    const apiKey = 'c2bd4fbaea7143f29298df73a2054c98';
    const url = `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&apiKey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                const newsItems = data.articles.slice(0, 5);
                displayNews(newsItems);
            } else {
                throw new Error('No articles found in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            document.getElementById('news-container').innerHTML = `Error fetching news: ${error.message}. Please try again later.`;
        });
}

function displayNews(newsItems) {
    const container = document.getElementById('news-container');
    container.innerHTML = ''; // Clear any existing content
    newsItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
        container.appendChild(div);
    });
}

console.log('Popup script started');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    fetchAINews();
});

function fetchAINews() {
    console.log('Fetching AI news...');
    const apiKey = 'c2bd4fbaea7143f29298df73a2054c98';
    const url = `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&apiKey=${apiKey}`;

    console.log('Fetching from URL:', url);

    fetch(url)
        .then(response => {
            console.log('Response received:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            if (data.articles && data.articles.length > 0) {
                const newsItems = data.articles.slice(0, 5);
                displayNews(newsItems);
            } else {
                throw new Error('No articles found in the response');
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            document.getElementById('news-container').innerHTML = `Error fetching news: ${error.message}. Please try again later.`;
        });
}

function displayNews(newsItems) {
    console.log('Displaying news items:', newsItems);
    const container = document.getElementById('news-container');
    container.innerHTML = ''; // Clear any existing content
    newsItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
        container.appendChild(div);
    });
    console.log('News display completed');
}