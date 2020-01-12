import React from "react";
import PT from "prop-types";
import {
  pathOr,
  prop,
  contains,
  symmetricDifference,
  union,
  insert,
  memoizeWith,
  map,
  filter,
  slice,
  sortBy,
  pipe,
  reverse,
  when,
  path
} from "ramda";
import classnames from "classnames";

const reactToString = element => {
  if (!element) {
    return '';
  }

  if (typeof element === 'string') {
    return element;
  }

  if (typeof element === 'number') {
    return String(element);
  }

  if (Array.isArray(element)) {
    return element.map(subElement => reactToString(subElement)).join('');
  }

  if (element.props && element.props.children) {
    return reactToString(element.props.children);
  }

  if (element.props && !element.props.children) {
    return '';
  }

  return '';
}


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
    autoNumIndex: PT.number,
    searchText: PT.string,
    page: PT.number,
    limit: PT.number,
    disabledPagination: PT.bool,
    onPageChange: PT.func,
    onRowClick: PT.func,
    onRowDoubleClick: PT.func,
    selected: PT.arrayOf(PT.any),
    primaryKey: PT.string,
    multi: PT.bool,
    itemActiveClass: PT.string,
    itemDisabledClass: PT.string,
    emptyText: PT.string,
    sort: PT.number,
    onSortChange: PT.function
  }
  static defaultProps = {
    Wrapper: ({ children }) => <div>{children}</div>,
    TableWrapper: ({ children }) => <table>{children}</table>,
    ToolBarWrapper: ({ children }) => <div>{children}</div>,
    Header: ({ children }) => <thead>{children}</thead>,
    HeaderRow: (props) => <tr {...props}></tr>,
    HeaderRowCell: (props) => <th {...props}></th>,
    Body: ({ children }) => <tbody>{children}</tbody>,
    BodyRow: (props) => <tr {...props}></tr>,
    BodyRowCell: ({ children }) => <td>{children}</td>,
    Search: () => <div></div>,
    Pagination: () => <div></div>,
    Actions: () => <div></div>,
    onPageChange: () => {},
    autoNum: false,
    autoNumIndex: 0,
    page: 1,
    limit: 10,
    data: [],
    multi: false,
    primaryKeyIndex: 0,
    selected: [],
    onRowClick: () => {},
    onRowDoubleClick: () => {},
    itemActiveClass: "active"
  }
  state = {
    columns: []
  }
  static getDerivedStateFromProps(props, state) {
    const { autoNum, autoNumIndex } = props;
    let columns = [];

    if(props.autoNum) {
      columns = insert(autoNumIndex, {
        title: "No.",
        render: "no"
      }, props.columns)
    } else {
      columns = props.columns
    }

    return {
      columns: columns,
      searchText: props.searchText != undefined ? props.searchText.toLowerCase() : ""
    }
  }

  _clickTimer = null;

  renderHeader = (data) => {
    const { HeaderRow, HeaderRowCell, sort, onSortChange } = this.props;
    const { columns = [] } = this.state;
    const absSort = Math.abs(sort) - 1;
    return (
      <HeaderRow>
        {columns.map((column, idx) => {
          const props = column.cellProps || {};
          const openSort = pathOr(true, ['sort'], column)
          return (
            <HeaderRowCell
              key={idx}
              onClick={() => {
                if( !openSort ) {
                  return;
                }
                if( absSort === idx) {
                  onSortChange(-sort)
                } else {
                  onSortChange(idx + 1)
                }

              }}
              {...props}
            >
              { typeof(column.title) == "function" ? column.title({ rows: data }) : column.title }
              {openSort && (
                <i
                  style={{ margin: '0px 6px'}}
                  className={classnames([{
                    'fa': true,
                    'fa-sort': absSort !== idx,
                    'fa-sort-asc': sort > 0 && absSort === idx,
                    'fa-sort-desc': sort < 0 && absSort=== idx
                  }])}
                ></i>
              )}
            </HeaderRowCell>
          )
        })}
      </HeaderRow>
    )
  };
  renderBodyRow = (rows) => {
    const {
      BodyRow,
      BodyRowCell,
      itemActiveClass,
      primaryKeyIndex,
      selected,
      multi,
      onRowClick,
      onRowDoubleClick,
      disabledPagination,
      limit,
      page,
      emptyText
    } = this.props;
    const { columns = [] } = this.state;
    const startOf = disabledPagination ? 0 : (page - 1) * limit;
    return rows.map((row, rowId) => {
      const isSelected = selected.indexOf(row.ownData) !== -1;

      return (
        <BodyRow
          key={rowId}
          className={classnames({
            [itemActiveClass]: isSelected,
          })}
          onClick={() => {
            if(this._clickTimer !== null ) {
              return;
            }
            this._clickTimer = setTimeout(() => {
              onRowClick(row.ownData);
              this._clickTimer = null;
            }, 200)
          }}
          onDoubleClick={() => {
            if(this._clickTimer !== null ) {
              clearTimeout(this._clickTimer);
              this._clickTimer = null;
            }
            onRowDoubleClick(row.ownData);
          }}
        >
          {
            row.data.map((str, colId) => (
              <BodyRowCell key={`${rowId}-${colId}`}>{str}</BodyRowCell>
            ))
          }
        </BodyRow>
      )
    })
  }
  renderBodyRowCell = (rows, rowId) => {
    const { BodyRowCell } = this.props;
    const { columns = [] } = this.state;

    return rows.map((transed, idx) => {
      const props = columns[idx].cellProps || {};
      return (
        <BodyRowCell key={idx} {...props}>{transed}</BodyRowCell>
      )
    })
  }

  transformRow = (row, idx) => {
    const { disabledPagination, limit, page, emptyText = '無資料' } = this.props;
    const startOf = disabledPagination ? 0 : (page - 1) * limit;
    const { columns = [] } = this.state;
    const data = this.props.autoNum ? { no: idx + 1, ...row } : row;
    return {
      data: columns.map(column => typeof(column.render) == "function" ? column.render({ data, ownData: row }) : pathOr(emptyText, column.render.split("."), data)),
      ownData: row
    };
  }
  filterRow = row => {
    const { searchText, columns = [] } = this.props;
    if(searchText == "" || searchText == undefined) {
      return true;
    }

    return row.data.join("").indexOf(searchText) !== -1
  }

  transformRows = arr => arr.map(this.transformRow)
  filterRows = filter(this.filterRow)
  sliceRows = (rows, start, limit) => slice(start, parseInt(start) + parseInt(limit), rows)
  sortRows = (rows, sort) => {
    if ( rows.length > 0) {
      const columnIdx = Math.abs(sort) - 1
      const isNum = !isNaN(parseInt(reactToString(rows[0].data[columnIdx])))
      const result = rows.slice(0).sort((a, b) => {
        const aCont = reactToString(a.data[columnIdx])
        const bCont = reactToString(b.data[columnIdx])
        if ( isNum ) {
          return aCont - bCont
        }
        return aCont.localeCompare(bCont)
      })
      if (sort < 0) {
        return result.reverse()
      }
      return result
    }

    return []

    return pipe(
      sortBy(path(['data', Math.abs(sort) - 1])),
      when(
        () => sort < 0,
        reverse
      )
    )(rows)
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
    const { disabledPagination, limit, page, sort } = this.props;
    const startOf = disabledPagination ? 0 : (page - 1) * limit;
    const { columns } = this.state;

    const transformRows = this.transformRows(this.props.data)
    const filterRows = this.filterRows(transformRows)
    const sortRows = sort !== 0 ? this.sortRows(filterRows, sort) : filterRows
    const sliceRows = this.sliceRows(sortRows, startOf, disabledPagination ? filterRows.length : limit)
    const headerChildren = this.renderHeader(sliceRows)
    const bodyChildren = this.renderBodyRow(sliceRows)

    return (
      <Wrapper>
        <ToolBarWrapper>
          <Actions></Actions>
          <Search searchText={this.props.searchText}></Search>
        </ToolBarWrapper>
        <TableWrapper>
          {
            Header != null ? (
              <Header>
                {headerChildren}
              </Header>
            ) : headerChildren
          }
          {
            Body != null ? (
              <Body>
                {bodyChildren}
              </Body>
            ) : bodyChildren
          }
        </TableWrapper>
        <Pagination offset={startOf} limit={limit} page={page} total={filterRows.length} ></Pagination>
      </Wrapper>
    )

  }
}
