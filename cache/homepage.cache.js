const cache = require('./nodeCache');

const KEYS = {
  HOMEPAGE_DATA: 'homepage_data',
};

const getHomepageCache = () => {
  return cache.get(KEYS.HOMEPAGE_DATA);
};

const setHomepageCache = (data) => {
  cache.set(KEYS.HOMEPAGE_DATA, data);
};

const clearHomepageCache = () => {
  cache.del(KEYS.HOMEPAGE_DATA);
};

module.exports = {
  getHomepageCache,
  setHomepageCache,
  clearHomepageCache,
};
