import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Query, Table } from "../../lib";


class UserList extends React.Component {
  columns = [{
    title: "id",
    render: "id",
  }, {
    title: "name",
    render: ({ data }) => data.name
  }]

  render() {
    const { query, ...props } = this.props;
    return (
      <Query
        {...query}
        {...props}
      >
        {({ data }) => (
          <Table
            data={data}
            columns={this.columns}
          ></Table>
        )}
      </Query>
    )
  }
}


export default connect(
  state => state.Example,
  dispatch => bindActionCreators(ExampleActions.query, dispatch),
  (state, dispatch) => ({
    ...state,
    ...dispatch
  })
)(UserList)
