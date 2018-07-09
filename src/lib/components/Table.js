import React from "react";
import { Filter, Query, Slice, Map } from "../";
import PT from "prop-types";
import { pathOr } from "ramda";

export default class Table extends React.Component {
  static propTypes = {
    data: PT.arrayOf(PT.any),
    columns: PT.arrayOf(PT.shape({
      title: PT.oneOfType([PT.string, PT.func]),
      render: PT.func,
      cellProps: PT.any,
    })),
    TableWrapper: PT.oneOfType([PT.element, PT.func]),
    Wrapper: PT.oneOfType([PT.element, PT.func]),
    ToolBarWrapper: PT.oneOfType([PT.element, PT.func]),
    Header: PT.oneOfType([PT.element, PT.func]),
    HeaderRow: PT.oneOfType([PT.element, PT.func]),
    HeaderRowCell: PT.oneOfType([PT.element, PT.func]),
    Body: PT.oneOfType([PT.element, PT.func]),
    BodyRow: PT.oneOfType([PT.element, PT.func]),
    BodyRowCell: PT.oneOfType([PT.element, PT.func]),
    Search: PT.oneOfType([PT.element, PT.func]),
    Pagination: PT.oneOfType([PT.element, PT.func]),
    Actions: PT.oneOfType([PT.element, PT.func]),
    autoNum: PT.bool,
    searchText: PT.string,
    page: PT.number,
    limit: PT.number,
    disabledPagination: PT.bool,
    onPageChange: PT.func
  }
  static defaultProps = {
    Wrapper: ({ children }) => <div>{children}</div>,
    TableWrapper: ({ children }) => <table>{children}</table>,
    ToolBarWrapper: ({ children }) => <div>{children}</div>,
    Header: ({ children }) => <thead>{children}</thead>,
    HeaderRow: ({ children }) => <tr>{children}</tr>,
    HeaderRowCell: ({ children }) => <th>{children}</th>,
    Body: ({ children }) => <tbody>{children}</tbody>,
    BodyRow: ({ children }) => <tr>{children}</tr>,
    BodyRowCell: ({ children }) => <td>{children}</td>,
    Search: () => <div></div>,
    Pagination: () => <div></div>,
    Actions: () => <div></div>,
    onPageChange: () => console.log("onPageChange"),
    autoNum: false,
    page: 1,
    limit: 10,
    data: []
  }

  static getDerivedStateFromProps(props, state) {
    let columns = [];
    if(props.autoNum) {
      columns = [{
        title: "No.",
        render: "no"
      }, ...props.columns]
    } else {
      columns = columns
    }
    return {
      columns: columns
    }
  }

  renderHeader = () => {
    const { HeaderRow } = this.props;
    const { columns } = this.state;
    return (
      <HeaderRow>
        {columns.map(this.renderHeaderCell)}
      </HeaderRow>
    )
  };
  renderHeaderCell = (column, idx) => {
    const { HeaderRowCell } = this.props
    return (
      <HeaderRowCell key={idx}>
        { typeof(column.title) == "function" ? column.title() : column.title }
      </HeaderRowCell>
    )
  }
  renderBodyRow = (data) => {
    const { BodyRow } = this.props
    return data.map((item, rowId) => (
      <BodyRow key={rowId}>
        {this.renderBodyRowCell(item, rowId)}
      </BodyRow>
    ))
  }
  renderBodyRowCell = (rows, rowId) => {
    const { BodyRowCell } = this.props;
    const { columns } = this.state;

    return rows.map((transed, idx) => {
      const props = columns[idx].cellProps || {};
      return (
        <BodyRowCell key={idx} {...props}>{transed}</BodyRowCell>
      )
    })
  }

  transformRow = (row, idx) => {
    const { columns } = this.state;
    const data = this.props.autoNum ? { no: idx + 1, ...row } : row;
    return columns.map(column => typeof(column.render) == "function" ? column.render({ data }) : pathOr("無資料", column.render.split("."), data));
  }
  filterRow = row => {
    const { searchText } = this.props;
    const str = row.filter(item => (typeof(item) == "string" || typeof(item) == "number")).join("");
    return new RegExp(searchText, "gi").test(str);
  }
  render() {
    const TableWrapper = this.props.TableWrapper;
    const Wrapper = this.props.Wrapper;
    const Header = this.props.Header;
    const BodyRow = this.props.BodyRow;
    const Body = this.props.Body;
    const Search = this.props.Search;
    const Pagination = this.props.Pagination;
    const Actions = this.props.Actions;
    const ToolBarWrapper = this.props.ToolBarWrapper;
    const { disabledPagination, limit, page } = this.props;
    const startOf = disabledPagination ? 0 : (page - 1) * limit;
    const { columns } = this.state;

    return (
      <Map data={this.props.data} functor={this.transformRow}>
        {({ data }) => (
          <Filter data={data} functor={this.filterRow}>
            {({ data }) => (
              <Slice data={data} startOf={startOf} limit={disabledPagination ? data.length : this.props.limit}>
                {({ data, total }) => (
                  <Wrapper>
                    <ToolBarWrapper>
                      <Actions></Actions>
                      <Search searchText={this.props.searchText}></Search>
                    </ToolBarWrapper>
                    <TableWrapper>
                      { Header != null ? (
                        <Header>
                          {this.renderHeader()}
                        </Header>
                      ) : this.renderHeader()}
                      {
                        Body != null ? (
                          <Body>
                            {this.renderBodyRow(data)}
                          </Body>
                        ) : this.renderBodyRow(data)
                      }
                    </TableWrapper>
                    <Pagination offset={startOf} limit={limit} page={page} total={total} ></Pagination>
                  </Wrapper>
                )}
              </Slice>
            )}
          </Filter>
        )}
      </Map>
    )
  }
}
