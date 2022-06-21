import React from 'react';
import { getExtension } from 'Services/FileSvc';

import { Song } from 'Types';

type SongFieldsetProps = {
  song: Song;
  updateSong: any;
  parentSongID: number;
}

const SongFieldset = ({ song, updateSong, parentSongID }: SongFieldsetProps) => {
  if (!song.file || parentSongID === -1) {
    return null;
  }

  return (
    <li>
      <input
        type="text"
        className="uploadedFileName"
        value={song.name}
        onChange={(e) => {
          const updatedSong = { ...song };
          updatedSong.name = e.target.value;
          updateSong(updatedSong);
        }}
      />
      <p className="uploadedFileType">
        ({getExtension(song.file.name)} detected)
      </p>
      <div className="uploadVersionOptions">
        {}
        <button
          type="button"
          name="isParent"
          className={`uploadVersionButton ${song.isParent ? 'selected' : ''}`}
          onClick={() => {
            const updatedSong = { ...song };
            updatedSong.isParent = true;
            updatedSong.parentID = null;
            updateSong(updatedSong);
          }}
        >
          Replace main version
        </button>
        <button
          type="button"
          name="isNewVersion"
          className={`uploadVersionButton ${!song.isParent ? 'selected' : ''}`}
          onClick={() => {
            const updatedSong = { ...song };
            updatedSong.isParent = false;
            updatedSong.parentID = parentSongID;
            updateSong(updatedSong);
          }}
        >
          Add new version
        </button>
      </div>
    </li>
  );
};

export default SongFieldset;
