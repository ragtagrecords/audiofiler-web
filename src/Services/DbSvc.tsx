import { Song } from 'Types';
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const addSongToDB = async (song: Song) => {
  if (!song.name || !song.path) {
    console.log('ERROR: DbSvc::addSongToDB()');
    return false;
  }

  // Assemble payload
  const payload = new FormData();
  payload.append('song', JSON.stringify(song));

  // post song info to API
  try {
    await axios.post(
      `${baseURL}public/songs`,
      payload,
    );
    return true;
  } catch (err) {
    return false;
  }
};

export default addSongToDB;
