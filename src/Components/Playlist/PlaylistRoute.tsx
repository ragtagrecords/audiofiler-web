import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { AppCtx } from 'App/App';
import {
  BodyType, MenuOption, Playlist, Song,
} from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { getSongs } from 'Services/SongSvc';
import { getPlaylistByID, addSongToPlaylist, updatePlaylist } from 'Services/PlaylistSvc';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import BackButton from 'Components/Common/BackButton/BackButton';
import Accordion from 'Components/Playlist/Accordion/Accordion';
import Item from './Accordion/Item/Item';
import ItemHeader from './Accordion/Item/ItemHeader/ItemHeader';
import ItemBody from './Accordion/Item/ItemBody/ItemBody';
import './PlaylistRoute.scss';

interface PlaylistContextInterface {
  playlist: Playlist | null;
  playlistSongs: Song[] | null;
  allSongs: Song[] | null;
  filteredSongs: Song[] | null;
  uploadedFiles: File[] | null;
  selectedSongID: number | null;
  userID: number | null;
  isAdding: boolean;
  isLoading: boolean;
  isEditing: boolean;
  query: string;
  bodyType: BodyType;
  changeSong: any;
  addSongToCurrentPlaylist: any;
  setSelectedSongID: any;
  setBodyType: any;
  loadPlaylistSongs: any;
  loadAllSongs: any;
  setQuery: any;
  setUploadedFiles: any;
  handleUploadedFiles: any;
  handleQueryChange: any;
}

export const PlaylistCtx = createContext<PlaylistContextInterface | null>(null);

type PlaylistParams = {
  playlistID: string;
}

