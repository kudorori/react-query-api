import React from "react";
import PT from "prop-types";
import objectHash from 'object-hash'

export default class Map extends React.PureComponent {
  static propTypes = {
    data: PT.arrayOf(PT.any),
    functor: PT.func,
    children: PT.func.isRequired
  }

  static defaultProps = {
    functor: item => item,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const hash = objectHash(nextProps.data)
    if( hash === prevState.hash) {
      return null;
    }

    return {
      data: nextProps.data,
      compileData: nextProps.data.map(nextProps.functor),
      hash: hash
    }
  }
  state = {
    data: [],
    compileData: []
  }

  render() {
    const { children } = this.props;
    console.log('map render')
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return children({
        data: this.state.compileData
      })
    }
  }
}
