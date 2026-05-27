const cache = require('./nodeCache');

const KEYS = {
  EVENTS_LIST: 'events_list',
};

const getEventsCache = () => {
  return cache.get(KEYS.EVENTS_LIST);
};

const setEventsCache = (data) => {
  cache.set(KEYS.EVENTS_LIST, data);
};

const clearEventsCache = () => {
  cache.del(KEYS.EVENTS_LIST);
};

module.exports = {
  getEventsCache,
  setEventsCache,
  clearEventsCache,
};
