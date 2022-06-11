import React, { useState } from 'react';
import { Song } from 'Types';
import AccordionItemHeader from './AccordionItemHeader/AccordionItemHeader';
import AccordionItemBody from './AccordionItemBody/AccordionItemBody';
import './AccordionItems.scss';

type AccordionItemsProps = {
    playlistSongs: Song[];
    onItemClick: any;
    isAdding: boolean;
    currentItemID: number;
    isCurrentItemOpen: boolean;
    filteredSongs?: Song[];
    onItemAdd: any;
    uploadedFiles?: FileList,
    handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>
  }

const AccordionItems = ({
  playlistSongs,
  onItemClick,
  isAdding,
  currentItemID,
  isCurrentItemOpen,
  filteredSongs,
  onItemAdd,
  uploadedFiles,
  handleUploadedFiles,
}: AccordionItemsProps) => {
  const songs = isAdding ? filteredSongs : playlistSongs;
  return (
    <>
      {songs && songs.map((song: Song, i: number) => {
        return (
          <li
            className={`accordionItem ${currentItemID === song.id ? 'selected' : ''}`}
            key={`accordion-item-${song.id}-${i}`}
          >
            <AccordionItemHeader
              item={song}
              isSelected={!isAdding && currentItemID === song.id}
              isUserAddingSongs={isAdding}
              handleItemClick={onItemClick}
              handleAddSong={onItemAdd}
              handleUploadedFiles={handleUploadedFiles}
            />
            <AccordionItemBody
              item={song}
              isSelected={!isAdding && currentItemID === song.id}
              isOpen={!isAdding && isCurrentItemOpen && currentItemID === song.id}
              uploadedFiles={
                (currentItemID === song.id)
                && (uploadedFiles)
                  ? uploadedFiles
                  : null
              }
            />
          </li>
        );
      })}
    </>
  );
};

AccordionItems.defaultProps = {
  filteredSongs: null,
  uploadedFiles: null,
};

export default AccordionItems;
