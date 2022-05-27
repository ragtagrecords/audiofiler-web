import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Playlist, Song } from 'Types';
import styles from 'global.module.scss';
import AudioPlayer from 'Components/AudioPlayer/AudioPlayer';
import PlaylistAccordion from './PlaylistAccordion';

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
    fetch('http://api.ragtagrecords.com/public/playlists')
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
    fetch(`http://api.ragtagrecords.com/public/playlists/${playlistID}`)
      .then((response) => response.json())
      .then((data) => setSongs(data));
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
    setSong(songs[0]);
  }, [songs]);

  return (
    <>
      {playlist && playlist.name
        && <h1 className={styles.title}>{playlist.name}</h1>}
      <PlaylistAccordion
        songs={songs}
        onSongClick={onSongClick}
      />
      {song && song.name !== ''
        && (
        <div className={styles.audioPlayer}>
          <AudioPlayer
            song={song}
            onSongEnded={onSongEnded}
            skipSong={skipSong}
            prevSong={prevSong}
          />
        </div>
        )}
    </>
  );
};

export default PlaylistRoute;
