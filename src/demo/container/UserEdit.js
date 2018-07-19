import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Query, Table, Editable } from "../../lib";


class UserEdit extends React.Component {
  schema = {
    type: "object",
    required: [
      "name",
      "id"
    ],
    properties: {
      name: { type: "string", minLength: 3, format: "ipv4" },
      id: { type: "string" }
    },
    errorMessage: {
      properties: {
        name: "XXX 需為ipv4格式"
      }
    }
  }
  columns = [{
    title: "id",
    render: ({ data }) => data.id,
  }, {
    title: "name",
    render: ({ data }) => data.name
  }]


  fields = {
    name: ({ value , setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
    id: ({ value, setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
  }

  state = {
    name: "",
    id: ""
  }

  onChange = data => this.setState(data)

  render() {
    const { edit, query, ...props } = this.props;
    return (
      <div>
        <Editable data={this.state} fields={this.fields} onChange={this.onChange}>
          {
            ({
              name,
              id
            }) => {
              return (
                <div>
                  
                  {id}
                  {name}
                  <div>123</div>

                </div>

              )
            }
          }
        </Editable>
      </div>
    )
  }
}


export default connect(
  state => state.Example,
  dispatch => bindActionCreators(ExampleActions.edit, dispatch),
  (state, dispatch) => ({
    ...state,
    ...dispatch
  })
)(UserEdit)
