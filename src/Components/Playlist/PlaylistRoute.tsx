import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Playlist, Song } from 'Types';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import Accordion from '../Common/Accordion/Accordion';
import AddButton from '../Common/AddButton';
import BackButton from '../Common/BackButton/BackButton';
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
  const [song, setSong] = useState<Song>(defaultSong);

  const findSongByID = (id: number) => {
    let match = null;
    songs.forEach((song) => {
      if (song.id === id) {
        match = song;
      }
    });
    return match;
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
    setSong(songToPlay);
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
        // setPlaylist(data);
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
    const currentSongIndex = findIndexBySongID(song.id);
    if (!currentSongIndex) {
      return;
    }
    setSong(songs[currentSongIndex + 1]);
  };

  const prevSong = () => {
    const currentSongIndex = findIndexBySongID(song.id);
    if (!currentSongIndex) {
      return;
    }
    setSong(songs[currentSongIndex - 1]);
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
      setSong(songs[0]);
    }
  }, [songs]);

  return (
    <>
      <BackButton />
      <AddButton href="/songs/add" />
      {playlist && playlist.name
        && <h1 className="title">{playlist.name}</h1>}
      <Accordion
        newItemID={song.id}
        songs={songs}
        onItemClick={onSongClick}
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
