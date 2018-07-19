import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import Example from "./Example";
import Querys from "../../lib/reducers/QueryReducer"

const composeEnhancers = composeWithDevTools({});

const reducers = combineReducers({
  Example,
  Querys
})

const store = createStore(reducers, {}, composeEnhancers());

export default store;
