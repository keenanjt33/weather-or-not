const express = require('express');
const fetch = require('node-fetch');

const { FORECASTS_DATA } = require('./example-data');

const app = express();
const port = 3000;

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/forecast', (req, res) => {
  // ---- begin stub ----
  // return res.send(JSON.stringify(FORECASTS_DATA));
  // ---- end stub ----

  fetch(
    `https://dataservice.accuweather.com/locations/v1/search?q=${req.query.q}&apikey=${process.env.WEATHER_KEY}`
  )
    .then((locationsRes) => locationsRes.json())
    .then((locations) => locations[0].Key)
    .then((locationKey) =>
      fetch(
        `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}.json?apikey=${process.env.WEATHER_KEY}`
      )
    )
    .then((forecastsRes) => forecastsRes.json())
    .then((forecast) => res.send(JSON.stringify(forecast)));
});

app.listen(port, () => {
  console.log(`weather-or-not listening at http://localhost:${port}`);
});
