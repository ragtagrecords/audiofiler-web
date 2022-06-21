import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import { MenuOption, Playlist, Song } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { getSongsByPlaylistID, updatePlaylistName } from 'Services/SongSvc';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import Accordion from 'Components/Common/Accordion/Accordion';
import BackButton from 'Components/Common/BackButton/BackButton';
import './PlaylistRoute.scss';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

type PlaylistRouteParams = {
  playlistID: string;
}

const PlaylistRoute = () => {
  const defaultSong: Song = {
    id: 0,
    name: '',
    path: '',
    artist: '',
    tempo: 0,
  };
  const defaultPlaylist: Playlist = {
    id: 0,
    name: '',
  };
  const { playlistID } = useParams<PlaylistRouteParams>();
  const [playlist, setPlaylist] = useState<Playlist>(defaultPlaylist);
  const [songs, setSongs] = useState<Array<Song>>([defaultSong]);
  const [song, setSong] = useState<Song>(defaultSong);
  const [selectedSongID, setSelectedSongID] = useState<number>(0);
  const [userID, setUserID] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  useEffect(() => {
    auth();
  }, []);

  const onSongAddClick = () => {
    setIsAdding(!isAdding);
  };

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
  ];

  /// given a songID, finds the index in songs array
  const findIndexBySongID = (id: number) => {
    let index = -1;
    for (let i = 0; i < songs.length; i += 1) {
      if (songs[i].id === id) {
        index = i;
      }
    }
    return index;
  };

  // Fetch playlist info from API
  const loadPlaylists = async () => {
    try {
      const response = await fetch(`${baseUrl}public/playlists`);
      const playlists = await response.json();
      playlists.forEach((playlist: Playlist) => {
        if (playlistID && playlist.id === parseInt(playlistID, 10)) {
          setPlaylist(playlist);
          setNewPlaylistName(playlist.name);
        }
      });
    } catch (ex) {
      console.log('Failed to fetch playlist info');
    }
  };

  // Fetch song info from API
  const loadSongs = async () => {
    if (!playlistID) {
      console.log('Cannot load songs without a playlistID');
      return false;
    }
    const songs = await getSongsByPlaylistID(playlistID);

    if (songs) {
      setSongs(songs);
    } else {
      setIsLoading(false);
    }
    return true;
  };

  // Used locally and by children to change which song is playing
  const changeSong = (song: Song, isChild = false) => {
    if (!song.id) {
      console.log('Failed to change song!');
      return false;
    }

    setSong(song);
    if (!isChild) {
      setSelectedSongID(song.id);
    }
    return true;
  };

  // Ensures index is valid for the current # of songs
  const validIndex = (i: number) => {
    const maxIndex = songs.length;
    const remainder = Math.abs(i % maxIndex);
    // If index was negative, return the difference
    return i >= 0 ? remainder : songs.length - remainder;
  };

  // Used for skipping and going to previous songs
  const changeSongRelativeToCurrent = (relativeIndexOfNewSong: number) => {
    const currentSongIndex = findIndexBySongID(selectedSongID);

    if (currentSongIndex === -1) {
      console.log('Could not determine index of currently selected song');
      return false;
    }

    const newSongIndex = validIndex(currentSongIndex + relativeIndexOfNewSong);
    const newSong = songs[newSongIndex];

    if (!newSong.id) {
      console.log('Could not find valid ID for new song');
      return false;
    }

    setSong(newSong);
    setSelectedSongID(newSong.id);
    return true;
  };

  // updating playlist name
  const handleNewPlaylistName = (e : React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setNewPlaylistName(target.value);
  };

  const changePlaylistName = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const emptyString = newPlaylistName === '';
    const startsWithSpace = newPlaylistName.length > 0 && newPlaylistName[0] === ' ';
    const endsWithSpace = newPlaylistName.length > 0 && newPlaylistName.slice(-1) === ' ';

    if (emptyString) {
      alert('Playlist name can not be empty.');
    } else if (startsWithSpace || endsWithSpace) {
      alert('Playlist name can not start or end with spaces.');
    } else {
      alert('Name updated successfully.');
      await updatePlaylistName(playlist.id, newPlaylistName);
    }
    loadPlaylists();
  };

  // Load new playlist and songs when ID changes
  useEffect(() => {
    loadPlaylists();
    loadSongs();
  }, [playlistID]);

  // Load first song if songs change
  useEffect(() => {
    if (songs[0].id) {
      changeSong(songs[0]);
    }
  }, [songs]);

  // If a song exists in the state, we are no longer loading
  // We should prob find a way to do this without useEffect
  useEffect(() => {
    if (isLoading && song && song.id) {
      setIsLoading(false);
    }
  }, [song]);

  return (
    <>
      <BackButton />
      <UserMenu userID={userID} options={menuOptions} />

      {playlist && playlist.name
        && (
        <div className="title editableName">
          <form onSubmit={changePlaylistName}>
            <input
              value={newPlaylistName}
              onChange={handleNewPlaylistName}
              disabled={!userID}
            />
            <button aria-label="submit" type="submit" className="submit" />
          </form>
        </div>
        )}
      <Accordion
        selectedSongID={selectedSongID}
        setSelectedSongID={setSelectedSongID}
        playlist={playlist}
        playlistSongs={songs}
        isAdding={isAdding}
        isLoading={isLoading}
        refreshPlaylistSongs={loadSongs}
        changeSong={changeSong}
      />
      {song && song.id
        && (
          <AudioPlayer
            song={song}
            skipSong={() => {
              changeSongRelativeToCurrent(1);
            }}
            prevSong={() => {
              changeSongRelativeToCurrent(-1);
            }}
          />
        )}
    </>
  );
};

export default PlaylistRoute;
