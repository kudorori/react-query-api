import React from "react";
import axios from "axios";
import PT from "prop-types";

export default class Query extends React.PureComponent {
  static propTypes = {
    endPoint: PT.string.isRequired,
    params: PT.object,
    children: PT.func.isRequired,
    //Async Void: Response Failed後觸發
    onSuccess: PT.func,
    //Async Void: Response Failed後觸發
    onFailed: PT.func,
    //Async Void: 在收到Response之後觸發 (如onFailed則不會觸發到)，可用來阻擋onSuccess的觸發(throw)
    onResponse: PT.func,
    //Async Response: 在發送請求之前觸發，可用來覆寫原生API的請求
    onRequest: PT.func,
    //外部注入Response變為可控組件
    response: PT.any,
    error: PT.any,
    isFailed: PT.bool,
    isLoading: PT.bool,
    renderLoading: PT.func,
    renderError: PT.func
  }

  static defaultProps = {
    params: {},
    renderLoading: (isLoading) => <div style={{display: isLoading ? "block" : "none"}}>Loading...</div>,
    renderError: (err) => <div>Response Error</div>
  }
  state = {
    response: {},
    params: {},
    error: {},
    isLoading: false,
  }
  componentDidUpdate(prevProps) {
    if(this.props.endPoint !== prevProps.endPoint || this.props.params !== prevProps.params) {
      const { endPoint, params } = this.props;
      const onRequest = this.onRequest || this.props.onRequest();
      onRequest(endPoint, params)
    }
  }

  componentDidMount() {
    const { endPoint, params } = this.props;
    const onRequest = this.onRequest || this.props.onRequest();
    onRequest(endPoint, params)
  }

  onRequest = async (endPoint, params) => {
    const onResponse = this.props.onResponse || this.onResponse;
    const onSuccess = this.props.onSuccess || this.onSuccess;
    const onFailed = this.props.onFailed || this.onFailed;
    await this.setState(state => ({
      ...state,
      isLoading: true
    }))
    try {
      const res = await axios({
        url: endPoint,
        params
      });
      onResponse(res);
      onSuccess(res);
    } catch ( err ) {
      onFailed(err);
    }
    await this.setState(state => ({
      ...state,
      isLoading: false
    }))
  }

  onResponse = res => {

  }

  onSuccess = res => {
    const { endPoint, params } = this.props;
    this.setState(state => ({
      ...state,
      response: res,
      params,
      isFailed: false,
    }))
  }
  onFailed = err => {
    const { endPoint, params } = this.props;
    this.setState(state => ({
      ...state,
      params,
      error: err,
      isFailed: true,
    }))
  }

  render() {
    const { children, renderLoading, renderError } = this.props;
    const isLoading = this.props.isLoading || this.state.isLoading;
    const isFailed = this.props.isFailed || this.state.isFailed;
    const response = this.props.response || this.state.response;
    const error = this.props.error || this.state.error;
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return (
        <div>
          { isFailed ? renderError(error) : children(response)}
          { renderLoading(isLoading) }
        </div>
      )
    }

  }
}
