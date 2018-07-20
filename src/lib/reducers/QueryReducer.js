import { assocPath, pipe } from "ramda";
import { createActions, handleActions } from "redux-actions";
import QueryActions from "../actions/QueryActions";


export default handleActions({
  [QueryActions.setData]: (state, { payload: { id, data }}) => pipe(
    assocPath([id, "data"], data)
  )(state),
  [QueryActions.onSuccess]: (state, { payload: { id, payload }}) => pipe(
    assocPath([id, "response"], payload),
    assocPath([id, "data"], payload.data),
    assocPath([id, "isRefresh"], false)
  )(state),
  [QueryActions.onInitial]: (state, { payload: { id, options }}) => pipe(
    assocPath([id, "data"], {}),
    assocPath([id, "response"], {}),
    assocPath([id, "error"], {}),
    assocPath([id, "isRefresh"], false)
  )(state),
  [QueryActions.refresh]: (state, { payload: { id }}) => pipe(
    assocPath([id, "isRefresh"], true)
  )(state),
  [QueryActions.onError]: ( state, { payload: { id, error }}) => pipe(
    assocPath([id, "error"], error),
    assocPath([id, "data"], {}),
    assocPath([id, "response"], {})
  )(state)
}, {})
