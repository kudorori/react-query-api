import React from "react";
import PT from "prop-types";

export default class Filter extends React.Component {
  static propTypes = {
    data: PT.arrayOf(PT.any),
    startOf: PT.number,
    limit: PT.number,
    children: PT.func.isRequired
  }

  static defaultProps = {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { startOf, limit } = nextProps;
    return {
      data: nextProps.data,
      compileData: nextProps.data.slice(startOf, limit)
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
        data: this.state.compileData,
      })
    }
  }
}
