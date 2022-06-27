import React from 'react';
import { Song } from 'Types';
import LoadingSpinner from 'Components/Common/LoadingSpinner/LoadingSpinner';
import SongFieldset from './SongFieldset/SongFieldset';

type SongsFieldsProps = {
  songs: Song[] | null;
  isLoading: boolean;
  updateSongsState: any;
}

const SongsFields = ({
  songs,
  isLoading,
  updateSongsState,
}: SongsFieldsProps) => {
  if (!songs || !songs[0].file) { return isLoading ? <LoadingSpinner /> : null; }

  return (
    <>
      {songs.map((song : Song, i) => {
        if (!song.file) { return <p>Song failed to load</p>; }
        return (
          <SongFieldset
            key={song.file.name + i}
            index={i.toString()}
            song={song}
            updateSongsState={updateSongsState}
          />
        );
      })}
    </>
  );
};

export default SongsFields;
