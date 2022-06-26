import React, { ChangeEventHandler } from 'react';
import './SongFieldset.scss';
import { Playlist, Song } from 'Types';

type SongFieldsetProps = {
  song: Song,
  index: string,
  playlists: Array<Playlist>,
  handleChange: ChangeEventHandler,
}

const SongFieldset = ({
  song,
  index,
  playlists,
  handleChange,
}: SongFieldsetProps) => {
  if (!song.file?.name) {
    return null;
  }

  return (
    <fieldset className="songInfoFieldset">
      <label> Song Name
        <input
          type="text"
          id={song.file.name}
          className="songNameInput"
          name={`songName${index}`}
          defaultValue={song.file.name}
          onChange={handleChange}
        />
      </label>
      <label> Tempo
        <input
          type="text"
          id={song.file.name}
          className="songTempoInput"
          name={`tempo${index}`}
          defaultValue={song.tempo ?? ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Playlists
        <select
          multiple
          id={song.file.name}
          className="songPlaylistInput"
          name={`playlists${index}`}
          onChange={handleChange}
        >
          {playlists.map((playlist : Playlist) => {
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
      <label> Upload project .zip
        <input
          className="songZipInput"
          id={song.file.name}
          name="uploadedZip"
          type="file"
          multiple
          onChange={handleChange}
        />
      </label>

    </fieldset>
  );
};

export default SongFieldset;
