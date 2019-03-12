/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { blue, amber } from '@material-ui/core/colors';
import { TableFooter, TablePagination, Checkbox } from '@material-ui/core';
import TablePaginationActions from './table-pagination';
import objByString from './utils';

class DataTable extends React.Component {
  customs = {
    CustomTableCell: withStyles(theme => ({
      head: {
        backgroundColor: blue[500],
        color: 'white',
        fontSize: 13,
        ...this.props.headStyle
      },
      body: {
        fontSize: 13,
        height: this.props.rowHeight,
        ...this.props.bodyStyle
      }
    }))(TableCell),
    CustomPaper: withStyles(theme => ({
      root: {
        width: '100%',
        overflowX: 'auto',
        ...this.props.paperStyle
      }
    }))(Paper),
    CustomTableRow: withStyles(theme => ({
      root: {
        ...this.props.rowStyle
      }
    }))(TableRow),
    CustomTableSortLabel: withStyles(theme => ({
      root: {
        '&:hover': {
          color: amber[500]
        },
        '&:focus': {
          color: amber[500]
        },
        ...this.props.sortStyle
      },
      active: {
        color: amber[500],
        ...this.props.sortStyle
      }
    }))(TableSortLabel),
    TablePaginationActionsWrapped: withStyles(
      theme => ({
        root: {
          flexShrink: 0,
          marginLeft: theme.spacing.unit * 2.5,
          ...this.props.actionsStyle
        }
      }),
      { withTheme: true }
    )(TablePaginationActions),
    CustomTablePagination: withStyles(theme => ({
      root: {
        color: 'black',
        ...this.props.paginationStyle
      }
    }))(TablePagination),
    CustomCheckbox: withStyles(theme => ({
      root: {
        color: '#000',
        '&$checked': {
          color: blue[500]
        },
        ...this.props.rowCheckboxStyle
      },
      checked: {}
    }))(Checkbox),
    CustomHeaderCheckbox: withStyles(theme => ({
      root: {
        color: '#FFF',
        '&$checked': {
          color: '#FFF'
        },
        ...this.props.headCheckboxStyle
      },
      checked: {}
    }))(Checkbox)
  };

  state = {
    order: 'desc',
    orderBy: 0,
    page: 0,
    rowsPerPage: 5,
    selected: [],
    headerSelected: false
  };

  constructor(props) {
    super(props);
    const { columns } = props;
    for (const col of columns) {
      if (!col.hasOwnProperty('cell'))
        col['cell'] = row => <div>{objByString(row, col.selector)}</div>;
      if (!col.hasOwnProperty('sorting'))
        col['sorting'] = (a, b) => {
          const aa = objByString(a, col.selector);
          const bb = objByString(b, col.selector);
          if (aa < bb) return 1;
          if (aa > bb) return -1;
          return 0;
        };
    }
    this.columns = columns;
  }

  onOrderByChange = (order, colName) => {
    const newOrder = order === 'desc' && colName === this.state.orderBy ? 'asc' : 'desc';
    this.setState({ order: newOrder, orderBy: colName });
  };

  sortData = (order, orderBy, page, rowsPerPage) =>
    this.props.data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort((a, b) =>
        order === 'asc' ? this.columns[orderBy].sorting(a, b) : -this.columns[orderBy].sorting(a, b)
      );

  onChangePage = page => {
    this.setState({ page });
  };

  onChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  };

  onRowCheckboxChange = name => {
    const { selected } = this.state;
    selected.includes(name)
      ? this.setState({ selected: selected.filter(value => value !== name) })
      : this.setState({ selected: [...selected, name] });
  };

  onHeaderCheckboxChange = () => {
    const { headerSelected } = this.state;
    const { data } = this.props;
    headerSelected
      ? this.setState({ selected: [], headerSelected: !headerSelected })
      : this.setState({ selected: data.map(({ name }) => name), headerSelected: !headerSelected });
  };

  selectedData = () => {
    const { selected } = this.state;
    const { data } = this.props;
    return data.filter(({ name }) => selected.includes(name));
  };

  render() {
    const {
      CustomTableCell,
      CustomPaper,
      CustomTableRow,
      CustomTableSortLabel,
      TablePaginationActionsWrapped,
      CustomTablePagination,
      CustomCheckbox,
      CustomHeaderCheckbox
    } = this.customs;
    const { props, columns } = this;
    const { data } = this.props;
    const { order, orderBy, page, rowsPerPage, selected, headerSelected } = this.state;
    const sortedData = this.sortData(order, orderBy, page, rowsPerPage);
    const colSpan = Object.keys(sortedData[0]).length;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <CustomPaper square={props.square}>
        <Table padding={props.tablePadding}>
          <TableHead>
            <CustomTableRow>
              {props.withCheckbox && (
                <CustomTableCell padding="checkbox">
                  <CustomHeaderCheckbox
                    indeterminate={
                      headerSelected && selected.length < data.length && selected.length > 0
                    }
                    checked={headerSelected}
                    onChange={this.onHeaderCheckboxChange}
                  />
                </CustomTableCell>
              )}
              {columns.map(({ name, width }, index) => (
                <CustomTableCell
                  key={name}
                  align={props.alingHead}
                  style={{
                    width: width ? width : `${100 / colSpan}%`
                  }}
                >
                  <Tooltip title={`Sort by ${name}`} placement="top-start" enterDelay={props.delay}>
                    <CustomTableSortLabel
                      active={index === orderBy}
                      direction={order}
                      onClick={() => this.onOrderByChange(order, index)}
                    >
                      {name}
                    </CustomTableSortLabel>
                  </Tooltip>
                </CustomTableCell>
              ))}
            </CustomTableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <CustomTableRow key={index} hover={props.hover}>
                {props.withCheckbox && (
                  <CustomTableCell padding="checkbox">
                    <CustomCheckbox
                      // indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={selected.includes(row.name)}
                      onChange={() => this.onRowCheckboxChange(row.name)}
                    />
                  </CustomTableCell>
                )}
                {columns.map((col, index) => (
                  <CustomTableCell key={index} align={props.alignRow}>
                    {col.cell(row)}
                  </CustomTableCell>
                ))}
              </CustomTableRow>
            ))}
            {emptyRows > 0 && (
              <CustomTableRow style={{ height: props.rowHeight * emptyRows + emptyRows - 2 }}>
                <CustomTableCell colSpan={colSpan + 1 * props.withCheckbox} />
              </CustomTableRow>
            )}
          </TableBody>
          <TableFooter>
            <CustomTableRow>
              <CustomTablePagination
                rowsPerPageOptions={props.rowsPerPageOptions}
                colSpan={colSpan}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={props.selectProps}
                onChangePage={this.onChangePage}
                labelRowsPerPage={props.labelRowsPerPage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
              {React.cloneElement(props.children, { selected: this.selectedData() })}
            </CustomTableRow>
          </TableFooter>
        </Table>
      </CustomPaper>
    );
  }
}

DataTable.propTypes = {
  headStyle: PropTypes.object,
  bodyStyle: PropTypes.object,
  paperStyle: PropTypes.object,
  rowStyle: PropTypes.object,
  hover: PropTypes.bool,
  square: PropTypes.bool,
  alingHead: PropTypes.string,
  alignRow: PropTypes.string,
  tablePadding: PropTypes.string
};

DataTable.defaultProps = {
  headStyle: {},
  bodyStyle: {},
  paperStyle: {},
  rowStyle: {},
  sortStyle: {},
  actionsStyle: {},
  paginationStyle: {},
  rowCheckboxStyle: {},
  headCheckboxStyle: {},
  selectProps: {
    native: false
  },
  hover: true,
  square: false,
  rowHeight: 50,
  rowsPerPageOptions: [5, 10, 25],
  alingHead: 'center',
  alignRow: 'center',
  tablePadding: 'none',
  labelRowsPerPage: 'Rows per page:',
  delay: 500
};

export default DataTable;
