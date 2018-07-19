import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ExampleActions } from "../store/Example";
import { Table } from "../../lib";
import { times } from "ramda";
import withQuery from "../../lib/components/withQuery";
import withQueryConnect from "../../lib/components/withQueryConnect";

class UserList extends React.Component {
  render() {
    return (
      <div>
        <div>UserList { this.props.userId}</div>
        <button onClick={() => this.props.getUserList.refresh()}>refresh</button>
      </div>

    )
  }
}

const a = withQueryConnect("getUserList", props => ({
  options: {
    url: `https://5b31e5237ad3350014b434a2.mockapi.io/api/user/${props.userId}`,
    params: {
      unix: 100
    },
  },
  disabled: false
}))(UserList)
// export default a;
export default withQuery("getUserList2", props => ({
  options: {
    url: `https://5b31e5237ad3350014b434a2.mockapi.io/api/user/${props.userId}`,
    params: {
      unix: 100
    },
  },
  disabled: false
}))(a)
