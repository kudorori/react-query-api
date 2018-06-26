import React from "react";
import PT from "prop-types";

export default class Map extends React.Component {
  static propTypes = {
    data: PT.arrayOf(PT.any),
    functor: PT.func,
    children: PT.func.isRequired
  }

  static defaultProps = {
    functor: item => item,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.data !== prevState.data) {
      return {
        data: nextProps.data,
        compileData: nextProps.data.map(nextProps.functor)
      }
    }

    return null;
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
