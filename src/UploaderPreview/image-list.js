import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    overflow: 'hidden'
  },
  gridList: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  titleBar: {
    background: 'rgba(255, 255, 255, 0.0)'
  }
});

function ImageList(props) {
  const { classes } = props;

  const decideCols = (len, cols, index) => {
    let size = 1;
    const row = Math.floor(index / cols);
    if (len > row + cols) return size;
    const imagesOnRow = len - row * cols;
    const rowIndex = index - row * cols;
    const colsLeft = cols - imagesOnRow;
    if (rowIndex < colsLeft) size += 1;
    return size;
  };

  const { cellHeight, cols, data, onClick } = props;
  return (
    <div className={classes.root}>
      <GridList cellHeight={cellHeight} className={classes.gridList} cols={cols}>
        {data.map((entry, index) => (
          <GridListTile key={entry.image} cols={decideCols(data.length, props.cols, index)}>
            <img src={entry.image} alt="Your place here" />
            <GridListTileBar
              className={classes.titleBar}
              actionIcon={
                // eslint-disable-next-line react/jsx-wrap-multilines
                <IconButton className={classes.icon} onClick={() => onClick(entry.key)}>
                  <DeleteIcon />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

ImageList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  cols: PropTypes.number,
  cellHeight: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

ImageList.defaultProps = {
  cols: 2,
  cellHeight: 160
};

export default withStyles(styles)(ImageList);
