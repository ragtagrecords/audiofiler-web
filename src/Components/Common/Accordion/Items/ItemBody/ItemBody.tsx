import React from 'react';
import { BodyType, Song } from 'Types';
import './ItemBody.scss';
import UploadArea from './UploadArea/UploadArea';
import DownloadOptions from './DownloadOptions/DownloadOptions';
import UploadOptions from './UploadOptions/UploadOptions';
import SongVersions from './SongVersions/SongVersions';

type AccordionItemBodyProps = {
  song: Song;
  bodyType: BodyType
  isSelected: boolean;
  isOpen: boolean;
  uploadedFiles?: File[];
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>;
  changeSong: any;
}

const AccordionItemBody = ({
  song,
  isSelected,
  isOpen,
  bodyType,
  uploadedFiles,
  handleUploadedFiles,
  changeSong,
}: AccordionItemBodyProps) => {
  if (bodyType === 'collapsed' || !isSelected) {
    return null;
  }

  if (bodyType === 'info') {
    return (
      <div
        className={`accordionBody ${(isSelected && isOpen) ? 'open' : ''}`}
      >
        <p>
          id:
          {song.id}
        </p>
        <p>
          artist:
          {song.artist}
        </p>
        <p>
          tempo:
          {song.tempo}
        </p>
      </div>
    );
  }

  if (bodyType === 'upload') {
    // After files are uploaded
    if (uploadedFiles) {
      return (
        <div
          className={`accordionBody ${isSelected && isOpen ? 'open' : ''}`}
        >
          <UploadOptions
            uploadedFiles={uploadedFiles}
            parentSong={song}
          />
        </div>
      );
    }
    // Before files are uploaded
    return (
      <div
        className={`accordionBody ${isSelected && isOpen ? 'open' : ''}`}
      >
        <UploadArea
          handleUpload={handleUploadedFiles}
        />
      </div>
    );
  }

  if (bodyType === 'download') {
    return (
      <div
        className={`accordionBody ${isSelected && isOpen ? 'open' : ''}`}
      >
        <DownloadOptions
          song={song}
        />
      </div>
    );
  }

  if (bodyType === 'versions') {
    if (song.id && song.isParent) {
      return (
        <div
          className="accordionBody open"
        >
          <SongVersions
            parentID={song.id}
            changeSong={changeSong}
          />
        </div>
      );
    }
    return (
      <div
        className="accordionBody open"
      >
        No additional versions found
      </div>
    );
  }

  return null;
};

AccordionItemBody.defaultProps = {
  uploadedFiles: null,
};

export default AccordionItemBody;
