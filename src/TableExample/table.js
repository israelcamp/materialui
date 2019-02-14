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
        // '&:nth-of-type(odd)': {
        //   backgroundColor: theme.palette.background.default,
        // },
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
    }))(TableSortLabel)
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
    }

  }

  onOrderByChange = (order, colName) => {
    const newOrder = (order === 'desc' && colName === this.state.orderBy) ? 'asc' : 'desc';
    this.setState({ order: newOrder, orderBy: colName});
  }

  sortData = (order, orderBy) => this.props.data.sort((a,b) => order === 'asc' 
      ? this.columns[orderBy].sorting(a,b)
      :-this.columns[orderBy].sorting(a, b))
  
  render() {
    const { props, columns } = this;
    const { CustomTableCell, CustomPaper, CustomTableRow, CustomTableSortLabel } = this.customs;
    const { order, orderBy } = this.state;
    const sortedData = this.sortData(order, orderBy);
    return (
      <CustomPaper square={props.square}>
        <Table padding={props.tablePadding}>
          <TableHead>
            <CustomTableRow hover>
              {columns.map((col, index) => (
                <CustomTableCell key={col.name} align={props.alingHead}>
                  <Tooltip
                    title={`Sort by ${col.name}`}
                    placement={'top-start'}
                    enterDelay={props.delay}
                  >
                    <CustomTableSortLabel
                      active={index === orderBy}
                      direction={order}
                      onClick={() => this.onOrderByChange(order, index)}
                    >
                      {col.name}
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
          </TableBody>
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
  hover: true,
  square: false,
  alingHead: "center",
  alignRow: "center",
  tablePadding: "none",
  delay: 500
}

export default DataTable;