import React from "react";
import PT from "prop-types";
import { assoc, equals, pipe, assocPath, pathOr, mergeAll, mergeWith, merge } from "ramda";
import axios from "axios";

export default (_id, _props) => NestedComponent => {
  return class withQuery extends React.Component {
    static propTypes = {
      options: PT.any,
      disabled: PT.bool,
      refresh: PT.bool
    }


    state = {
      isLoading: false
    }

    onRequest = async (options) => {
      await this.setState(assoc("isLoading", true))

      try {
        if(this.props[_id] !== undefined && this.props[_id].onRequest !== undefined ) {
          await this.props[_id].onRequest(options);
        } else {

          const res = await axios(options);
          this.onResponse(res);
          this.onSuccess(res);
        }

      } catch ( err ) {
        this.onError(err);
      }
      await this.setState(assoc("isLoading", false))
    }

    onInitial = (options) => {
      if(this.props[_id] !== undefined && this.props[_id].onInitial !== undefined) {
        this.props[_id].onInitial(options)
      } else {
        this.setState(pipe(
          assoc("data", {}),
          assoc("response", {}),
          assoc("error", {}),
        ))
      }
    }

    onSuccess = (res) => {
      if(this.props[_id] !== undefined && this.props[_id].onSuccess !== undefined) {
        this.props[_id].onSuccess(res);
      } else {
        this.setState(pipe(
          assoc("response", res),
          assoc("data", res.data),
          assoc("error", {})
        ))
      }
    }

    onError = (err) => {
      if(this.props[_id] !== undefined && this.props[_id].onError !== undefined) {
        this.props[_id].onError(err);
      } else {
        this.setState(pipe(
          assoc("error", err),
          assoc("data", {}),
          assoc("response", {})
        ))
      }
    }

    onResponse = (res) => {

    }

    getProps = (props) => {
      if( typeof(_props) === "function") {
        return _props(props)
      }
      return _props
    }

    getIsRefresh = props => pathOr(false, [_id, "isRefresh"], props);

    componentDidUpdate(prevProps, prevState) {

      if(!equals(prevProps, this.props)) {
        const oldProps = this.getProps(prevProps);
        const nextProps = this.getProps(this.props);
        const isGetData = ! nextProps.disabled && !equals(oldProps.options, nextProps.options);
        const isRefresh = this.getIsRefresh(this.props) && (this.getIsRefresh(prevProps) !== this.getIsRefresh(this.props))
        if( isGetData || isRefresh ) {
          this.onRequest(nextProps.options)
        }

        if( nextProps.disabled && !oldProps.disabled) {
          this.onInitial();
        }
      }
    }

    componentDidMount() {
      const props = this.getProps(this.props);
      if(!props.disabled) {
        this.onRequest(props.options);
      }
    }

    refresh = () => {
      if(this.props[_id] !== undefined && this.props[_id].refresh !== undefined) {
        this.props[_id].refresh("");
      } else {
        const props = this.getProps(this.props);
        this.onRequest(props.options);
      }
    }

    render() {
      const passProps = mergeWith(merge, this.props, {
        [_id]: {
          ...this.state,
          refresh: this.refresh
        },
      })
      return (
        <NestedComponent {...passProps} ></NestedComponent>
      )
    }
  }
}
