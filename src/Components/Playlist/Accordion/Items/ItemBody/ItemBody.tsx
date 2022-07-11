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

  let body = null;

  if (bodyType === 'info') {
    body = (
      <>
        <p>
          artist:
          {song.artist}
        </p>
        <p>
          tempo:
          {song.tempo}
        </p>
      </>
    );
  }

  if (bodyType === 'upload') {
    // After files are uploaded
    if (uploadedFiles) {
      body = (
        <UploadOptions
          uploadedFiles={uploadedFiles}
          parentSong={song}
        />
      );
    }
    // Before files are uploaded
    body = (
      <UploadArea handleUpload={handleUploadedFiles} />
    );
  }

  if (bodyType === 'download') {
    body = (
      <DownloadOptions song={song} />
    );
  }

  if (bodyType === 'versions') {
    if (song.id && song.isParent) {
      body = <SongVersions parentID={song.id} changeSong={changeSong} />;
    }
    body = <span>No additional versions found</span>;
  }

  return (
    <div className={`accordionBody ${(isSelected && isOpen) ? 'open' : ''}`}>
      {body}
    </div>
  );
};

AccordionItemBody.defaultProps = {
  uploadedFiles: null,
};

export default AccordionItemBody;
