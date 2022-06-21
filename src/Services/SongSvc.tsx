import axios from 'axios';
import { Song } from 'Types';
import { uploadFile } from 'Services/FileSvc';
import addSongToDB from './DbSvc';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const addSongToPlaylist = async (songID: number, playlistID: number) => {
  try {
    await axios.post(`${baseURL}public/playlists/${playlistID}/song/${songID}`);
    return true;
  } catch (ex) {
    return false;
  }
};

export const getSongsByPlaylistID = async (playlistID: string | number) => {
  try {
    const response = await fetch(`${baseURL}public/playlists/${playlistID}`);
    const songs = await response.json();
    if (!songs.length) {
      return false;
    }
    return songs as Song[];
  } catch (ex) {
    return false;
  }
};

export const getSongsByParentID = async (parentID: number) => {
  try {
    const response = await fetch(`${baseURL}public/songs/parent/${parentID}`);
    const songs = await response.json();
    if (!songs.length) {
      return false;
    }
    return songs as Song[];
  } catch (ex) {
    return false;
  }
};

export const updateSongName = async (songID: number, newName: string) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  try {
    const res = await axios.put(`${baseURL}public/songs/${songID}/${newName}`);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export const updatePlaylistName = async (playlistID: number, newName: string) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  const formData = new FormData();

  formData.append('name', newName);
  try {
    const res = await axios.put(`${baseURL}public/playlists/${playlistID}`, formData);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

// New way of adding songs - separately adds to DB and file server
export const addSong = async (song: Song) => {
  if (!song || !song.file) {
    return false;
  }

  // Store paths and remove files before turning into JSON
  const { file, zipFile } = song;
  song.path = `/songs/${file.name}`;
  delete song.file;

  if (song.zipFile) {
    song.zipPath = `/zips/${song.zipFile.name}`;
    delete song.zipFile;
  }

  // Add song to database
  const songInfoAddedToDB = await addSongToDB(song);
  if (!songInfoAddedToDB) {
    console.log('Failed to add song info to DB');
    return false;
  }

  // If song is a new version, update parent song
  if (song.parentID) {
    // set parentSong.isParent = true
  } else if (song.isParent) { // If the new song is becoming the main version
    // set parentSong.isParent = false
    // set parentSong.parentID = song.id

  }

  // Upload song to file server
  const songFileUploaded = await uploadFile(file, '/songs');
  if (!songFileUploaded) {
    // TODO: to make this transactional, remove from DB when upload fails
    console.log('Failed to upload song');
    return false;
  }

  // Upload zip file
  if (zipFile) {
    let zipFileUploaded = null;
    zipFileUploaded = uploadFile(zipFile, '/zips');

    // TODO: to make this transactional, remove from DB when upload fails
    if (!zipFileUploaded) {
      console.log('Failed to upload zip');
      return false;
    }
  }
  return true;
};
