import axios from 'axios';
import { Playlist } from 'Types';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const getPlaylists = async () => {
  const endpoint = 'public/playlists';

  try {
    const res = await axios.get(`${baseURL}${endpoint}`);
    return res.data as Playlist[];
  } catch (ex) {
    console.log(ex);
    return null;
  }
};

export const getPlaylistByID = async (id: string | number): Promise<Playlist | null> => {
  try {
    const res = await axios.get(`${baseURL}public/playlists/${id}`);
    if (!res.data) {
      return null;
    }
    return res.data;
  } catch (ex) {
    return null;
  }
};

export const addSongToPlaylist = async (songID: number, playlistID: string) => {
  try {
    await axios.post(`${baseURL}public/playlists/${playlistID}/song/${songID}`);
    return true;
  } catch (ex) {
    return false;
  }
};

export const updatePlaylist = async ({
  id,
  name,
}: Playlist) => {
  const formData = new FormData();

  formData.append('name', name);
  try {
    const res = await axios.put(`${baseURL}public/playlists/${id}`, formData);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
