const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'A rating must belong to a movie']
  },
  value: {
    type: Number,
    required: [true, 'A rating must have a value'],
    min: [1, 'Rating must be above 1.0'],
    max: [10, 'Rating must be below 10.0']
  },
  review: {
    type: String,
    trim: true,
    maxlength: [500, 'Review must be less or equal than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ratingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'movie',
    select: 'title releaseYear'
  });
  next();
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating;