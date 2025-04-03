const Actor = require('../models/Actor');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const { addHATEOASLinks } = require('../utils/hateoas');

exports.getAllActors = async (req, res, next) => {
  try {
    // Execute query
    const features = new APIFeatures(Actor.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    
    const actors = await features.query;
    const total = await Actor.countDocuments(features.filterQuery);

    // Add HATEOAS links to each actor
    const actorsWithLinks = actors.map(actor => 
      addHATEOASLinks(actor.toObject(), req, 'actor')
    );

    // Pagination metadata
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const totalPages = Math.ceil(total / limit);

    // Construct response with HATEOAS
    const response = {
      status: 'success',
      results: actors.length,
      data: actorsWithLinks,
      links: {
        self: { href: req.originalUrl },
        first: { href: `${req.baseUrl}/actors?page=1&limit=${limit}` },
        prev: page > 1 ? { href: `${req.baseUrl}/actors?page=${page - 1}&limit=${limit}` } : null,
        next: page < totalPages ? { href: `${req.baseUrl}/actors?page=${page + 1}&limit=${limit}` } : null,
        last: { href: `${req.baseUrl}/actors?page=${totalPages}&limit=${limit}` }
      }
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};