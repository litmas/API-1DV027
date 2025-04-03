const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { addHATEOASLinks } = require('../utils/hateoas');

exports.getAllMovies = async (req, res, next) => {
  try {
    // Execute query
    const features = new APIFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    const movies = await features.query;
    const total = await Movie.countDocuments(features.filterQuery);

    // Add HATEOAS links to each movie
    const moviesWithLinks = movies.map(movie => 
      addHATEOASLinks(movie.toObject(), req, 'movie')
    );

    // Pagination metadata
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(total / limit);

    // Construct response with HATEOAS
    const response = {
      status: 'success',
      results: movies.length,
      data: moviesWithLinks,
      links: {
        self: { href: req.originalUrl },
        first: { href: `${req.baseUrl}/movies?page=1&limit=${limit}` },
        prev: page > 1 ? { href: `${req.baseUrl}/movies?page=${page - 1}&limit=${limit}` } : null,
        next: page < totalPages ? { href: `${req.baseUrl}/movies?page=${page + 1}&limit=${limit}` } : null,
        last: { href: `${req.baseUrl}/movies?page=${totalPages}&limit=${limit}` }
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie) {
      return next(new AppError('No movie found with that ID', 404));
    }

    const movieWithLinks = addHATEOASLinks(movie.toObject(), req, 'movie');

    res.status(200).json({
      status: 'success',
      data: {
        movie: movieWithLinks
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);

    const movieWithLinks = addHATEOASLinks(newMovie.toObject(), req, 'movie');

    res.status(201).json({
      status: 'success',
      data: {
        movie: movieWithLinks
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!movie) {
      return next(new AppError('No movie found with that ID', 404));
    }

    const movieWithLinks = addHATEOASLinks(movie.toObject(), req, 'movie');

    res.status(200).json({
      status: 'success',
      data: {
        movie: movieWithLinks
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return next(new AppError('No movie found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getMovieRatings = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(new AppError('No movie found with that ID', 404));
    }

    const ratings = await Rating.find({ movie: req.params.id });

    const ratingsWithLinks = ratings.map(rating => 
      addHATEOASLinks(rating.toObject(), req, 'rating')
    );

    res.status(200).json({
      status: 'success',
      results: ratings.length,
      data: {
        ratings: ratingsWithLinks
      }
    });
  } catch (err) {
    next(err);
  }
};
