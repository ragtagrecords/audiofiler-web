import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import React, { createContext, useState } from 'react';
import { Song } from 'Types';
import './App.scss';

type AppContextType = {
  song: Song | null;
  songs: Song[] | null;
  playlistID: number | null;
  setSong: any;
  setSongs: any;
  setPlaylistID: any;
}

export const AppCtx = createContext<AppContextType | null>(null);

type AppProps = {
  children: React.ReactNode;
}

export const App = ({ children }: AppProps) => {
  // State is empty until song is selected
  const [song, setSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [playlistID, setPlaylistID] = useState<number | null>(null);

  /// Given a songID, finds the index in songs array
  const findIndexBySongID = (id: number) => {
    if (!songs) {
      console.log('ERROR: no songs in playlist');
      return -1;
    }

    let index = 0;
    for (let i = 0; i < songs.length; i += 1) {
      if (songs[i].id === id) {
        index = i;
        return index;
      }
    }
    return -1;
  };

  // Ensures index is valid for the current # of songs
  const validIndex = (i: number) => {
    if (!songs) { console.log('ERROR: no songs in playlist'); return 0; }
    const maxIndex = songs.length;
    const remainder = Math.abs(i % maxIndex);
    // If index was negative, return the difference
    return i >= 0 ? remainder : songs.length - remainder;
  };

  // Used for skipping and going to previous songs
  const changeSongRelativeToCurrent = (relativeIndexOfNewSong: number) => {
    if (!song || !song.id) {
      return false;
    }
    const currentSongIndex = findIndexBySongID(song.id);

    if (currentSongIndex === -1) {
      console.log('Could not determine index of currently selected song');
      return false;
    }
    if (!songs) { console.log('ERROR: no songs in playlist'); return 0; }
    const newSongIndex = validIndex(currentSongIndex + relativeIndexOfNewSong);
    const newSong = songs[newSongIndex];

    if (!newSong.id) {
      console.log('Could not find valid ID for new song');
      return false;
    }

    setSong(newSong);
    return true;
  };

  return (
    <div className="appContainer">
      <AppCtx.Provider value={{
        song,
        setSong,
        songs,
        setSongs,
        playlistID,
        setPlaylistID,
      }}
      >
        {children}
      </AppCtx.Provider>
      {song && (
        <AudioPlayer
          song={song}
          skipSong={() => {
            changeSongRelativeToCurrent(1);
          }}
          prevSong={() => {
            changeSongRelativeToCurrent(-1);
          }}
        />
      )}
    </div>
  );
};
