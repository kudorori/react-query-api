import { identity } from "ramda";
import { createActions } from "redux-actions"

const actions = createActions({
  QUERY: {
    SET_RESPONSE: (id, response) => ({ id, response }),
    SET_DATA: ( id, data) => ({ id, data }),
    SET_OPTIONS: (id, options ) => ({ id, options }),
    SET_ERROR: (id, error ) => ({ id, error }),
    REFRESH: (id, unix) => ({ id }),
    ON_SUCCESS: (id, payload) => ({
      id,
      payload
    }),
    ON_FAILED: (id, payload) => ({
      id,
      payload
    }),
    ON_INITIAL: (id, options) => ({
      id,
      options
    })
  }
});

export default actions.query
