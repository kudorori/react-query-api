import React from "react";
import axios from "axios";
import PT from "prop-types";

export default class Query extends React.PureComponent {
  static propTypes = {
    endPoint: PT.string.isRequired,
    params: PT.object,
    children: PT.func.isRequired,
    onSuccess: PT.func,
    onFailed: PT.func,
    response: PT.any,
    renderLoading: PT.func
  }

  static defaultProps = {
    params: {},
    onSuccess: () => console.log("API Response Success"),
    onFailed: () => console.log("API Response Failed"),
    renderLoading: () => <div></div>
  }
  state = {
    response: {},
    params: {},
    isLoading: false,
  }
  componentDidUpdate(prevProps) {
    if(this.props.endPoint !== prevProps.endPoint || this.props.params !== prevProps.params) {
      this.initial();
    }
  }

  componentDidMount() {
    this.initial();
  }

  async initial() {
    const { endPoint, params } = this.props;
    await this.setState(state => ({
      ...state,
      isLoading: true
    }))
    try {
      const res = await axios({
        url: endPoint,
        params
      });
      this.props.onSuccess(res);
      this.setState(state => ({
        response: res,
        params
      }))
    } catch ( err ) {
      this.props.onFailed(err.response);
      this.setState(state => ({
        response: err.response,
        params
      }))
    }
    await this.setState(state => ({
      ...state,
      isLoading: false
    }))
  }

  render() {
    const { children } = this.props;
    const { isLoading } = this.state;
    const response = this.props.response || this.state.response;

    if( isLoading ) {
      return this.props.renderLoading();
    }

    if(Object.keys(response).length > 0) {
      if(children !== null && children !== undefined && typeof(children) === "function") {
        return children(response)
      }
    } else {
      return (
        <div></div>
      )
    }

  }
}
