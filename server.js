const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api', (req, res) => {
  fetch(
    `https://dataservice.accuweather.com/locations/v1/search?q=chicago&apikey=${process.env.WEATHER_KEY}`
  )
    .then((apiRes) => apiRes.json())
    .then((text) => res.send(text));
});

app.listen(port, () => {
  console.log(`weather-or-not listening at http://localhost:${port}`);
});
