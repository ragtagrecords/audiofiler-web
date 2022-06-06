import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import { MenuOption, Playlist, Song } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import Accordion from 'Components/Common/Accordion/Accordion';
import BackButton from 'Components/Common/BackButton/BackButton';
import './PlaylistRoute.scss';

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
  const [currentSongID, setCurrentSongID] = useState<number>(0);
  const [userID, setUserID] = useState<number>(0);

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  useEffect(() => {
    auth();
  }, []);

  const menuOptions: MenuOption[] = [
    {
      href: '/songs/add',
      text: 'Upload songs',
      state: { playlist },
    },
  ];

  const findSongByID = (id: number): Song | false => {
    let match = null;
    songs.forEach((song) => {
      if (song.id === id) {
        match = song;
      }
    });
    return match ?? false;
  };

  const findIndexBySongID = (id: number) => {
    let index = null;
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
    setCurrentSongID(songToPlay.id);
  };

  const loadPlaylist = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}public/playlists`)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((playlistInfo: Playlist) => {
          if (playlistID && playlistInfo.id === parseInt(playlistID, 10)) {
            setPlaylist(playlistInfo);
          }
        });
      });
  };

  const loadSongs = () => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    fetch(`${baseUrl}public/playlists/${playlistID}`)
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
      });
  };

  const skipSong = () => {
    const currentSongIndex = findIndexBySongID(currentSongID);
    if (!currentSongIndex) {
      return;
    }
    setCurrentSongID(songs[currentSongIndex + 1].id);
  };

  const prevSong = () => {
    const currentSongIndex = findIndexBySongID(currentSongID);
    if (!currentSongIndex) {
      return;
    }
    setCurrentSongID(songs[currentSongIndex - 1].id);
  };

  const onSongEnded = () => {
    skipSong();
  };

  // load new playlist when ID changes
  useEffect(() => {
    loadPlaylist();
    loadSongs();
  }, [playlistID]);

  // load first song if songs change
  useEffect(() => {
    if (songs[0]) {
      setCurrentSongID(songs[0].id);
    }
  }, [songs]);

  return (
    <>
      <BackButton />
      <UserMenu userID={userID} options={menuOptions} />

      {playlist && playlist.name
        && <h1 className="title">{playlist.name}</h1>}
      {songs && songs[0].name
      && (
      <Accordion
        newItemID={songs[currentSongID].id}
        songs={songs}
        onItemClick={onSongClick}
      />
      )}
      {songs && songs[currentSongID].name !== ''
        && (
          <AudioPlayer
            songs={songs}
            index={findIndexBySongID(currentSongID) ?? 0}
            onSongEnded={onSongEnded}
            skipSong={skipSong}
            prevSong={prevSong}
            playlistName={playlist.name}
          />
        )}
    </>
  );
};

export default PlaylistRoute;
