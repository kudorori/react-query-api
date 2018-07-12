import React from "react";
import PT from "prop-types";

export default class Filter extends React.Component {
  static propTypes = {
    data: PT.arrayOf(PT.any),
    functor: PT.func,
    children: PT.func.isRequired
  }

  static defaultProps = {
    functor: item => true,
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    


    return {
      data: nextProps.data,
      compileData: nextProps.data.filter(nextProps.functor)
    }
  }
  state = {
    data: [],
    compileData: []
  }

  render() {
    const { children } = this.props;
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return children({
        data: this.state.compileData
      })
    }
  }
}
