import React, { ChangeEventHandler } from 'react';

type UploadButtonProps = {
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

const UploadButton = (props:UploadButtonProps) => {
  return (
    <label>
      <h4>Choose songs to upload</h4>
      <input
        className="songFileInput"
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
