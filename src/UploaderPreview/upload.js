// *-* mode: rjsx -*-
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

function Upload(props) {
  const { formats, ButtonControl, onFileLoad, maxSize } = props;

  const getValidFiles = () => {
    if (formats === 'image/*') return ['image/jpg', 'image/png', 'image/jpeg'];
    return formats;
  };

  const validFilesArray = getValidFiles();

  const onInputChange = e => {
    Array.from(e.target.files)
      .filter(({ type, size }) => size <= maxSize && validFilesArray.includes(type))
      .forEach(file => {
        const reader = new FileReader();
        reader.onload = ee => onFileLoad(ee, file);
        reader.readAsDataURL(file);
      });
  };

  return (
    <ButtonControl component="span">
      <input type="file" multiple onChange={onInputChange} accept={formats} />
    </ButtonControl>
  );
}

Upload.defaultProps = {
  formats: 'image/*',
  onFileLoad: e => undefined,
  ButtonControl: Button,
  maxSize: 3000000
};

Upload.propTypes = {
  formats: PropTypes.string,
  onFileLoad: PropTypes.func,
  ButtonControl: PropTypes.func,
  maxSize: PropTypes.number
};

export default Upload;
