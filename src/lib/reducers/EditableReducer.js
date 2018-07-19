import { assocPath, evolve, pipe } from "ramda";

export default (path, actions) => {
  return {
    [actions.onChange]: (state, { payload }) => assocPath([...path, "data"], payload, state)
  }
}
