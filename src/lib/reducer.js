import { assocPath, evolve, pipe } from "ramda";
export const defaultInitital =  {
  response: {},
  params: {},
  endPoint: {},
  isLoading: false,
  isFailed: false,
  error: {}
}

/**
 * [generateReducer description]
 * @param  {array} path fork obj path
 * @return {[type]}      [description]
 */
export const generateReducer = (path, actions) => {
  return {
    [actions.setParams]: (state, { payload }) => assocPath([...path, "params"], payload, state),
    [actions.setEndPoint]: (state, { payload }) => assocPath([...path, "endPoint"], payload, state),
    [actions.setResponse]: (state, { payload }) => assocPath([...path, "response"], payload, state),
    [actions.setData]: (state, { payload }) => assocPath([...path, "data"], payload, state),
    [actions.setError]: (state, { payload }) => assocPath([...path, "error"], payload, state),
    [actions.setIsFailed]: (state, { payload }) => assocPath([...path, "isFailed"], payload, state),
    [actions.setIsLoading]: (state, { payload }) => assocPath([...path, "isLoading"], payload, state),
    [actions.onSuccess]: (state, { payload }) => pipe(
      assocPath([...path, "response"], payload),
      assocPath([...path, "data"], payload.data),
      assocPath([...path, "isFailed"], false)
    )(state),
    [actions.onFailed]: (state, { payload }) => pipe(
      assocPath([...path, "error"], payload),
      assocPath([...path, "isFailed"], true),
    )(state)
  }
}
