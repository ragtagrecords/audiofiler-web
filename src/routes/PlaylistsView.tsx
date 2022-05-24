import React from 'react';
import Playlists from '../components/Playlists/Playlists';
import AddButton from '../components/AddButton';

import '../globalstyle.module.css';
import styles from '../globalstyle.module.css';

export default class PlaylistsView extends React.Component {
  render() {
    return (
      <>
        <h1 className={styles.title}>Playlists</h1>
        <Playlists />
        <AddButton href="/edit/playlist" />
      </>
    );
  }
}
