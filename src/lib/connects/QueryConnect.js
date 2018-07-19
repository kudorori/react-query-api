import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import QueryActions from "../actions/QueryActions";
import { map } from "ramda";

export default (id, defaultOptions) => NestedComponent => {
  console.log(map(fn => fn(id), QueryActions))
  
  return connect(state => ({
    [id]: {
      ...state.Querys[id],
      defaultOptions,
      id,
    }
  }), dispatch => ({
    [id]: bindActionCreators(map(fn => fn(id), QueryActions), dispatch)
  }), (state, dispatch, ownProps) => ({
    [id]: {
      ...state[id],
      ...dispatch[id]
    },
    ...ownProps
  }))(NestedComponent)
}
