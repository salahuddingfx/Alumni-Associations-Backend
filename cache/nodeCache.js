const NodeCache = require('node-cache');

// Standard Cache: Default TTL is 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = cache;
