import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadButton from 'Components/Common/UploadButton/UploadButton';
import SongFieldset from './SongFieldset/SongFieldset';
import './AddSongsForm.scss';

type SongInputInfo = {
    name: string,
    tempo?: string,
    fileName: string,
    playlistIDs?: Array<string>,
}

type Playlist = {
    id: string,
    name: string,
}

const defaultSong = {
  name: 'defaultName',
  tempo: 'defaultTempo',
  fileName: 'defaultFileName.mp3',
  playlistIDs: [],
};

const defaultPlaylist = {
  id: '0',
  name: 'defaultPlaylist',
};

const AddSongForm = () => {
  const [songs, setSongs] = useState<Array<SongInputInfo>>([defaultSong]);
  const [files, setFiles] = useState<FileList>();
  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);

  const getPlaylists = () => {
    fetch('http://api.ragtagrecords.com/public/playlists/')
      .then((response) => response.json())
      .then((data) => setPlaylists(data));
  };

  useEffect(() => {
    getPlaylists();
  }, []);

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
    if (e.target.type === 'file') {
      saveFiles(e);
    } else if (e.target.className.includes('songNameInput')) {
      updateSongName(e.target.id, e.target.value);
    } else if (e.target.className.includes('songTempoInput')) {
      updateSongTempo(e.target.id, e.target.value);
    } else if (e.target.className.includes('songPlaylistInput')) {
      updateSongPlaylistIDs(e.target.id, e.target.options);
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

  return (
    <form className="addSongsForm" onSubmit={handleSubmit} key="addSongsForm">
      <UploadButton handleChange={handleChange} />

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
  );
};

export default AddSongForm;
