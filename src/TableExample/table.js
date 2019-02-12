import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { blue } from '@material-ui/core/colors';
import { objByString } from './utils';

function DataTable(props) {

  const { data, columns } = props;

  const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: blue[500],
      color: "white",
      fontSize: 13,
      ...props.headStyle
    },
    body: {
      fontSize: 13,
      ...props.bodyStyle
    },
  }))(TableCell);

  const CustomPaper = withStyles(theme => ({
    root: {
      width: '100%',
      overflowX: 'auto',
      ...props.paperStyle
    },
  }))(Paper);

  const CustomTableRow = withStyles(theme => ({
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
      ...props.rowStyle
    },
  }))(TableRow);

  for (const col of columns) {
    if (!col.hasOwnProperty('cell')) col['cell'] = row => (
      <div>
        {objByString(row, col.selector)}
      </div>
    );
  }

  return (
    <CustomPaper square={props.square}>
      <Table padding={props.tablePadding}>
        <TableHead>
          <CustomTableRow hover>
            {columns.map(col => (
              <CustomTableCell key={col.name} align={props.alingHead}>
                {col.name}
              </CustomTableCell>
            ))}
          </CustomTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
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

DataTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

DataTable.defaultProps = {
  headStyle: {},
  bodyStyle: {},
  paperStyle: {},
  rowStyle: {},
  hover: true,
  square: false,
  alingHead: "center",
  alignRow: "center",
  tablePadding: "none",
}

export default DataTable;