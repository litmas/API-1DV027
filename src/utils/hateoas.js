exports.addHATEOASLinks = (resource, req, resourceType) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/api/v1`;
    
    const links = {
      self: {
        href: `${baseUrl}/${resourceType}s/${resource.id}`
      }
    };
  
    // Add additional links based on resource type
    switch(resourceType) {
      case 'movie':
        links.ratings = {
          href: `${baseUrl}/movies/${resource.id}/ratings`
        };
        break;
      case 'rating':
        links.movie = {
          href: `${baseUrl}/movies/${resource.movie}`
        };
        break;
      case 'actor':
        links.movies = {
          href: `${baseUrl}/movies?actor=${resource.id}`
        };
        break;
    }
  
    return {
      ...resource,
      links
    };
  };