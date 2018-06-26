import React from "react";
import { Filter, Query, Slice, Map } from "../";
import PT from "prop-types";

export default class Table extends React.Component {
  static propTypes = {
    columns: PT.arrayOf(PT.shape({
      title: PT.oneOfType([PT.string, PT.func]),
      render: PT.func
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
    searchText: PT.string,
    page: PT.number,
    limit: PT.number,
    query: PT.shape(Query),
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
    page: 1,
    limit: 10
  }
  renderHeader = () => {
    const { columns, HeaderRow } = this.props
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
    return rows.map((transed, idx) => (
      <BodyRowCell key={idx}>{transed}</BodyRowCell>
    ))
  }

  transformRow = row => {
    const { columns } = this.props;
    return columns.map(column => typeof(column.render) == "function" ? column.render({ data: row }) : "");
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
    const { columns } = this.props;

    return (
      <Query endPoint={this.props.query.endPoint}>
        {({ data }) => (
          <Map data={data} functor={this.transformRow}>
            {({ data }) => (
              <Filter data={data} functor={this.filterRow}>
                {({ data }) => (
                  <Slice data={data} startOf={(this.props.page - 1) * this.props.limit} limit={this.props.limit}>
                    {({ data }) => (
                      <Wrapper>
                        <ToolBarWrapper>
                          <Actions></Actions>
                          <Search></Search>
                        </ToolBarWrapper>
                        <TableWrapper>
                          <Header>
                            {this.renderHeader()}
                          </Header>
                          <Body>
                            {this.renderBodyRow(data)}
                          </Body>
                        </TableWrapper>
                        <Pagination></Pagination>
                      </Wrapper>
                    )}
                  </Slice>
                )}
              </Filter>
            )}
          </Map>

        )}
      </Query>
    )
  }
}
