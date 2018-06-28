import R from "ramda";
import { createActions, handleActions } from "redux-actions";
import { actions, generateReducer } from "../../lib";

const acts = createActions({
  EXAMPLE: {
    QUERY: {
      ...actions
    },
    EDIT: {
      ...actions
    }
  }
})

const ExampleActions = acts.example;

const queryReducer = generateReducer(["query"], ExampleActions.query);
const editReducer = generateReducer(["edit"], ExampleActions.edit);

export default handleActions({
  ...queryReducer,
  ...editReducer
}, {
  query: {
    endPoint: "http://5b31e5237ad3350014b434a2.mockapi.io/api/user",
    params: {}
  },
  edit: {
    endPoint: "http://5b31e5237ad3350014b434a2.mockapi.io/api/user/1",
    params: {}
  }
})

export {
  ExampleActions
}
