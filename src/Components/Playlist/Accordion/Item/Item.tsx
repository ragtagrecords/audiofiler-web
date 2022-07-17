import React, { useState } from 'react';
import { BodyType, Song } from 'Types';
import { updateSong } from 'Services/SongSvc';
import ItemHeader from './ItemHeader/ItemHeader';
import ItemBody from './ItemBody/ItemBody';
import './Item.scss';

type ItemProps = {
  song: Song;
  isSelected: boolean;
  isEditing: boolean;
  isAdding: boolean;
  isOpen: boolean;
  setIsOpen: any;
  bodyType: BodyType;
  setBodyType: any;
  addSong: any;
  changeSong: boolean;
  loadPlaylistSongs: any;
  uploadedFiles?: File[];
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>;
}

const Item = ({
  song,
  isSelected,
  isEditing,
  isAdding,
  isOpen,
  setIsOpen,
  bodyType,
  setBodyType,
  addSong,
  changeSong,
  loadPlaylistSongs,
  uploadedFiles,
  handleUploadedFiles,
}: ItemProps) => {
  const [editedSong, setEditedSong] = useState<Song>(song);

  const isEdited = isEditing && (song.name !== editedSong.name || song.tempo !== editedSong.tempo);

  const discardEdits = () => {
    setEditedSong({ ...song });
    console.log(editedSong);
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

    if (!success) {
      return false;
    }

    loadPlaylistSongs();
    return true;
  };

  return (
    <li
      className={`accordionItem normalListItem ${isSelected ? 'selected' : ''}`}
      key={`accordion-item-${song.id}`}
    >
      <ItemHeader
        song={isEditing ? editedSong : song}
        setEditedSong={setEditedSong}
        isEdited={isEdited}
        isSelected={!isAdding && isSelected}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setBodyType={setBodyType}
        isAdding={isAdding}
        isEditing={isEditing}
        addSong={addSong}
        changeSong={changeSong}
        saveEditedSongToDB={saveEditedSongToDB}
        discardEdits={discardEdits}
      />
      <ItemBody
        song={song}
        // items cant be selected or opened while adding songs
        isSelected={!isAdding && isSelected}
        isOpen={(isEditing && isSelected) || (!isAdding && isOpen && isSelected)}
        isEditing={isEditing}
        bodyType={bodyType}
        uploadedFiles={uploadedFiles}
        handleUploadedFiles={handleUploadedFiles}
        changeSong={changeSong}
      />
    </li>
  );
};

Item.defaultProps = {
  uploadedFiles: null,
};

export default Item;
