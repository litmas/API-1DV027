const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An actor must have a name'],
    trim: true,
    maxlength: [100, 'An actor name must have less or equal than 100 characters']
  },
  moviesPlayed: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Movie'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

actorSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'moviesPlayed',
    select: 'title releaseYear'
  });
  next();
});

const Actor = mongoose.model('Actor', actorSchema);
module.exports = Actor;