import React, { useEffect, useState } from 'react';
import { getPlaylists } from 'Services/PlaylistSvc';
import { Playlist } from 'Types';

type SelectPlaylistsProps = {
  _index?: string; // Use when mapping multiple of these
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

const SelectPlaylists = ({ _index, onChange }: SelectPlaylistsProps) => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const getAllPlaylists = async () => {
    setPlaylists(await getPlaylists());
  };

  useEffect(() => {
    getAllPlaylists();
  }, []);

  if (!playlists) {
    return null;
  }
  return (
    <label> Playlists
      <select
        multiple
        name={`playlists${_index}`}
        onChange={onChange}
      >
        {playlists.map((playlist) => {
          return (
            <option
              key={playlist.id}
              value={playlist.id}
            > {playlist.name}
            </option>
          );
        })}
      </select>
    </label>
  );
};

SelectPlaylists.defaultProps = {
  _index: 0,
};

export default SelectPlaylists;
