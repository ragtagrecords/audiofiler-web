import axios from 'axios';

export const addSongToPlaylist = async (songID: number, playlistID: number) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  try {
    const res = await axios.post(`${baseURL}public/playlists/${playlistID}/song/${songID}`);
    return res;
  } catch (ex) {
    console.log(ex);
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
