const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { FORECASTS_DATA } = require('./example-data');

require('dotenv').config();

const app = express();
const port = 3001;

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30,
});

// sets http headers for security
//   (recommended per: https://expressjs.com/en/advanced/best-practice-security.html)
app.use(helmet());

app.set('trust proxy', 1);
app.use('/api/', apiLimiter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/forecast/ip', async (req, res) => {
  // ---- begin stub ----
  // return res.json(FORECASTS_DATA);
  // ---- end stub ----

  let response = await fetch(
    `https://dataservice.accuweather.com/locations/v1/cities/ipaddress?q=${req.query.ip}&apikey=${process.env.WEATHER_KEY}`
  );
  const location = await response.json();
  if (!location) res.status(500);
  response = await fetch(
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${location.Key}.json?apikey=${process.env.WEATHER_KEY}`
  );
  const forecast = await response.json();
  forecast.Location = location;
  return res.json(forecast);
});

app.get('/api/forecast/text', async (req, res) => {
  // ---- begin stub ----
  // return res.json(FORECASTS_DATA);
  // ---- end stub ----

  let response = await fetch(
    `https://dataservice.accuweather.com/locations/v1/search?q=${req.query.q}&apikey=${process.env.WEATHER_KEY}`
  );
  const locations = await response.json();
  if (locations.length === 0) res.send(500);
  const [location] = locations;
  response = await fetch(
    `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${location.Key}.json?apikey=${process.env.WEATHER_KEY}`
  );
  const forecast = await response.json();
  forecast.Location = location;
  res.json(forecast);
});

app.listen(port, () => {
  console.log(`weather-or-not listening at http://localhost:${port}`);
});
