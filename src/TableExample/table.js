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
import { objByString } from './utils';
import { TableFooter, TablePagination } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

// const actionsStyles = theme => ({
//   root: {
//     flexShrink: 0,
//     color: theme.palette.text.secondary,
//     marginLeft: theme.spacing.unit * 2.5,
//   },
// });

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = () => {
    this.props.onChangePage(0);
  };

  handleBackButtonClick = () => {
    this.props.onChangePage(this.props.page - 1);
  };

  handleNextButtonClick = () => {
    this.props.onChangePage(this.props.page + 1);
  };

  handleLastPageButtonClick = () => {
    this.props.onChangePage(
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

// const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
//   TablePaginationActions,
// );



class DataTable extends React.Component {

  customs = {
    CustomTableCell: withStyles(theme => ({
      head: {
        backgroundColor: blue[500],
        color: "white",
        fontSize: 13,
        ...this.props.headStyle
      },
      body: {
        fontSize: 13,
        height: this.props.rowHeight,
        ...this.props.bodyStyle
      },
    }))(TableCell),
    CustomPaper: withStyles(theme => ({
      root: {
        width: '100%',
        overflowX: 'auto',
        ...this.props.paperStyle
      },
    }))(Paper),
    CustomTableRow: withStyles(theme => ({
      root: {
        ...this.props.rowStyle
      },
    }))(TableRow),
    CustomTableSortLabel: withStyles(theme => ({
      root: {
        '&:hover': {
          color: amber[500],
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
    TablePaginationActionsWrapped: withStyles(theme => ({
      root: {
        flexShrink: 0,
        marginLeft: theme.spacing.unit * 2.5,
        ...this.props.actionsStyle
      },
    }), { withTheme: true })(TablePaginationActions),
    CustomTablePagination: withStyles(theme => ({
      root: {
        color: "black",
        ...this.props.paginationStyle
      }
    }))(TablePagination)

  }

  
  constructor(props) {
    super(props);
    const { columns } = props;
    for (const col of columns) {
      if (!col.hasOwnProperty('cell')) col['cell'] = row => (
        <div>
          {objByString(row, col.selector)}
        </div>
      );
      if (!col.hasOwnProperty('sorting')) col['sorting'] = (a, b) => {
        const aa = objByString(a, col.selector);
        const bb = objByString(b, col.selector);
        if (aa < bb) return  1;
        if (aa > bb) return -1;
        return 0;
      }
    }
    this.columns = columns;

    this.state = {
      order: 'desc',
      orderBy: 0,
      page: 0,
      rowsPerPage: 5
    }

  }

  onOrderByChange = (order, colName) => {
    const newOrder = (order === 'desc' && colName === this.state.orderBy) ? 'asc' : 'desc';
    this.setState({ order: newOrder, orderBy: colName});
  }

  sortData = (order, orderBy, page, rowsPerPage) => this.props.data
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .sort((a,b) => order === 'asc' 
      ? this.columns[orderBy].sorting(a,b)
      :-this.columns[orderBy].sorting(a, b))
  
  onChangePage = page => {
    this.setState({ page });
  }

  onChangeRowsPerPage = event => {
    this.setState({ page: 0, rowsPerPage: event.target.value });
  }

  render() {
    const { CustomTableCell, CustomPaper, CustomTableRow, CustomTableSortLabel,
      TablePaginationActionsWrapped, CustomTablePagination } = this.customs;
    const { props, columns } = this;
    const { order, orderBy, page, rowsPerPage } = this.state;
    const sortedData = this.sortData(order, orderBy, page, rowsPerPage);
    const colSpan = Object.keys(sortedData[0]).length;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.data.length - page * rowsPerPage);
    return (
      <CustomPaper square={props.square}>
        <Table padding={props.tablePadding}>
          <TableHead>
            <CustomTableRow hover>
              {columns.map(({name, width}, index) => (
                <CustomTableCell key={name} align={props.alingHead}
                  style={{
                    width: width ? width : `${100/colSpan}%`
                  }}
                >
                  <Tooltip
                    title={`Sort by ${name}`}
                    placement={'top-start'}
                    enterDelay={props.delay}
                  >
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
                {columns.map((col, index) => (
                  <CustomTableCell key={index} align={props.alignRow}>
                    {col.cell(row)}
                  </CustomTableCell>
                ))}
              </CustomTableRow>
            ))}
            {emptyRows > 0 && (
              <CustomTableRow style={{height: props.rowHeight * emptyRows + emptyRows - 2}}>
                <CustomTableCell />
              </CustomTableRow>
            )}
          </TableBody>
          <TableFooter>
            <CustomTableRow>
              <CustomTablePagination
                rowsPerPageOptions={props.rowsPerPageOptions}
                colSpan={colSpan}
                count={props.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={props.selectProps}
                onChangePage={this.onChangePage}
                labelRowsPerPage={props.labelRowsPerPage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
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
  selectProps:{
    native: false
  },
  hover: true,
  square: false,
  rowHeight: 50,
  rowsPerPageOptions: [5, 10, 25],
  alingHead: "center",
  alignRow: "center",
  tablePadding: "none",
  labelRowsPerPage: "Rows per page:",
  delay: 500
}

export default DataTable;