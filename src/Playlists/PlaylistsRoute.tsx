import React from 'react';
import Playlists from './Playlists';
import AddButton from '../Common/AddButton';

import styles from '../global.module.scss';

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
