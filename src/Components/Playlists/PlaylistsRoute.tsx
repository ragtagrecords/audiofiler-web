import React from 'react';
import styles from 'Styles/main.module.scss';
import Playlists from './Playlists';
import AddButton from '../Common/AddButton';

const PlaylistsRoute = () => {
  return (
    <>
      <h1 className={styles.title}>Playlists</h1>
      <Playlists />
      <AddButton href="/edit/playlist" />
    </>
  );
};

export default PlaylistsRoute;
