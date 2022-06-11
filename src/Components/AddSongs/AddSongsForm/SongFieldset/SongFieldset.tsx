import React, { ChangeEventHandler } from 'react';
import './SongFieldset.scss';
import { Playlist } from 'Types';

type SongFieldsetProps = {
  fileName: string,
  index: string,
  playlists: Array<Playlist>,
  handleChange: ChangeEventHandler,
}

const SongFieldset = (props: SongFieldsetProps) => {
  return (
    <fieldset className="songInfoFieldset">
      <label> Song Name
        <input
          type="text"
          id={props.fileName}
          className="songNameInput"
          name={`songName${props.index}`}
          defaultValue={props.fileName}
          onChange={props.handleChange}
        />
      </label>
      <label> Tempo
        <input
          type="text"
          id={props.fileName}
          className="songTempoInput"
          name={`tempo${props.index}`}
          defaultValue=""
          onChange={props.handleChange}
        />
      </label>
      <label>
        Playlists
        <select
          multiple
          id={props.fileName}
          className="songPlaylistInput"
          name={`playlists${props.index}`}
          onChange={props.handleChange}
        >
          {props.playlists.map((playlist : Playlist) => {
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
          id={props.fileName}
          name="uploadedZip"
          type="file"
          multiple
          onChange={props.handleChange}
        />
      </label>

    </fieldset>
  );
};

export default SongFieldset;
