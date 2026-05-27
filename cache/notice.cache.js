const cache = require('./nodeCache');

const KEYS = {
  NOTICES_LIST: 'notices_list',
};

const getNoticesCache = () => {
  return cache.get(KEYS.NOTICES_LIST);
};

const setNoticesCache = (data) => {
  cache.set(KEYS.NOTICES_LIST, data);
};

const clearNoticesCache = () => {
  cache.del(KEYS.NOTICES_LIST);
};

module.exports = {
  getNoticesCache,
  setNoticesCache,
  clearNoticesCache,
};
