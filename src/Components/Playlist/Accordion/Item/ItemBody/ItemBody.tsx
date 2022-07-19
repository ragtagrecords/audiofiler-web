import React, { useContext } from 'react';
import { PlaylistCtx } from 'Components/Playlist/PlaylistRoute';
import UploadArea from './UploadArea/UploadArea';
import DownloadOptions from './DownloadOptions/DownloadOptions';
import UploadOptions from './UploadOptions/UploadOptions';
import SongVersions from './SongVersions/SongVersions';
import { ItemCtx } from '../Item';
import './ItemBody.scss';

const ItemBody = () => {
  const playlistContext = useContext(PlaylistCtx);
  const itemContext = useContext(ItemCtx);
  if (!playlistContext || !itemContext) {
    return null;
  }

  const {
    isEditing,
    changeSong,
    bodyType,
    uploadedFiles,
    handleUploadedFiles,
  } = playlistContext;

  const {
    song,
    isSelected,
    isOpen,
    setEditedSong,
  } = itemContext;

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

export default ItemBody;
