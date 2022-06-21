import React, { useEffect, useState } from 'react';
import { Song, Playlist } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { removeExtraExtensions } from 'Services/FileSvc';
import { addSong } from 'Services/SongSvc';
import UploadButton from 'Components/Common/UploadButton/UploadButton';
import { useNavigate } from 'react-router-dom';
import SongFieldset from './SongFieldset/SongFieldset';
import './AddSongsForm.scss';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type AddSongFormProps = {
  playlist?: Playlist;
}

const defaultPlaylist: Playlist = {
  id: 0,
  name: '',
};

const AddSongForm = (props: AddSongFormProps) => {
  const [songs, setSongs] = useState<Array<Song> | null>(null);
  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);
  const [globalPlaylistID, setGlobalPlaylist] = useState<number>(-1);
  const [userID, setUserID] = useState<number>(0);
  const navigate = useNavigate();

  const getPlaylists = () => {
    fetch(`${baseUrl}public/playlists/`)
      .then((response) => response.json())
      .then((data) => setPlaylists(data));
  };

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  useEffect(() => {
    auth();
    getPlaylists();
  }, []);

  useEffect(() => {
    if (props.playlist) {
      setGlobalPlaylist(props.playlist.id);
    }
  }, [props.playlist]);

  const updateSongInfoInState = (fileName: string, newValue: string, infoType: string) => {
    if (songs === null) {
      return false;
    }

    const tempSongs = [...songs];

    tempSongs.every((song) => {
      if (song.fileName === fileName) {
        if (infoType === 'name') {
          song.name = newValue;
          return false;
        }

        if (infoType === 'tempo') {
          song.tempo = parseInt(newValue, 10);
          return false;
        }
      }
      // continue looping with every
      return true;
    });
    setSongs(tempSongs);
    return true;
  };

  const updateSongPlaylistIDs = (fileName: string, options: Array<HTMLOptionElement>) => {
    if (songs === null) {
      return false;
    }
    const tempSongs = [...songs];
    const playlistIDs : Array<string> = [];
    // store selected dropdown values in array
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].selected) {
        playlistIDs.push(options[i].value);
      }
    }
    tempSongs.every((song) => {
      if (song.fileName === fileName) {
        song.playlistIDs = playlistIDs;
        return false;
      }
      return true;
    });
    setSongs(tempSongs);
    return true;
  };

  const saveSongFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newFiles = target.files;

    if (!newFiles) {
      console.log('ERROR: FILE NOT UPLOADED TO FE');
      return false;
    }

    // build temp array of uploaded song info
    const newSongs: Array<Song> = [];
    for (let i = 0; i < newFiles.length; i += 1) {
      newSongs[i] = {
        file: newFiles[i],
        name: removeExtraExtensions(newFiles[i].name),
      };
    }

    // update songs in state so map will update
    setSongs(newSongs);
    console.log('SUCCESS: FILE UPLOADED TO FE');
    return true;
  };

  const saveZip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as HTMLInputElement;

    if (!songs || !files || files[0] === undefined) {
      console.log('ERROR: FILE NOT UPLOADED TO FE');
      return false;
    }

    const zipFile = files[0];

    // Build temp array of uploaded songs
    const newSongs: Array<Song> = [...songs];

    // Find and update the one that changed
    for (let i = 0; i < newSongs.length; i += 1) {
      if (newSongs[i].fileName === e.target.id) {
        newSongs[i].zipFile = zipFile;
      }
    }

    setSongs(newSongs);
    return true;
  };

  const handleChange = (e : any) => {
    if (!e || !e.target || !e.target.value) {
      console.log('Error updating based on user input');
      return false;
    }

    // save raw files to state
    const cls = e.target.className;
    if (cls.includes('songFileInput')) {
      saveSongFiles(e);
    } else if (cls.includes('songZipInput')) {
      saveZip(e);
    } else if (cls.includes('songNameInput')) {
      updateSongInfoInState(e.target.id, e.target.value, 'name');
    } else if (cls.includes('songTempoInput')) {
      updateSongInfoInState(e.target.id, e.target.value, 'tempo');
    } else if (cls.includes('songPlaylistInput')) {
      updateSongPlaylistIDs(e.target.id, e.target.options);
    } else if (cls === 'globalPlaylistIDInput') {
      setGlobalPlaylist(e.target.value);
    } else {
      console.log('Unexpected event in AddSongsForm::handleChange()');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    if (!songs) {
      console.log('Could not find songs to upload');
      return false;
    }

    const songsToSubmit = [...songs];

    // Add selected global playlistID to all the songs
    if (globalPlaylistID !== -1) {
      songsToSubmit.forEach((song) => {
        if (song.playlistIDs && song.playlistIDs[0]) {
          song.playlistIDs.push(globalPlaylistID.toString());
        } else if (song) {
          song.playlistIDs = [];
          song.playlistIDs[0] = globalPlaylistID.toString();
        }
      });
    }

    // Asynchronously attempt to add all the songs
    const results = [];
    for (let i = 0; i < songsToSubmit.length; i += 1) {
      results.push(addSong(songsToSubmit[i]));
    }

    // Array of true/false values for the success of each song
    const asyncResults = await Promise.all(results);

    if (asyncResults.includes(false)) {
      // TODO: present error to user
      return false;
    }

    navigate(`/playlists/${globalPlaylistID ?? ''}`);
    return true;
  };

  if (!userID) {
    return (
      <div className="noUser">Must be logged in to view this page</div>
    );
  }

  return (
    <div className="formContainer">
      <form className="addSongsForm" onSubmit={handleSubmit} key="addSongsForm">
        <UploadButton handleChange={handleChange} />
        <label>
          <h4>Playlist</h4>
          <div className="selectContainer">
            <select
              className="globalPlaylistIDInput"
              onChange={handleChange}
              value={globalPlaylistID}
            >
              <option
                key={-1}
                value={-1}
              > -
              </option>
              {playlists && playlists[0].name !== '' && playlists.map((playlist : Playlist) => {
                return (
                  <option
                    key={playlist.id}
                    value={playlist.id}
                  > {playlist.name}
                  </option>
                );
              })}
            </select>
            <span className="arrow" />
          </div>
        </label>

        {songs && songs.map((song : Song, i) => {
          if (song.fileName) {
            return (
              <SongFieldset
                key={song.fileName}
                index={i.toString()}
                fileName={song.fileName}
                playlists={playlists}
                handleChange={handleChange}
              />
            );
          }
          return null;
        })}
        {songs && (
        <input
          type="submit"
          value="Add Songs"
        />
        )}
      </form>
    </div>
  );
};

AddSongForm.defaultProps = {
  playlist: null,
};

export default AddSongForm;
