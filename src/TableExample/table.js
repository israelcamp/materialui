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

const customBlue = blue[500];


const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: customBlue,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 13,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    // marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

function DataTable(props) {
  const { classes, data, columns } = props;

  for (const col of columns) {
    if (!col.hasOwnProperty('cell')) col['cell'] = row => (
      <div>
        {objByString(row, col.selector)}
      </div>
    );
  }

  return (
    <Paper className={classes.root} square>
      <Table padding={'none'}>
        <TableHead>
          <TableRow hover className={classes.row}>
            {columns.map(col => (
              <CustomTableCell key={col.name} align="center">
                {col.name}
              </CustomTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow className={classes.row} key={index} hover>
              {columns.map((col, index) => (
                <CustomTableCell key={index} align="center">
                  {col.cell(row)}
                </CustomTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

DataTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataTable);