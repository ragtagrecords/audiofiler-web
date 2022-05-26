import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Playlist, Song } from 'Types';
import styles from 'global.module.scss';
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
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

  const onSongClick = (i: number): void => {
    setCurrentSongIndex(i);
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

  const onSongEnded = () => {
    setCurrentSongIndex(currentSongIndex + 1);
  };

  const skipSong = () => {
    setCurrentSongIndex(currentSongIndex + 1);
  };

  const prevSong = () => {
    setCurrentSongIndex(currentSongIndex - 1);
  };

  // load new playlist when ID changes
  useEffect(() => {
    loadPlaylist();
    loadSongs();
  }, [playlistID]);

  useEffect(() => {
    setSong(songs[currentSongIndex]);
  }, [songs]);

  useEffect(() => {
    setSong(songs[currentSongIndex]);
  }, [currentSongIndex]);

  return (
    <>
      {playlist && playlist.name
        && <h1 className={styles.title}>{playlist.name}</h1>}
      <PlaylistAccordion
        songs={songs}
        onSongClick={onSongClick}
      />
    </>
  );
};

export default PlaylistRoute;

/*
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
        */
