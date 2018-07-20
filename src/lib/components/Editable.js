import React from "react";
import PT from "prop-types";
import { map, pipe, assoc, mapObjIndexed, assocPath } from "ramda";

const dataMappingFields = (data, fields, onChange, prefixPath = []) => {
  return mapObjIndexed((item, key) => {

    if(fields[key] === undefined || typeof(fields[key]) !== "function") {
      return ""
    }

    const props = {
      value: item,
      setValue: val => onChange(assoc(key, val, data)),
      data,
      ownProps: {
        onChange
      }
    };
    return fields[key](props)
  })(data)
}


export default class Form extends React.Component {
  static propTypes = {
    data: PT.any,
    fields: PT.arrayOf(PT.any),
    children: PT.func.isRequired,
    onChange: PT.func,
    schema: PT.any
  }

  static defaultProps = {
    fields: [],
    onChange: (data) => console.log("onChange", data)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      fields,
      data,
      onChange
    } = nextProps;

    return {
      fields: dataMappingFields(data, fields, onChange),
    }
  }
  state = {
    components: {}
  }

  render() {
    const { children } = this.props;
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return children(this.state)
    }
  }
}
