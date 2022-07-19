import React, { useContext } from 'react';
import { AppCtx } from 'App/App';
import { PlaylistCtx } from 'Components/Playlist/PlaylistRoute';

import AddButton from './AddButton/AddButton';
import DownloadButton from './DownloadButton/DownloadButton';
import UploadButton from './UploadButton/UploadButton';
import OptionButton from './OptionButton/OptionButton';
import IconButton from './IconButton/IconButton';
import './ItemHeader.scss';
import { ItemCtx } from '../Item';

const ItemHeader = () => {
  const username = localStorage.getItem('username');

  const appContext = useContext(AppCtx);
  const playlistContext = useContext(PlaylistCtx);
  const itemContext = useContext(ItemCtx);
  if (appContext === null || itemContext === null || !playlistContext) {
    return null;
  }
  const {
    isEditing,
    isAdding,
    changeSong,
    setBodyType,
    addSongToCurrentPlaylist,
  } = playlistContext;
  const {
    song,
    isSelected,
    isEdited,
    setIsOpen,
    discardEdits,
    setEditedSong,
    saveEditedSongToDB,
  } = itemContext;

  // Either show the add button or the upload button
  const left = () => {
    if (!username) {
      return null;
    }

    if (playlistContext.isAdding) {
      return (
        <AddButton
          onClick={() => {
            addSongToCurrentPlaylist(song.id);
          }}
        />
      );
    }

    if (isSelected && !isEditing) {
      return (
        <UploadButton onClick={() => {
          setBodyType('upload');
          setIsOpen(true);
        }}
        />
      );
    }

    if (isSelected && isEditing && isEdited) {
      return (<IconButton type="cancel" onClick={discardEdits} />);
    }

    return null;
  };

  // Song name and a button to select the song and toggle body section
  const center = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      switch (e.detail) {
        case 1: // click
          setBodyType('info');
          playlistContext.setSelectedSongID(song.id);
          setIsOpen(true);
          if (isSelected) {
            changeSong(song);
          }
          break;
        case 2: // double click
          changeSong(song);
          if (appContext?.song?.id === song.id) {
            setIsOpen(false);
          }
          break;
        default:
          break;
      }
    };
    return (
      <button
        type="button"
        className="accordionButton"
        onClick={handleClick}
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
            key={`download-song-${song.id}`}
            onClick={() => {
              setBodyType('download');
              setIsOpen(true);
            }}
          />
          <OptionButton
            onClick={() => {
              setBodyType('versions');
              setIsOpen(true);
            }}
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
