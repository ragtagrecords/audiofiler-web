import React from 'react';

type UploadButtonProps = {
  saveSongFiles: any;
}

const UploadButton = ({ saveSongFiles }: UploadButtonProps) => {
  return (
    <label>
      <h4>Choose songs to upload</h4>
      <input
        className="songFileInput"
        id="uploadedSongs"
        name="uploadedSongs"
        type="file"
        multiple
        onChange={(e) => {
          saveSongFiles(e);
        }}
      />
    </label>
  );
};

export default UploadButton;
