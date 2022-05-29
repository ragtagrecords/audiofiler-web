import React, { ChangeEventHandler } from 'react';

type UploadButtonProps = {
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = (props:UploadButtonProps) => {
  return (
    <label>
      Choose songs to upload
      <input
        id="uploadedSongs"
        name="uploadedSongs"
        type="file"
        multiple
        onChange={props.handleChange}
      />
    </label>
  );
};

export default UploadButton;
