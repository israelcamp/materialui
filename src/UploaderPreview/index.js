import React from 'react';
import UploaderPreview from './uploader-preview';

export default function Uploader(props) {
  return (
    <div style={{ width: '33%', margin: '150px auto' }}>
      <UploaderPreview title="Upload your images" />
    </div>
  );
}
