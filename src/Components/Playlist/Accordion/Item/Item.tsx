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
  bodyType: BodyType;
  setBodyType: any;
  addSong: any;
  changeSong: boolean;
  setSelectedSongID: any;
  loadPlaylistSongs: any;
  uploadedFiles?: File[];
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>;
}

const Item = ({
  song,
  isSelected,
  isEditing,
  isAdding,
  bodyType,
  setBodyType,
  addSong,
  changeSong,
  setSelectedSongID,
  loadPlaylistSongs,
  uploadedFiles,
  handleUploadedFiles,
}: ItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedSong, setEditedSong] = useState<Song>(song);

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
    <li
      className={`accordionItem normalListItem ${isSelected ? 'selected' : ''}`}
      key={`accordion-item-${song.id}`}
    >
      <ItemHeader
        song={isEditing ? editedSong : song}
        setEditedSong={setEditedSong}
        isEdited={isEdited}
        isSelected={!isAdding && isSelected}
        setIsOpen={setIsOpen}
        setBodyType={setBodyType}
        isAdding={isAdding}
        isEditing={isEditing}
        addSong={addSong}
        changeSong={changeSong}
        setSelectedSongID={setSelectedSongID}
        saveEditedSongToDB={saveEditedSongToDB}
        discardEdits={discardEdits}
      />
      <ItemBody
        song={isEditing ? editedSong : song}
        setEditedSong={setEditedSong}
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
