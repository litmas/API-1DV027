const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A movie must have a title'],
    trim: true,
    maxlength: [100, 'A movie title must have less or equal than 100 characters']
  },
  releaseYear: {
    type: Number,
    required: [true, 'A movie must have a release year'],
    min: [1888, 'Release year must be after 1888'],
    max: [new Date().getFullYear(), 'Release year cannot be in the future']
  },
  genre: {
    type: String,
    required: [true, 'A movie must have a genre'],
    trim: true,
    enum: {
      values: ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'],
      message: 'Genre is either: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi, Thriller'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description must be less or equal than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;