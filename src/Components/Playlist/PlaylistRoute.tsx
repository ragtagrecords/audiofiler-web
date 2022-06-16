import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import { MenuOption, Playlist, Song } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import Accordion from 'Components/Common/Accordion/Accordion';
import BackButton from 'Components/Common/BackButton/BackButton';
import './PlaylistRoute.scss';
import { updateSongName, updatePlaylistName } from 'Services/SongSvc';

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
    console.log('adding existing songs!`');
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

  const findSongByID = (id: number) => {
    let match = null;
    songs.forEach((song) => {
      if (song.id === id) {
        match = song;
      }
    });
    return match;
  };

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

  // TODO: figure out how to tell which song was clicked
  const onSongClick = (songID: number): void => {
    if (!songID) {
      console.log('Failed to change song');
    }

    const songToPlay = findSongByID(songID);
    if (!songToPlay) {
      return;
    }
    setSong(songToPlay);
  };

  const loadPlaylist = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}public/playlists`)
      .then((response) => response.json())
      .then((playlists) => {
        playlists.forEach((playlist: Playlist) => {
          if (playlistID && playlist.id === parseInt(playlistID, 10)) {
            setPlaylist(playlist);
            setNewPlaylistName(playlist.name);
          }
        });
      });
  };

  const loadSongs = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}public/playlists/${playlistID}`)
      .then((response) => response.json())
      .then((songs) => {
        if (songs.length) {
          setSongs(songs);
        } else {
          setIsLoading(false);
        }
      });
  };

  // ensures index is valid for the current # of songs
  const validIndex = (i: number) => {
    const maxIndex = songs.length;
    const remainder = Math.abs(i % maxIndex);
    // if index was negative, return the difference
    return i >= 0 ? remainder : songs.length - remainder;
  };

  const skipSong = () => {
    // find index of current song based on id
    const currentSongIndex = findIndexBySongID(song.id);
    if (currentSongIndex === -1) {
      return;
    }
    // change song to new index
    const newSongIndex = validIndex(currentSongIndex + 1);
    setSong(songs[newSongIndex]);
  };

  const prevSong = () => {
    const currentSongIndex = findIndexBySongID(song.id);
    if (currentSongIndex === -1) {
      return;
    }
    const newSongIndex = validIndex(currentSongIndex - 1);
    setSong(songs[newSongIndex]);
  };

  const onSongEnded = () => {
    skipSong();
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
      console.log(newPlaylistName);
      alert('Name updated successfully.');
      await updatePlaylistName(playlist.id, newPlaylistName);
    }
    loadPlaylist();
  };

  // load new playlist when ID changes
  useEffect(() => {
    loadPlaylist();
    loadSongs();
  }, [playlistID]);

  // load first song if songs change
  useEffect(() => {
    if (songs[0]) {
      setSong(songs[0]);
    }
  }, [songs]);

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
        newItemID={song.id}
        playlist={playlist}
        playlistSongs={songs}
        onItemClick={onSongClick}
        isAdding={isAdding}
        isLoading={isLoading}
        refreshPlaylistSongs={loadSongs}
      />
      {song && song.name !== ''
        && (
          <AudioPlayer
            song={song}
            onSongEnded={onSongEnded}
            skipSong={skipSong}
            prevSong={prevSong}
          />
        )}
    </>
  );
};

export default PlaylistRoute;
