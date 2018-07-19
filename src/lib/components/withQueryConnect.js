import withQuery from "./withQuery";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import QueryActions from "../actions/QueryActions";
import { curryN, map } from "ramda";

export default (_id, _options) => NestedComponent => {
  const fns = map(fn => curryN(2, fn)(_id), QueryActions);


  return connect(
    state => {
      return state.Queries[_id] || {}
    },
    dispatch => bindActionCreators(fns, dispatch),
    (state, dispatch, props) => ({
      [_id]: {
        ...state,
        ...dispatch
      },
      ...props
    })
  )(withQuery(_id, _options)(NestedComponent))
}
