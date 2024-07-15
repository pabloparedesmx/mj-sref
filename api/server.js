const express = require('express');
const fetch = require('node-fetch');
const app = express();

const XANO_API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:8WqDlSfR/midjourney_sref_explorer';

app.use(express.json());

app.get('https://x8ki-letl-twmt.n7.xano.io/api:8WqDlSfR/midjourney_sref_explorer', async (req, res) => {
  try {
    const response = await fetch(XANO_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data received from Xano API');
    }
    res.json(data);
  } catch (error) {
    console.error('Error fetching from Xano:', error);
    res.status(500).json({ error: 'An error occurred while fetching the SREF', details: error.message });
  }
});
module.exports = app;
