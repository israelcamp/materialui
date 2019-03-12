/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardActions, CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import { SHA1 } from 'jshashes';
import Upload from './upload';
import ImageList from './image-list';

const styles = theme => ({
  card: {
    maxWidth: '100%',
    backgroundColor: grey[300]
  },
  image: {
    height: '100%'
  }
});

function UploadPreview(props) {
  const { classes, title, subheader, formats, limit, initialItems, maxSize } = props;
  const [items, setItems] = useState(initialItems);

  const onFileLoad = (e, file) => {
    const hash = new SHA1().hex(e.target.result);
    const newItems = items;
    if (Object.keys(newItems).length < limit)
      newItems[hash] = {
        filename: file.name,
        mimetype: file.type,
        encoding: e.target.result
      };
    setItems({ ...newItems });
    props.onFileLoad(e, file);
    props.onChange(items);
  };

  const onRemoveAllClick = () => {
    setItems({});
    props.onChange({});
  };

  const onRemoveClick = key => {
    const newItems = items;
    delete newItems[key];
    setItems({ ...newItems });
    props.onChange(items);
  };

  const data = Object.entries(items).map(([key, value]) => ({
    key,
    image: value.encoding
  }));
  return (
    <Card className={classes.card} raised>
      <CardHeader title={title} subheader={subheader} />
      <CardContent className={classes.card}>
        <ImageList data={data} onClick={onRemoveClick} />
      </CardContent>
      <CardActions>
        {/* ADD BUTTON */}
        <Upload
          onFileLoad={onFileLoad}
          key={Object.keys(items).length}
          formats={formats}
          maxSize={maxSize}
        />
        {/* REMOVE BUTTON */}
        {Object.keys(items).length > 0 && <Button onClick={onRemoveAllClick}>Remove all</Button>}
      </CardActions>
    </Card>
  );
}

UploadPreview.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  subheader: PropTypes.string,
  formats: PropTypes.string,
  onFileLoad: PropTypes.func,
  onChange: PropTypes.func,
  initialItems: PropTypes.object,
  maxSize: PropTypes.number,
  limit: PropTypes.number
};

UploadPreview.defaultProps = {
  title: '',
  subheader: 'Max 4 photos of 3MB each.',
  formats: 'image/*',
  onFileLoad: (e, file) => undefined,
  onChange: items => undefined,
  initialItems: {},
  maxSize: 3000000,
  limit: 4
};

export default withStyles(styles)(UploadPreview);
