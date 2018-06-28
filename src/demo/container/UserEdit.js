import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Query, Table, Editable } from "../../lib";


class UserEdit extends React.Component {
  columns = [{
    title: "id",
    render: ({ data }) => data.id,
  }, {
    title: "name",
    render: ({ data }) => data.name
  }]


  fields = {
    name: ({ value , setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
    id: ({ value, setValue }) => <input type="text" value={value} ></input>,
    list: ({ value, setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
    listObj: {
      name: ({ value, setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
    },
    obj: {
      name: ({ value, setValue }) => <input type="text" value={value} onChange={({ target: { value }}) => setValue(value)}></input>,
    }
  }

  render() {
    const { edit, query, ...props } = this.props;
    return (
      <div>
        <Query {...edit} {...props}>
          {({ data }) => (
            <Editable data={data} fields={this.fields} onChange={props.setData}>
              {({
                name,
                id,
                list,
                listObj,
                obj
              }) => {
                return (
                  <div>
                    {name}
                    <div>List</div>
                    {list.map((listItem, idx) => (
                      <div key={idx}>
                        {listItem}
                      </div>
                    ))}
                    <div>ListObj</div>
                    {listObj.map((listObjItem, idx) => (
                      <div key={idx}>
                        {listObjItem.name}
                      </div>
                    ))}
                    <div>Obj</div>
                    {obj.name}
                  </div>

                )
              }}
            </Editable>
          )}
        </Query>
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
