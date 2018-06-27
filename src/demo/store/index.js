import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import Example from "./Example";

const composeEnhancers = composeWithDevTools({});

const reducers = combineReducers({
  Example
})

const store = createStore(reducers, {}, composeEnhancers());

export default store;
