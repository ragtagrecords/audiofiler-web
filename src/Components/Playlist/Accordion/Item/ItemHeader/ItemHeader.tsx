import React from 'react';
import { Song } from 'Types';

import AddButton from './AddButton/AddButton';
import DownloadButton from './DownloadButton/DownloadButton';
import UploadButton from './UploadButton/UploadButton';
import OptionButton from './OptionButton/OptionButton';
import IconButton from './IconButton/IconButton';
import './ItemHeader.scss';

type ItemHeaderProps = {
  song: Song;
  setEditedSong: any;
  isSelected: boolean;
  isOpen: boolean;
  isEditing: boolean;
  isEdited: boolean;
  setIsOpen: any;
  setBodyType: any;
  isAdding: boolean;
  addSong: any;
  changeSong: any;
  saveEditedSongToDB: any;
  discardEdits: any;
}

const ItemHeader = ({
  song,
  setEditedSong,
  isSelected,
  isOpen,
  isEditing,
  isEdited,
  setIsOpen,
  setBodyType,
  isAdding,
  addSong,
  changeSong,
  discardEdits,
  saveEditedSongToDB,
}: ItemHeaderProps) => {
  const username = localStorage.getItem('username');

  // Either show the add button or the upload button
  const left = () => {
    if (!username) {
      return null;
    }

    if (isAdding) {
      return (<AddButton addSong={addSong} songID={song.id ?? 0} />);
    }

    if (isSelected && !isEditing) {
      return (<UploadButton setBodyType={setBodyType} setIsOpen={setIsOpen} />);
    }

    if (isSelected && isEditing && isEdited) {
      return (<IconButton type="cancel" onClick={discardEdits} />);
    }

    return null;
  };

  // Song name and a button to select the song and toggle body section
  const center = () => {
    return (
      <button
        type="button"
        className="accordionButton"
        onClick={() => {
          if (!isSelected) {
            changeSong(song);
          } else {
            setIsOpen(!isOpen);
          }
        }}
      >
        {isEditing ? (
          <input
            value={song.name}
            onChange={(e) => {
              const editedSong = { ...song };
              editedSong.name = e.target.value;
              setEditedSong(editedSong);
            }}
          />
        ) : (
          <span>{song.name}</span>
        )}
      </button>
    );
  };

  // If song is selected and user is authenticated, show extra options
  const right = () => {
    if (!isSelected || !song.path || !username) {
      return null;
    }

    if (!isEditing) {
      return (
        <>
          <DownloadButton
            href={song.path}
            fileName={song.path.split('/')[5]}
            key={`download-song-${song.id}`}
            setBodyType={setBodyType}
            setIsOpen={setIsOpen}
          />
          <OptionButton
            username={username}
            setBodyType={setBodyType}
            setIsOpen={setIsOpen}
          />
        </>
      );
    }

    if (isEdited) {
      return (<IconButton type="save" onClick={saveEditedSongToDB} />);
    }

    return null;
  };

  return (
    <div className={`accordionHeader ${isSelected ? 'selected' : ''} ${isAdding ? 'adding' : ''}`}>

      <div className="accordionHeaderSection left">
        {left()}
      </div>

      <div className="accordionHeaderSection center">
        {center()}
      </div>

      <div className="accordionHeaderSection right">
        {right()}
      </div>
    </div>
  );
};

export default ItemHeader;
