import axios from 'axios';
import { uploadFile } from 'Services/FileSvc';
import { Song } from 'Types';

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Returns null if there are no results or an error
export const getSongs = async (
  playlistID: string | null = null,
  parentID: string | null = null,
): Promise<Song[]> => {
  // By default, gets all the songs
  let endpoint = 'public/songs';

  // Get songs from a specific playlist
  if (playlistID) {
    endpoint = `public/songs/playlist/${playlistID}`;
  }

  // Get different versions of a song
  if (parentID) {
    endpoint = `public/songs/parent/${parentID}`;
  }

  try {
    const res = await axios.get(
      `${baseURL}${endpoint}`,
    );
    return res.data.length ? res.data : [];
  } catch (e) {
    return [];
  }
};

export const updateSongName = async (songID: number, newName: string) => {
  try {
    const res = await axios.put(`${baseURL}public/songs/${songID}/${newName}`);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export const addSongToDB = async (song: Song) => {
  if (!song.name || !song.path) {
    console.log('ERROR: DbSvc::addSongToDB()');
    return false;
  }

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

export const deleteSongFromDB = async (id: Song['id']) => {
  if (!id) {
    console.log('ERROR: Need ID to delete song');
    return false;
  }

  try {
    const songDeleted = await axios.delete(`${baseURL}public/songs/${id}`);
    if (!songDeleted) {
      console.log('ERROR: Failed to delete song from DB');
      return false;
    }

    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

// Add a song to the DB and file server
export const addSong = async (song: Song) => {
  if (!song || !song.file) {
    return false;
  }

  const fileServerBaseURL = 'http://files.ragtagrecords.com';

  // Store paths and remove files before turning into JSON
  const { file, zipFile } = song;
  song.path = `${fileServerBaseURL}/songs/${file.name}`;
  delete song.file;

  if (song.zipFile) {
    song.zipPath = `${fileServerBaseURL}/zips/${song.zipFile.name}`;
    delete song.zipFile;
  }

  // Add song to database
  const songInfoAddedToDB = await addSongToDB(song);
  if (!songInfoAddedToDB) {
    console.log('Failed to add song info to DB');
    return false;
  }

  // Upload mp3/wav file to file server
  const songFileUploaded = await uploadFile(file, '/songs');
  if (!songFileUploaded) {
    // TODO: to make this transactional, remove from DB when upload fails
    console.log('Failed to upload song');
    return false;
  }

  // Upload zip file to file server
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
