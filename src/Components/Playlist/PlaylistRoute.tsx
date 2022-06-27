import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MenuOption, Playlist, Song } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import { getSongs } from 'Services/SongSvc';
import { getPlaylistByID, updatePlaylist } from 'Services/PlaylistSvc';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import Accordion from 'Components/Common/Accordion/Accordion';
import BackButton from 'Components/Common/BackButton/BackButton';
import './PlaylistRoute.scss';

type PlaylistRouteParams = {
  playlistID: string;
}

const PlaylistRoute = () => {
  // Get playlistID from query params
  const { playlistID } = useParams<PlaylistRouteParams>();

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[] | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [selectedSongID, setSelectedSongID] = useState<number>(0);
  const [userID, setUserID] = useState<number>(0);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

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

  /// given a songID, finds the index in playlistSongs array
  const findIndexBySongID = (id: number) => {
    if (!playlistSongs) { 'ERROR: no songs in playlist'; return false; }
    let index = -1;
    for (let i = 0; i < playlistSongs.length; i += 1) {
      if (playlistSongs[i].id === id) {
        index = i;
      }
    }
    return index;
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

  // Ensures index is valid for the current # of playlistSongs
  const validIndex = (i: number) => {
    if (!playlistSongs) { console.log('ERROR: no songs in playlist'); return 0; }
    const maxIndex = playlistSongs.length;
    const remainder = Math.abs(i % maxIndex);
    // If index was negative, return the difference
    return i >= 0 ? remainder : playlistSongs.length - remainder;
  };

  // Used for skipping and going to previous playlistSongs
  const changeSongRelativeToCurrent = (relativeIndexOfNewSong: number) => {
    const currentSongIndex = findIndexBySongID(selectedSongID);

    if (!currentSongIndex) {
      console.log('Could not determine index of currently selected song');
      return false;
    }
    if (!playlistSongs) { console.log('ERROR: no songs in playlist'); return 0; }
    const newSongIndex = validIndex(currentSongIndex + relativeIndexOfNewSong);
    const newSong = playlistSongs[newSongIndex];

    if (!newSong.id) {
      console.log('Could not find valid ID for new song');
      return false;
    }

    setSong(newSong);
    setSelectedSongID(newSong.id);
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

  // Load first song if playlistSongs change
  useEffect(() => {
    if (playlistSongs && playlistSongs[0]) {
      if (playlistSongs[0].id) {
        changeSong(playlistSongs[0]);
      }
    }
  }, [playlistSongs]);

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
        loadPlaylistSongs={loadPlaylistSongs} // TODO:
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
