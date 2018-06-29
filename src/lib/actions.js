import { identity } from "ramda";
import axios from "axios";

export default {
  SET_RESPONSE: identity,
  SET_DATA: identity,
  SET_PARAMS: identity,
  SET_IS_FAILED: identity,
  SET_IS_LOADING: identity,
  SET_ERROR: identity,
  SET_END_POINT: identity,
  SET_DISABLED: identity,
  ON_SUCCESS: identity,
  ON_FAILED: identity,
}
