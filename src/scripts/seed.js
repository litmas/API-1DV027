const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const Movie = require('../models/Movie');
const Actor = require('../models/Actor');
const Rating = require('../models/Rating');
const User = require('../models/User');

dotenv.config({ path: `${__dirname}/../../.env` }); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB connection successful!'));

const deleteData = async () => {
  try {
    await Movie.deleteMany();
    await Actor.deleteMany();
    await Rating.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
};

const importData = async () => {
  try {
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test1234',
      passwordConfirm: 'test1234'
    });

    const movies = [
      {
        title: 'Inception',
        releaseYear: 2010,
        genre: 'Sci-Fi',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
      },
      {
        title: 'The Shawshank Redemption',
        releaseYear: 1994,
        genre: 'Drama',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
      },
      {
        title: 'The Dark Knight',
        releaseYear: 2008,
        genre: 'Action',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
      }
    ];

    const createdMovies = await Movie.create(movies);

    const actors = [
      {
        name: 'Leonardo DiCaprio',
        moviesPlayed: [createdMovies[0]._id]
      },
      {
        name: 'Morgan Freeman',
        moviesPlayed: [createdMovies[1]._id]
      },
      {
        name: 'Christian Bale',
        moviesPlayed: [createdMovies[2]._id]
      }
    ];

    const createdActors = await Actor.create(actors);

    const ratings = [
      {
        movie: createdMovies[0]._id,
        value: 9,
        review: 'Mind-blowing concept and execution!'
      },
      {
        movie: createdMovies[1]._id,
        value: 10,
        review: 'The best movie ever made.'
      },
      {
        movie: createdMovies[2]._id,
        value: 9,
        review: 'Heath Ledger\'s Joker is legendary.'
      }
    ];

    await Rating.create(ratings);

    console.log('Data successfully imported!');
  } catch (err) {
    console.log(err);
  }
};

const seedDB = async () => {
  await deleteData();
  await importData();
  process.exit();
};

seedDB();