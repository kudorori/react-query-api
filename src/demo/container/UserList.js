import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Query, Table } from "../../lib";
import { times } from "ramda";
import QueryConnect from "../../lib/connects/QueryConnect";

class UserList extends React.Component {
  columns = [{
    title: "id",
    render: "id",
  }, {
    title: "name",
    render: ({ data }) => ""
  }]

  state = {
    selected: [],
    value: "",
    page: 1,
    searchText: ""
  }

  static getDerivedStateFromProps() {
    return {
      data: times(idx => ({
        id: idx,
        name: `Name-${idx}`
      }), 90000)
    }
  }

  renderPagination = (props) => {
    return (
      <input type="text" value={this.state.page} onChange={({ target: { value }}) => this.setState(state => ({
        ...state,
        page: value
      }))}></input>
    )
  }
  renderSearch = props => {
    return (
      <input type="text" value={this.state.searchText} onChange={({ target: { value }}) => this.setState(state => ({
        ...state,
        searchText: value
      }))}></input>
    )
  }
  render() {
    const { query, ...props } = this.props;
    const { data } = this.state;

    return (
      <Query {...this.props.getUser}>
        {({ data }) => (
          <div>
            <button onClick={() => this.props.getUser.refresh("getUser")}>Refresh</button>
            <div>{JSON.stringify(data)}</div>

          </div>
        )}
      </Query>
    )
  }
}


export default QueryConnect("getUser", {
  url: "http://5b31e5237ad3350014b434a2.mockapi.io/api/user"
})(UserList)
