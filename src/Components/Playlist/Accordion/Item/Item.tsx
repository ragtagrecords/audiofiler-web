import React, { createContext, useContext, useState } from 'react';
import { Song } from 'Types';
import { updateSong } from 'Services/SongSvc';
import { PlaylistCtx } from 'Components/Playlist/PlaylistRoute';
import './Item.scss';

interface ItemContextInterface {
  song: Song,
  isSelected: boolean,
  isEdited: any;
  isOpen: boolean;
  setIsOpen: any;
  setEditedSong: any,
  saveEditedSongToDB: any,
  discardEdits: any,
}

export const ItemCtx = createContext<ItemContextInterface | null>(null);

type ItemProps = {
  children: React.ReactNode,
  song: Song;
  isSelected: boolean;
}

const Item = ({
  children,
  song,
  isSelected,
}: ItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedSong, setEditedSong] = useState<Song>(song);

  const playlistContext = useContext(PlaylistCtx);
  if (!playlistContext) {
    return null;
  }

  const {
    isEditing,
    isAdding,
    loadPlaylistSongs,
  } = playlistContext;

  const wereEditsMade = () => {
    let wasTempoChanged = null;
    if (typeof editedSong.tempo === 'number') {
      wasTempoChanged = song.tempo !== editedSong.tempo;
    } else if (typeof editedSong.tempo === 'string') {
      wasTempoChanged = song.tempo !== parseInt(editedSong.tempo, 10);
    }
    const wasNameChanged = song.name !== editedSong.name;
    return wasTempoChanged || wasNameChanged;
  };

  const discardEdits = () => {
    setEditedSong({ ...song });
  };

  const saveEditedSongToDB = async () => {
    if (!editedSong) {
      return false;
    }

    if (editedSong.name === '') {
      alert('Name cannot be empty!');
      return false;
    }

    const success = await updateSong({ ...editedSong });

    if (!success) { return false; }
    loadPlaylistSongs();
    return true;
  };

  const isEdited = isEditing && wereEditsMade();

  return (
    <ItemCtx.Provider
      value={{
        song: isEditing ? editedSong : song,
        isSelected: !isAdding && isSelected,
        isEdited,
        isOpen: (isEditing && isSelected) || (!isAdding && isOpen && isSelected),
        setEditedSong,
        setIsOpen,
        saveEditedSongToDB,
        discardEdits,
      }}
    >
      <li
        className={`accordionItem normalListItem ${isSelected ? 'selected' : ''}`}
        key={`accordion-item-${song.id}`}
      >
        {children}
      </li>
    </ItemCtx.Provider>
  );
};

export default Item;
