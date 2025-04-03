const Rating = require('../models/Rating');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { addHATEOASLinks } = require('../utils/hateoas');

exports.getAllRatings = async (req, res, next) => {
  try {
    // Execute query
    const features = new APIFeatures(Rating.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    const ratings = await features.query;
    const total = await Rating.countDocuments(features.filterQuery);

    // Add HATEOAS links to each rating
    const ratingsWithLinks = ratings.map(rating => 
      addHATEOASLinks(rating.toObject(), req, 'rating')
    );

    // Pagination metadata
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(total / limit);

    // Construct response with HATEOAS
    const response = {
      status: 'success',
      results: ratings.length,
      data: ratingsWithLinks,
      links: {
        self: { href: req.originalUrl },
        first: { href: `${req.baseUrl}/ratings?page=1&limit=${limit}` },
        prev: page > 1 ? { href: `${req.baseUrl}/ratings?page=${page - 1}&limit=${limit}` } : null,
        next: page < totalPages ? { href: `${req.baseUrl}/ratings?page=${page + 1}&limit=${limit}` } : null,
        last: { href: `${req.baseUrl}/ratings?page=${totalPages}&limit=${limit}` }
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};