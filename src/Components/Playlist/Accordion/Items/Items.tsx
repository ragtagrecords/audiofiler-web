import React from 'react';
import { Song, BodyType } from 'Types';
import ItemHeader from './ItemHeader/ItemHeader';
import ItemBody from './ItemBody/ItemBody';
import './Items.scss';

type ItemsProps = {
  playlistSongs: Song[];
  selectedSongID: number;
  isBodyOpen: boolean;
  setIsBodyOpen: any;
  setBodyType: any;
  isAdding: boolean;
  filteredSongs?: Song[];
  uploadedFiles?: File[],
  addSong: any;
  bodyType: BodyType;
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>,
  changeSong: any;
}

const Items = ({
  playlistSongs,
  selectedSongID,
  isBodyOpen,
  setIsBodyOpen,
  setBodyType,
  bodyType,
  isAdding,
  filteredSongs,
  uploadedFiles,
  addSong,
  handleUploadedFiles,
  changeSong,
}: ItemsProps) => {
  const songs = isAdding ? filteredSongs : playlistSongs;
  return (
    <>
      {songs && songs.map((song: Song, i: number) => {
        const isSelected = selectedSongID === song.id;
        return (
          <li
            className={`accordionItem normalListItem ${isSelected ? 'selected' : ''}`}
            key={`accordion-item-${song.id}-${i}`}
          >
            <ItemHeader
              song={song}
              isSelected={!isAdding && isSelected}
              isBodyOpen={isBodyOpen}
              setIsBodyOpen={setIsBodyOpen}
              setBodyType={setBodyType}
              isUserAddingSongs={isAdding}
              addSong={addSong}
              changeSong={changeSong}
            />
            <ItemBody
              song={song}
              // items cant be selected or opened while adding songs
              isSelected={!isAdding && isSelected}
              isOpen={!isAdding && isBodyOpen && isSelected}
              bodyType={bodyType}
              uploadedFiles={uploadedFiles}
              handleUploadedFiles={handleUploadedFiles}
              changeSong={changeSong}
            />
          </li>
        );
      })}
    </>
  );
};

Items.defaultProps = {
  filteredSongs: null,
  uploadedFiles: null,
};

export default Items;
