import axios from 'axios';
import { UploadedSongInfo, SongInputInfo, Song } from 'Types';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const addSongToPlaylist = async (songID: number, playlistID: number) => {
  try {
    await axios.post(`${baseURL}public/playlists/${playlistID}/song/${songID}`);
    return true;
  } catch (ex) {
    return false;
  }
};

// Currently expects an already uploaded parent song, and array of info for the new versions
// Also sadly doesnt work on localhost, hence the hardcoded API URL
export const addSongs = async (parentSong: Song, newSongs: UploadedSongInfo[]) => {
  const formData = new FormData();

  if (!newSongs) {
    console.log('No songs found to upload');
    return false;
  }

  const formattedSongs: SongInputInfo[] = [];

  // build SongInputInfo from UploadedSongInfo - they should match but for now this is easier
  newSongs.forEach((song) => {
    const fileName = song.file.name;
    // Add file
    formData.append(fileName, song.file);
    // Store new song info
    formattedSongs.push({
      name: song.name,
      fileName,
      tempo: song.parentSong.tempo,
      parentID: song.isMainVersion ? undefined : song.parentSong.id,
    });
  });

  // Add new song info
  formData.append('songs', JSON.stringify(formattedSongs));

  // post files and info to API
  try {
    await axios.post(
      `${baseURL}public/songs/parent/${parentSong.id}`,
      formData,
    );
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
