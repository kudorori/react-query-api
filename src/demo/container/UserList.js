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

  state = {
    selected: []
  }

  render() {
    const { query, ...props } = this.props;
    console.log(this.state.selected);
    return (
      <Query
        {...query}
        {...props}
      >
        {({ data }) => (
          <Table
            data={data}
            columns={this.columns}
            autoNum
            multi
            selected={this.state.selected}
            onItemSelected={({ data }) => this.setState({ selected: data })}
            Pagination={(props) => {
              console.log(props)
              return (
                <div>Pagi</div>
              )
            }}
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
