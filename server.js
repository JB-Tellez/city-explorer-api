require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/weather', handleWeather);
app.get('/movies', handleMovies);
app.use('*', (request, response) => response.status(404).send('page not found'));

async function handleWeather(request, response) {
  let { searchQuery, lat, lon } = request.query;

  try {
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
    const weatherResponse = await axios.get(url);
    const weatherArray = weatherResponse.data.data.map(day => new Forecast(day));
    response.status(200).send(weatherArray);
  } catch (error) {
    errorHandler(error, response);
  }
}

async function handleMovies(request, response) {

  const location = request.query.location;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&langeuage=en-US&page=1&query=${location}`;
  const movieResponse = await axios.get(url);

  response.json(movieResponse.data.results.map(movie => new Movie(movie)));
}

function Forecast(day) {
  this.date = day.valid_date;
  this.description = day.weather.description;
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movie.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

function errorHandler(error, response) {
  console.log(error);
  response.status(500).send('something went wrong');
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
