import React, { useEffect, useState } from 'react';
import { Playlist } from 'Types';
import axios from 'axios';
import authenticate from 'Services/AuthSvc';
import UploadButton from 'Components/Common/UploadButton/UploadButton';
import SongFieldset from './SongFieldset/SongFieldset';
import './AddSongsForm.scss';

type SongInputInfo = {
    name: string,
    tempo?: string,
    fileName: string,
    playlistIDs?: Array<string>,
}

type AddSongFormProps = {
  playlist?: Playlist;
}

const defaultSong = {
  name: '',
  tempo: '',
  fileName: '',
  playlistIDs: [],
};

const defaultPlaylist: Playlist = {
  id: 0,
  name: '',
};

const AddSongForm = (props: AddSongFormProps) => {
  const [songs, setSongs] = useState<Array<SongInputInfo>>([defaultSong]);
  const [files, setFiles] = useState<FileList>();
  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);
  const [globalPlaylistID, setGlobalPlaylist] = useState<number>(-1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getPlaylists = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}public/playlists/`)
      .then((response) => response.json())
      .then((data) => setPlaylists(data));
  };

  const auth = async () => {
    const isAuthed = await authenticate();
    setIsAuthenticated(isAuthed);
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

  const updateSongName = (fileName: string, newSongName: string) => {
    const newSongInfo = songs;
    newSongInfo.every((songInfo) => {
      if (songInfo.fileName === fileName) {
        songInfo.name = newSongName;
        return false;
      }
      return true;
    });
    setSongs(newSongInfo);
  };

  const updateSongTempo = (fileName: string, newSongTempo: string) => {
    const newSongInfo = songs;
    newSongInfo.every((songInfo) => {
      if (songInfo.fileName === fileName) {
        songInfo.tempo = newSongTempo;
        return false;
      }
      return true;
    });
    setSongs(newSongInfo);
  };

  const updateSongPlaylistIDs = (fileName: string, options: Array<HTMLOptionElement>) => {
    const newSongInfo = songs;
    const playlistIDs : Array<string> = [];
    // store selected dropdown values in array
    for (let i = 0; i < options.length; i += 1) {
      if (options[i].selected) {
        playlistIDs.push(options[i].value);
      }
    }
    newSongInfo.every((songInfo) => {
      if (songInfo.fileName === fileName) {
        songInfo.playlistIDs = playlistIDs;
        return false;
      }
      return true;
    });
    setSongs(newSongInfo);
  };

  const saveFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newFiles = target.files;

    if (!newFiles) {
      console.log('ERROR: FILE NOT UPLOADED TO FE');
      return false;
    }

    // store raw files so we can POST them later
    setFiles(newFiles);

    // build temp array of uploaded songs
    const newSongs: Array<SongInputInfo> = [];
    for (let i = 0; i < newFiles.length; i += 1) {
      newSongs[i] = {
        fileName: newFiles[i].name,
        name: newFiles[i].name,
      };
    }

    // update songs in state so map will update
    setSongs(newSongs);
    console.log('SUCCESS: FILE UPLOADED TO FE');
    return true;
  };

  const handleChange = (e : any) => {
    if (!e || !e.target || !e.target.value) {
      console.log('Error updating based on user input');
      return false;
    }

    // save raw files to state
    const cls = e.target.className;
    if (e.target.type === 'file') {
      saveFiles(e);
    } else if (cls.includes('songNameInput')) {
      updateSongName(e.target.id, e.target.value);
    } else if (cls.includes('songTempoInput')) {
      updateSongTempo(e.target.id, e.target.value);
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
    const formData = new FormData();

    if (!files || !songs) {
      console.log('songs info or files not found for upload');
      return false;
    }

    // add selected global playlistID
    if (globalPlaylistID !== -1) {
      songs.forEach((song) => {
        if (song.playlistIDs && song.playlistIDs[0]) {
          song.playlistIDs.push(globalPlaylistID.toString());
        } else if (song) {
          song.playlistIDs = [];
          song.playlistIDs[0] = globalPlaylistID.toString();
        }
      });
    }

    // add files to form data
    for (let i = 0; i < files.length; i += 1) {
      formData.append(files[i].name, files[i]);
    }

    // add songs to form data
    formData.append('songs', JSON.stringify(songs));

    // post files and info to API
    try {
      const res = await axios.post(
        'http://api.ragtagrecords.com/public/songs',
        formData,
      );
      console.log(res);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  if (!isAuthenticated) {
    return (
      <div>Must be logged in to view this page</div>
    );
  }

  return (
    <div className="container">
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

        {files && songs && songs.map((song : SongInputInfo, i) => {
          return (
            <SongFieldset
              key={song.fileName}
              index={i.toString()}
              fileName={song.name}
              playlists={playlists}
              handleChange={handleChange}
            />
          );
        })}
        {files && songs && (
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
