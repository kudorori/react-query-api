import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Query, Table } from "../../lib";
import { times } from "ramda";

class UserList extends React.Component {
  columns = [{
    title: "id",
    render: "id",
  }, {
    title: "name",
    render: ({ data }) => data.name
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
      <Table
        data={data}
        columns={this.columns}
        autoNum
        multi
        selected={this.state.selected}
        onItemSelected={({ data }) => this.setState(state => ({
          ...state,
          selected: data
        }))}
        page={this.state.page}
        searchText={this.state.searchText}
        Pagination={this.renderPagination}
        Search={this.renderSearch}
      ></Table>
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
