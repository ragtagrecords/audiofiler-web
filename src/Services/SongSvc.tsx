import axios from 'axios';

const addSongToPlaylist = async (songID: number, playlistID: number) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;
  try {
    const res = await axios.post(`${baseURL}public/playlists/${playlistID}/song/${songID}`);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export default addSongToPlaylist;
