import React, { useState } from 'react';
import { removeExtraExtensions } from 'Services/FileSvc';
import { addSongs } from 'Services/SongSvc';
import { Song, UploadedSongInfo } from 'Types';
import SongFieldset from './SongFieldset.tsx/SongFieldset';
import './UploadOptions.scss';

type UploadOptionsProps = {
  uploadedFiles: File[];
  parentSong: Song;
}

const UploadOptions = ({ uploadedFiles, parentSong }: UploadOptionsProps) => {
  const initialSongInfo: UploadedSongInfo[] = [];
  uploadedFiles.forEach((file) => {
    initialSongInfo.push({
      file,
      name: removeExtraExtensions(file.name),
      parentSong,
      isMainVersion: false,
    });
  });
  const [uploadedSongInfo, setUploadedSongInfo] = useState<UploadedSongInfo[]>(initialSongInfo);
  const [uploadWasSuccessful, setUploadWasSuccessful] = useState<boolean | null>(null);

  const updateSongInfo = (newSongInfo: UploadedSongInfo) => {
    const tempSongInfo: UploadedSongInfo[] = [...uploadedSongInfo];
    tempSongInfo.forEach((songInfo) => {
      if (songInfo.file.name === newSongInfo.file.name) {
        songInfo = newSongInfo;
      } else if (newSongInfo.isMainVersion) {
        songInfo.isMainVersion = false;
      }
    });
    setUploadedSongInfo(tempSongInfo);
  };

  const handleClick = (e: React.MouseEvent, songInfo: UploadedSongInfo) => {
    const { name } = e.target as HTMLButtonElement;

    if (!name) {
      console.log('Unhandled click');
      return false;
    }

    if (name === 'isMainVersion') {
      songInfo.isMainVersion = true;
    } else if (name === 'isNewVersion') {
      songInfo.isMainVersion = false;
    }
    updateSongInfo(songInfo);
    return true;
  };

  const handleChange = (e: React.ChangeEvent, songInfo: UploadedSongInfo) => {
    const target = e.target as HTMLInputElement;
    const { value, className } = target;

    // Determine which button was clicked based on name
    if (className.includes('uploadedFileName')) {
      songInfo.name = value;
    }
    updateSongInfo(songInfo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const songsWereAdded = await addSongs(parentSong, uploadedSongInfo);
    setUploadWasSuccessful(songsWereAdded);
  };

  if (uploadWasSuccessful) {
    return (
      <div className="uploadOptionsContainer" onSubmit={handleSubmit}>
        Success! Versions added
      </div>
    );
  }

  if (uploadWasSuccessful === false) {
    return (
      <div className="uploadOptionsContainer" onSubmit={handleSubmit}>
        Sadly an error was encountered. Perhaps even sadder, we have no error handling here yet.
        Maybe some of the uploads succeeded. Maybe not. Maybe you messed up and now
        everything is broken. Maybe no will ever develop handling here and we will never know.
        <br />I am just a div, what do I know
        <a href="https://app.constructor.dev/tickets/92">
          https://app.constructor.dev/tickets/92
        </a>
      </div>
    );
  }

  return (
    <form className="uploadOptionsContainer" onSubmit={handleSubmit}>
      <ul>
        {uploadedSongInfo.map((songInfo: UploadedSongInfo) => {
          return (
            <SongFieldset
              songInfo={songInfo}
              handleChange={handleChange}
              handleClick={handleClick}
            />
          );
        })}
      </ul>
      <button
        type="submit"
        className="submitUpload"
      >
        Submit files
      </button>
    </form>

  );
};

export default UploadOptions;
