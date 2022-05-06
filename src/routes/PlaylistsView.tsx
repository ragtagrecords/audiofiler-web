import React from 'react';
import Playlists from '../components/Playlists/Playlists';

export default class PlaylistsView extends React.Component {
  render() {
    return (
      <>
        <h1>Playlists</h1>
        <Playlists />
      </>
    );
  }
}
