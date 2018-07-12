import React from "react";
import PT from "prop-types";
import { map, pipe, assoc, mapObjIndexed, assocPath } from "ramda";

const dataMappingFields = (data, fields, onChange, prefixPath = []) => {
  return mapObjIndexed((item, key) => {
    if(fields[key] == undefined) {
      return ""
    }
    if(Array.isArray(item)) {
      return item.map((subItem, idx) => {
        const p = [...prefixPath, key, idx];
        if(typeof(subItem) == "object") {
          return dataMappingFields(subItem, fields[key], value => {
            onChange(assocPath(p, value, data))
          }, p)
        } else {
          return fields[key]({
            value: subItem,
            setValue: (val) => onChange(assocPath(p, val, data)),
            data,
            prefixPath: p,
            ownProps: {
              onChange
            }
          })
        }
      })
    } else if(item !== null && typeof(item) === "object") {
      const p = [...prefixPath, key];
      return dataMappingFields(data[key], fields, value => onChange(assocPath(p, value, data)), p)
    } else {
      return fields[key]({
        value: item,
        setValue: val => onChange(assoc(key, val, data)),
        data,
        prefixPath,
        ownProps: {
          onChange
        }
      })
    }
  })(data)
}


export default class Form extends React.Component {
  static propTypes = {
    data: PT.any,
    fields: PT.arrayOf(PT.any),
    children: PT.func.isRequired,
    onChange: PT.func
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
      components: dataMappingFields(data, fields, onChange)
    }
  }
  state = {
    components: {}
  }

  render() {
    const { children } = this.props;
    if(children !== null && children !== undefined && typeof(children) === "function") {
      return children(this.state.components)
    }
  }
}
