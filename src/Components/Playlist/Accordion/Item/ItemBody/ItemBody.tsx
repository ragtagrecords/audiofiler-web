import React from 'react';
import { BodyType, Song } from 'Types';
import './ItemBody.scss';
import UploadArea from './UploadArea/UploadArea';
import DownloadOptions from './DownloadOptions/DownloadOptions';
import UploadOptions from './UploadOptions/UploadOptions';
import SongVersions from './SongVersions/SongVersions';

type AccordionItemBodyProps = {
  song: Song;
  setEditedSong: any;
  bodyType: BodyType
  isSelected: boolean;
  isOpen: boolean;
  isEditing: boolean;
  uploadedFiles?: File[];
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>;
  changeSong: any;
}

const ItemBody = ({
  song,
  setEditedSong,
  isSelected,
  isOpen,
  isEditing,
  bodyType,
  uploadedFiles,
  handleUploadedFiles,
  changeSong,
}: AccordionItemBodyProps) => {
  if (bodyType === 'collapsed' || !isSelected) {
    return null;
  }

  let body = null;

  if (bodyType === 'info' || isEditing) {
    body = (
      <>
        <p>
          <span>tempo: </span>
          {isEditing ? (
            <input
              value={song.tempo}
              onChange={(e) => {
                const editedSong = { ...song };
                editedSong.tempo = e.target.value;
                setEditedSong(editedSong);
              }}
            />
          ) : (
            <span> {song.tempo} </span>
          )}
        </p>
      </>
    );
  } else if (bodyType === 'upload') {
    if (uploadedFiles) { // After files are uploaded
      body = (
        <UploadOptions
          uploadedFiles={uploadedFiles}
          parentSong={song}
        />
      );
    } else { // Before files are uploaded
      body = (
        <UploadArea handleUpload={handleUploadedFiles} />
      );
    }
  } else if (bodyType === 'download') {
    body = (
      <DownloadOptions song={song} />
    );
  } else if (bodyType === 'versions') {
    if (song.id && song.isParent) {
      body = <SongVersions parentID={song.id} changeSong={changeSong} />;
    } else {
      body = <span>No additional versions found</span>;
    }
  }

  return (
    <button
      type="button"
      className={`accordionBody ${(isSelected && isOpen) ? 'open' : ''} ${bodyType}`}
      onClick={() => {
        if (bodyType === 'info') { changeSong(song); }
      }}
    >
      {body}
    </button>
  );
};

ItemBody.defaultProps = {
  uploadedFiles: null,
};

export default ItemBody;
