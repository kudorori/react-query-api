import R from "ramda";
import { createActions, handleActions } from "redux-actions";
import { actions, generateReducer } from "../../lib";

const acts = createActions({
  EXAMPLE: {
    QUERY: {
      ...actions
    }
  }
})

const ExampleActions = acts.example;

const queryReducer = generateReducer(["query"], ExampleActions.query);

export default handleActions({
  ...queryReducer
}, {
  query: {
    endPoint: "http://5b31e5237ad3350014b434a2.mockapi.io/api/user",
    params: {}
  }
})

export {
  ExampleActions
}
