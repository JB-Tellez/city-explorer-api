const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');

require('dotenv').config();
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors()); // Enable CORS for all sites

app.get('/weather', (request, response) => {

  const location = weatherData.find(candidate => candidate.city_name === request.query.searchQuery);

  if (location) {
    const forecasts = location.data.map(item => new Forecast(item));
    response.json(forecasts);
  } else {
    response.sendStatus(404);
  }
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
