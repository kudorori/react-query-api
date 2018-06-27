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
        <Query endPoint={"http://5b31e5237ad3350014b434a2.mockapi.io/api/user"}>
          {({ data }) => (
            <Table
              columns={columns}
              data={data}
              searchText={this.state.searchText}
              Search={this.renderSearch}>
            ></Table>
          )}
        </Query>

      </div>
    )
  }
};
