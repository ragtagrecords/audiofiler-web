import React, { useState } from 'react';
import { removeExtraExtensions } from 'Services/FileSvc';
import { addSong } from 'Services/SongSvc';
import { Song } from 'Types';
import SongFieldset from './SongFieldset.tsx/SongFieldset';
import './UploadOptions.scss';

type UploadOptionsProps = {
  uploadedFiles: File[];
  parentSong: Song;
}

const UploadOptions = ({ uploadedFiles, parentSong }: UploadOptionsProps) => {
  const initialSongs: Song[] = [];
  uploadedFiles.forEach((file) => {
    initialSongs.push({
      file,
      name: removeExtraExtensions(file.name),
      parentID: parentSong.id,
      isParent: false,
      tempo: parentSong.tempo ?? undefined,
    });
  });
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>(initialSongs);
  const [uploadWasSuccessful, setUploadStatus] = useState<boolean | null>(null);

  // Updates song in uploadedSongs
  const updateSong = (song: Song) => {
    // Copy current info from state
    const songs: Song[] = [...uploadedSongs];

    const isNewParent = song.isParent;

    // Find which one changed and update it
    for (let i = 0; i < songs.length; i += 1) {
      const namesMatch = songs[i].file?.name === song.file?.name;
      if (namesMatch) {
        songs[i] = song;
      } else if (isNewParent) {
        songs[i].isParent = false;
      }
    }
    setUploadedSongs(songs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const results = [];
    for (let i = 0; i < uploadedSongs.length; i += 1) {
      // Add request for song to async array
      results.push(addSong(uploadedSongs[i]));
    }

    // Array of true/false values for the success of each file
    const asyncResults = await Promise.all(results);

    // TODO: present error to user if any occured
    if (asyncResults.includes(false)) {
      setUploadStatus(false);
      return false;
    }

    setUploadStatus(true);
    return true;
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
        {uploadedSongs && uploadedSongs.map((song: Song) => {
          if (!song.file) {
            return null;
          }
          return (
            <SongFieldset
              song={song}
              updateSong={updateSong}
              parentSongID={parentSong.id ?? -1}
              key={`song-fieldset-${song.file.name}`}
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
