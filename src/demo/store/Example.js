import R from "ramda";
import { createActions, handleActions } from "redux-actions";
import { RQActions, generateReducer } from "../../lib";

const acts = createActions({
  EXAMPLE: {

  }
})

const ExampleActions = acts.example;

export default handleActions({

}, {
  
})

export {
  ExampleActions
}
