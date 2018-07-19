import React from "react";
import axios from "axios";
import PT from "prop-types";
import { isEmpty, equals } from "ramda";

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
    renderError: PT.func,
    renderEmpty: PT.func,
    disabled: PT.bool
  }

  static defaultProps = {
    params: {},
    renderLoading: (isLoading) => <div style={{display: isLoading ? "block" : "none"}}>Loading...</div>,
    renderError: (err) => <div>Response Error</div>,
    renderEmpty: () => <div>Empty</div>,
    disabled: false
  }
  state = {
    response: {},
    data: {},
    params: {},
    error: {},
    isLoading: false,
  }
  componentDidUpdate(prevProps) {
    if(!equals(prevProps.options, this.props.options)) {
      const { disabled, id, options } = this.props;
      const onRequest = this.onRequest || this.props.onRequest();
      onRequest(options)
    }
  }

  componentDidMount() {
    const { disabled, options, defaultOptions, id } = this.props;
    console.log(this.props);
    this.props.onInitial(defaultOptions);
  }

  onRequest = async (options) => {
    const onResponse = this.props.onResponse || this.onResponse;
    const onSuccess = this.props.onSuccess || this.onSuccess;
    const onFailed = this.props.onFailed || this.onFailed;
    await this.setState(state => ({
      ...state,
      isLoading: true
    }))

    try {
      const res = await axios(options);
      onResponse(res);
      onSuccess(res);
    } catch ( err ) {
      console.log(err);
      onFailed(err);
    }
    await this.setState(state => ({
      ...state,
      isLoading: false
    }))
  }

  onResponse = (res) => {

  }

  onSuccess = (res) => {
    this.setState(state => ({
      ...state,
      response: res,
      data: res.data,
      isFailed: false,
    }))
  }
  onFailed = (err) => {
    this.setState(state => ({
      ...state,
      isFailed: true,
      error: err
    }))
  }

  render() {
    const { children, renderLoading, renderError, renderEmpty } = this.props;
    const isLoading = this.props.isLoading || this.state.isLoading;
    const isFailed = this.props.isFailed || this.state.isFailed;
    const response = this.props.response || this.state.response;
    const params = this.props.params || this.state.params;
    const data = this.props.data || this.state.data;
    const error = this.props.error || this.state.error;
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return (
        <div>
          { isFailed ? renderError(error) : children({
            data,
            response,
            params
          })}
          { renderLoading(isLoading) }
        </div>
      )
    }

  }
}
