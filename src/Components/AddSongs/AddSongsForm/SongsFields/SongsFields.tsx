import LoadingSpinner from 'Components/Common/LoadingSpinner/LoadingSpinner';
import React from 'react';
import { Playlist, Song } from 'Types';
import SongFieldset from './SongFieldset/SongFieldset';

type SongsFieldsProps = {
  songs: Song[] | null;
  playlists: Playlist[]; // don't think these needs to passed as a prop, load here instead
  isLoading: boolean;
  handleChange: any;
}

const SongsFields = ({
  songs,
  playlists,
  isLoading,
  handleChange,
}: SongsFieldsProps) => {
  if (!songs || !songs[0].file) {
    return isLoading ? <LoadingSpinner /> : null;
  }

  if (songs) {
    const songsFields = songs.map((song : Song, i) => {
      if (!song.file) {
        return <p>Song failed to load </p>;
      }
      return (
        <SongFieldset
          key={song.file.name + i}
          index={i.toString()}
          song={song}
          playlists={playlists}
          handleChange={handleChange}
        />
      );
    });
    if (songsFields !== null) {
      return (
        <>
          {songsFields}
        </>
      );
    }
  }

  return null;
};

export default SongsFields;
