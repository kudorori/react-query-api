import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Table } from "../../lib";
import { times, assoc } from "ramda";
import withQuery from "../../lib/components/withQuery";
import withQueryConnect from "../../lib/components/withQueryConnect";


class UserList extends React.PureComponent {
  columns = [{
    title: "id",
    render: 'userName'
  }, {
    title: "no",
    render: ({ data }) => <div style={{ color: 'red'}}>abc {data.no} abc</div>
  }]
  state = {
    selected: [],
    searchText: '',
    sort: 0,
    data: times((idx) => ({
      userName: `${idx} userName`,
      name: `${idx} name`
    }), 40)
  }
  getData = () => this.state.data
  render() {
    const data = this.state.data
    console.log(this.state)
    return (
      <div>
        {/* <div>UserList { this.props.userId}</div>
        <button onClick={() => this.props.getUserList.refresh("")}>refresh</button> */}
        <div>
          Search: <input type="text" value={this.state.searchText} onChange={({ target: { value }}) => this.setState(assoc('searchText', value))}></input>
        </div>
        <div>
          Selected: {JSON.stringify(this.state)}
        </div>
        <Table
          autoNum
          data={data}
          columns={this.columns}
          selected={this.state.selected}
          searchText={this.state.searchText}
          sort={this.state.sort}
          onSortChange={sort => this.setState(assoc('sort', sort))}
          onRowClick={data => this.setState(state => ({
            ...state,
            selected: [...state.selected, data]
          }))}
          ></Table>
        {/* {JSON.stringify(this.state)} */}
      </div>

    )
  }
}

const mockData = data => data;

const a = withQueryConnect("getUserList", props => ({
  options: {
    url: `https://5b31e5237ad3350014b434a2.mockapi.io/api/user/${props.userId}`,
    params: {
      unix: 100
    },
    transformResponse: mockData
  }
}))(UserList)
export default UserList;
// export default withQuery("getUserList2", props => ({
//   options: {
//     url: `https://5b31e5237ad3350014b434a2.mockapi.io/api/user/${props.userId}`,
//     params: {
//       unix: 100
//     },
//   },
//   disabled: false
// }))(a)
