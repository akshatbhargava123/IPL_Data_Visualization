const store = {};

/**
 * Didn't wish to use indexed DB or vuex and let things be simpler
 * so using this store as my global shared store of the app
 */

export default {
  setItem(key, value) {
    store[key] = value;
  },
  getItem(key) {
    return store[key];
  }
};

export const STORE_KEYS = {
  WORKER: 'worker',
  MATCH_DATA_JSON: 'match_data_json',
  BALL_BY_BALL_DATA_JSON: 'ball_by_ball_data_json',
  MATCH_DATA_READY: 'match_data_ready'
};