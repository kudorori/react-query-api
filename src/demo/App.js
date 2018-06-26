import React from 'react';
import { Query, Filter, Map, Slice, Table } from "../lib";

const columns = [{
  title: "id",
  render: ({ data }) => data.id
}, {
  title: "Name",
  render: ({ data }) => data.name
}, {
  title: "Actions",
  render: () => (
    <button>Btn1</button>
  )
}]


export default class App extends React.Component {
  state = {
    searchText: ""
  }
  renderSearch = () => {
    return <input type="text" value={this.state.searchText} onChange={({ target: { value } }) => this.setState(state => ({ searchText: value }))}></input>
  }
  render() {
    return (
      <div>
        {this.state.searchText}
        <Table
          columns={columns}
          query={{
            endPoint: "http://5b31e5237ad3350014b434a2.mockapi.io/api/user",
            params: {}
          }}
          searchText={this.state.searchText}
          Search={this.renderSearch}>
        ></Table>
      </div>
    )
  }
};
