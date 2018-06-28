import React from 'react';
import { Query, Filter, Map, Slice, Table } from "../lib";
import store from "./store";
import UserList from "./container/UserList";
import UserEdit from "./container/UserEdit";
import { Provider } from "react-redux";


export default class App extends React.Component {
  renderSearch = () => {
    return <input type="text" value={this.state.searchText} onChange={({ target: { value } }) => this.setState(state => ({ searchText: value }))}></input>
  }
  render() {
    return (
      <div>
        <Provider store={store}>
          <div>
            <UserEdit></UserEdit>
            <UserList></UserList>
          </div>
        </Provider>
      </div>
    )
  }
};
