import React from 'react';
import { getExtension } from 'Services/FileSvc';

import { UploadedSongInfo } from 'Types';

type SongFieldsetProps = {
  songInfo: UploadedSongInfo;
  handleChange: any;
  handleClick: any;
}

const SongFieldset = ({ songInfo, handleChange, handleClick }: SongFieldsetProps) => {
  return (
    <li key={songInfo.file.name}>
      <input
        type="text"
        className="uploadedFileName"
        value={songInfo.name}
        onChange={(e) => {
          handleChange(e, songInfo);
        }}
      />
      <p className="uploadedFileType">
        ({getExtension(songInfo.file.name)} detected)
      </p>
      <div className="uploadVersionOptions">
        {}
        <button
          type="button"
          name="isMainVersion"
          className={`uploadVersionButton ${songInfo.isMainVersion ? 'selected' : ''}`}
          onClick={(e) => {
            handleClick(e, songInfo);
          }}
        >
          Replace main version
        </button>
        <button
          type="button"
          name="isNewVersion"
          className={`uploadVersionButton ${!songInfo.isMainVersion ? 'selected' : ''}`}
          onClick={(e) => {
            handleClick(e, songInfo);
          }}
        >
          Add new version
        </button>
      </div>
    </li>
  );
};

export default SongFieldset;
