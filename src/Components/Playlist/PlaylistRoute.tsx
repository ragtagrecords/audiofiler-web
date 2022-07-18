import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption, Playlist, Song } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { getSongs } from 'Services/SongSvc';
import { getPlaylistByID, updatePlaylist } from 'Services/PlaylistSvc';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import Accordion from 'Components/Playlist/Accordion/Accordion';
import BackButton from 'Components/Common/BackButton/BackButton';
import { AppCtx } from 'App/App';
import './PlaylistRoute.scss';

type PlaylistRouteParams = {
  playlistID: string;
}

const PlaylistRoute = () => {
  // Get playlistID from query params
  const { playlistID } = useParams<PlaylistRouteParams>();
  const appContext = useContext(AppCtx);

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[] | null>(null);
  const [selectedSongID, setSelectedSongID] = useState<number>(0);
  const [userID, setUserID] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  // When component is initally loaded
  useEffect(() => {
    auth();
    setIsLoading(true);
    loadPlaylist();
    loadPlaylistSongs();
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
  }, [playlistSongs]);

  return (
    <>
      <BackButton />
      <UserMenu userID={userID} options={menuOptions} />

      {playlist && playlist.name
        && (
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
      <Accordion
        selectedSongID={selectedSongID}
        setSelectedSongID={setSelectedSongID}
        playlist={playlist}
        playlistSongs={playlistSongs}
        isAdding={isAdding}
        isLoading={isLoading}
        isEditing={isEditing}
        loadPlaylistSongs={loadPlaylistSongs}
        changeSong={changeSong}
      />
    </>
  );
};

export default PlaylistRoute;
