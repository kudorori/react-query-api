import { assocPath, pipe } from "ramda";
import { createActions, handleActions } from "redux-actions";
import QueryActions from "../actions/QueryActions";


export default handleActions({
  [QueryActions.onSuccess]: (state, { payload: { id, payload }}) => pipe(
    assocPath([id, "response"], payload),
    assocPath([id, "data"], payload.data)
  )(state),
  [QueryActions.onInitial]: (state, { payload: { id, options }}) => pipe(
    assocPath([id, "options"], options)
  )(state),
  [QueryActions.refresh]: (state, { payload: { id }}) => assocPath([id, "options", "params", "unix"], new Date().getTime(), state)
}, {})
