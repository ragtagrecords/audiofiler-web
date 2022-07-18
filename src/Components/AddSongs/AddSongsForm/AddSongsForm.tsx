import React, { useEffect, useState } from 'react';
import { Song, Playlist } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { removeExtraExtensions } from 'Services/FileSvc';
import { addSong } from 'Services/SongSvc';
import { useNavigate } from 'react-router-dom';
import UploadButton from 'Components/Common/UploadButton/UploadButton';
import guessTempo from 'Services/AudioSvc';

import './AddSongsForm.scss';
import SongsFields from './SongsFields/SongsFields';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type AddSongFormProps = {
  playlist?: Playlist;
}

const defaultPlaylist: Playlist = {
  id: 0,
  name: '',
};

const AddSongForm = ({ playlist }: AddSongFormProps) => {
  const [songs, setSongs] = useState<Array<Song> | null>(null);
  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);
  const [globalPlaylistID, setGlobalPlaylist] = useState<number>(playlist ? playlist.id : 0);
  const [userID, setUserID] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const getPlaylists = () => {
    fetch(`${baseUrl}/playlists`)
      .then((response) => response.json())
      .then((data) => setPlaylists(data));
  };

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  // Authorize and load playlists when component is mounted
  useEffect(() => {
    auth();
    getPlaylists();
  }, []);

  // When songs are not null, we are no longer loading
  useEffect(() => {
    if (songs && songs[0] && songs[0].file) {
      setIsLoading(false);
    }
  }, [songs]);

  useEffect(() => {
    if (playlist) {
      setGlobalPlaylist(playlist.id);
    }
  }, [playlist]);

  // Change handler for song properties
  // Finds the matching song in state based on file.name, then updates it accordingly
  const updateSongsState = (fileName: string, newValue: any, infoType: string) => {
    if (songs === null) {
      return false;
    }

    const tempSongs = [...songs];

    // Note that returning true inside every() does not actually end code
    // Return true to continue looping, or false to break the loop
    tempSongs.every((song) => {
      if (song.file && song.file.name === fileName) {
        switch (infoType) {
          case 'name':
            song.name = newValue;
            return false;
          case 'tempo':
            song.tempo = newValue;
            return false;
          case 'zipFile':
            song.zipFile = newValue;
            return false;
          case 'playlistIDs':
            song.playlistIDs = newValue;
            return false;
          default:
            console.log('Unhandled song update');
            break;
        }
      }
      // We haven't found the matching song yet, continue looping with every
      return true;
    });
    setSongs(tempSongs);
    return true;
  };

  const saveSongFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newFiles = target.files;

    if (!newFiles) {
      console.log('ERROR: FILE NOT UPLOADED TO FE');
      return false;
    }

    // Reset state if new songs are uploaded
    if (songs) {
      setSongs(null);
    }

    setIsLoading(true);

    // build temp array of uploaded song info
    const newSongs: Array<Song> = [];
    let tempo = '';
    for (let i = 0; i < newFiles.length; i += 1) {
      tempo = await guessTempo(newFiles[i]);
      newSongs[i] = {
        file: newFiles[i],
        name: removeExtraExtensions(newFiles[i].name),
        tempo,
      };
    }

    // update songs in state so map will update
    setSongs(newSongs);
    console.log('SUCCESS: FILES STORED IN MEMORY');
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
    if (globalPlaylistID !== 0) {
      songsToSubmit.forEach((song) => {
        if (song.playlistIDs && song.playlistIDs[0]) {
          song.playlistIDs.push(globalPlaylistID.toString());
        } else if (song) {
          song.playlistIDs = [];
          song.playlistIDs[0] = globalPlaylistID.toString();
        }
      });
    }

    // Asynchronously attempt to add all the songs to DB and file server
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
        <UploadButton saveSongFiles={saveSongFiles} />
        <label>
          <h4>Playlist</h4>
          <div className="selectContainer">
            <select
              className="globalPlaylistIDInput"
              value={globalPlaylistID}
              onChange={(e) => {
                setGlobalPlaylist(parseInt(e.target.value, 10));
              }}
            >
              <option
                key={-1}
                value=""
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

        <SongsFields
          songs={songs}
          isLoading={isLoading}
          updateSongsState={updateSongsState}
        />
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