const PlaylistPage = () => {
  // Get playlistID from query params
  const { playlistID } = useParams<PlaylistParams>();
  const appContext = useContext(AppCtx);

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[] | null>(null);
  const [selectedSongID, setSelectedSongID] = useState<number | null>(null);
  const [userID, setUserID] = useState<number | null>(null);

  // Modes
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [bodyType, setBodyType] = useState<BodyType>('info');
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);

  // Adding existing songs to the playlist
  const [query, setQuery] = useState<string>(''); // The input provided by user
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  const onSongAddClick = () => {
    setIsAdding(!isAdding);
  };

  const onSongEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Used for 3 dots in upper right of page
  const menuOptions: MenuOption[] = [
    {
      href: '/songs/add',
      text: 'Upload songs',
      state: { playlist },
    },
    {
      href: '/',
      text: 'Add existing songs',
      onClick: onSongAddClick,
    },
    {
      href: '/',
      text: 'Edit songs',
      onClick: onSongEditClick,
    },
  ];

  const loadPlaylist = async () => {
    const p = await getPlaylistByID(playlistID);
    if (!p || !p.name) {
      setIsLoading(false);
      return false;
    }
    setPlaylist(p);
    return true;
  };

  const loadPlaylistSongs = async () => {
    const s = await getSongs(playlistID);
    if (!s || s.length === 0) {
      setIsLoading(false);
      return false;
    }
    setPlaylistSongs(s);
    return true;
  };

  const loadAllSongs = async () => {
    const songs = await getSongs(null);
    if (songs) {
      setAllSongs(songs);
      return true;
    }
    return false;
  };

  // Sets filteredSongs based on current query and playlist
  const filterSongs = () => {
    if (!allSongs || !playlistSongs) {
      console.log("Can't filter based on search unless all songs are fetched");
      return false;
    }

    const tempSongs: Song[] = [];
    for (let i = 0; i < allSongs.length; i += 1) {
      let songAlreadyInPlaylist = false;
      const song = allSongs[i];

      // Loop through playlist to see if song already exists here
      for (let j = 0; j < playlistSongs.length; j += 1) {
        const playlistSong = playlistSongs[j];
        if (playlistSong.id === song.id) {
          songAlreadyInPlaylist = true;
        }
      }

      const songMatchesQuery = query === '' ? true : song.name.includes(query);
      if (!songAlreadyInPlaylist && songMatchesQuery) {
        tempSongs.push(song); // Add song to results
      }
    }

    setFilteredSongs(tempSongs);
    return true;
  };

  // When add button is clicked for a particular item
  const addSongToCurrentPlaylist = (id: number) => {
    if (!playlist) {
      console.log("Couldn't add song");
      return false;
    }
    addSongToPlaylist(id, playlist.id);
    loadPlaylistSongs();
    filterSongs();
    return true;
  };

  // Change the song that is playing in the AudioPlayer
  const changeSong = (song: Song, isChild = false) => {
    if (isEditing) {
      return false;
    }

    if (!song.id) {
      console.log('Failed to change song!');
      return false;
    }

    if (appContext?.song?.id !== song.id) {
      appContext?.setSong(song);
    }

    // If song is in different playlist than the one playing, update songs in context
    if (playlist?.id !== appContext?.playlistID) {
      appContext?.setPlaylistID(playlistID);
      appContext?.setSongs(playlistSongs);
    }

    if (!isChild) { setSelectedSongID(song.id); }
    return true;
  };

  const changePlaylistName = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!playlist || !playlist.name) { console.log("ERROR: Couldn't update playlist name"); return false; }
    const emptyString = playlist.name === '';
    const startsWithSpace = playlist.name.length > 0 && playlist.name[0] === ' ';
    const endsWithSpace = playlist.name.length > 0 && playlist.name.slice(-1) === ' ';

    if (emptyString) {
      alert('Playlist name can not be empty.');
    } else if (startsWithSpace || endsWithSpace) {
      alert('Playlist name can not start or end with spaces.');
    } else if (playlist) {
      alert('Name updated successfully.');
      return !!updatePlaylist(playlist);
    }
    return false;
  };

  const handleUploadedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { files } = target;
    if (!files) {
      console.log('Upload failed');
      return false;
    }
    const fileArray: File[] = [];
    for (let i = 0; i < files.length; i += 1) {
      fileArray.push(files[i]);
    }
    setUploadedFiles(fileArray);
    return true;
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // When component is initally loaded
  useEffect(() => {
    auth();
    setIsLoading(true);
    loadPlaylist();
    loadPlaylistSongs();
    loadAllSongs();
  }, []);

  // If there is no song currently being played, play the first one in the playlist
  useEffect(() => {
    const isFirstSong = appContext?.song === null;
    if (isFirstSong && playlistSongs && playlistSongs[0]) {
      if (playlistSongs[0].id) {
        changeSong(playlistSongs[0]);
      }
    }
  }, [playlistSongs]);

  // When songs from playlist are in state, we are done loading
  useEffect(() => {
    if (isLoading && playlistSongs && playlistSongs[0].id) {
      setIsLoading(false);
    }
    if (isAdding) {
      filterSongs();
    }
  }, [playlistSongs]);

  // Filter songs when user query changes
  useEffect(() => {
    if (isAdding) {
      filterSongs();
    }
  }, [query]);

  // Filter songs when allSongs is updated
  useEffect(() => {
    if (allSongs) {
      filterSongs();
    }
  }, [allSongs]);

  const songs = isAdding ? filteredSongs : playlistSongs;

  return (
    <PlaylistCtx.Provider
      value={{
        playlist,
        playlistSongs,
        allSongs,
        filteredSongs,
        uploadedFiles,
        setUploadedFiles,
        query,
        setQuery,
        loadPlaylistSongs,
        loadAllSongs,
        addSongToCurrentPlaylist,
        changeSong,
        selectedSongID,
        setSelectedSongID,
        userID,
        isAdding,
        isLoading,
        isEditing,
        bodyType,
        setBodyType,
        handleUploadedFiles,
        handleQueryChange,
      }}
    >

      {/* TODO: Move top bar to App component */ }
      <BackButton />
      <UserMenu userID={userID} options={menuOptions} />

      {playlist && playlist.name && (
        <div className="title editableName">
          <form onSubmit={changePlaylistName}>
            <input
              value={playlist.name}
              onChange={(e) => {
                const updatedPlaylist = { ...playlist };
                updatedPlaylist.name = e.target.value;
                setPlaylist(updatedPlaylist);
              }}
              disabled={!userID}
            />
            <button aria-label="submit" type="submit" className="submit" />
          </form>
        </div>
      )}
      <Accordion>
        {songs && songs.map((song: Song) => (
          <Item
            key={`accordion-item-${song.id}-${playlist?.id || '-1'}`}
            song={song}
            isSelected={selectedSongID === song.id}
          >
            <ItemHeader />
            <ItemBody />
          </Item>
        ))}
      </Accordion>
    </PlaylistCtx.Provider>
  );
};

export default PlaylistPage;
