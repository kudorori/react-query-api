import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import Example from "./Example";
import Queries from "../../lib/reducers/QueryReducer"

const composeEnhancers = composeWithDevTools({});

const reducers = combineReducers({
  Example,
  Queries
})

const store = createStore(reducers, {}, composeEnhancers());

export default store;
