import { assocPath, pipe } from "ramda";
import { createActions, handleActions } from "redux-actions";
import EditableActions from "../actions/EditableActions";


export default handleActions({
  [EditableActions.onChange]: (state, { payload: { id, payload }}) => pipe(
    assocPath([id, "data"], payload)
  )(state)
}, {})
