import React from 'react';
import { Song } from 'Types';
import SelectPlaylists from 'Components/Common/SelectPlaylists/SelectPlaylists';
import './SongFieldset.scss';

type SongFieldsetProps = {
  song: Song,
  index: string,
  updateSongsState: any;
}

const SongFieldset = ({
  song,
  index,
  updateSongsState,
}: SongFieldsetProps) => {
  if (!song.file?.name) {
    return null;
  }

  return (
    <fieldset className="songInfoFieldset">
      <label> Song Name
        <input
          type="text"
          name={`songName${index}`}
          defaultValue={song.file.name}
          onChange={(e) => {
            song.file && updateSongsState(song.file.name, e.target.value, 'name');
          }}
        />
      </label>
      <label> Tempo
        <input
          type="text"
          name={`tempo${index}`}
          defaultValue={song.tempo ?? ''}
          onChange={(e) => {
            song.file && updateSongsState(song.file.name, e.target.value, 'tempo');
          }}
        />
      </label>
      <SelectPlaylists
        _index={index}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          if (song.file && e.target.options) {
            const { options } = e.target;

            // store selected dropdown values in array
            const playlistIDs : Array<string> = [];
            for (let i = 0; i < options.length; i += 1) {
              if (options[i].selected) {
                playlistIDs.push(options[i].value);
              }
            }
            updateSongsState(song.file.name, playlistIDs, 'playlistIDs');
          }
        }}
      />
      <label> Upload project .zip
        <input
          name="uploadedZip"
          type="file"
          onChange={(e) => {
            song.file && e.target.files && updateSongsState(song.file.name, e.target.files[0], 'zipFile');
          }}
        />
      </label>
    </fieldset>
  );
};

export default SongFieldset;
