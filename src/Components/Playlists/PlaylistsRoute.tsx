import React from 'react';
import Playlists from './Playlists';
import AddButton from '../Common/AddButton';
import './PlaylistsRoute.scss';

const PlaylistsRoute = () => {
  return (
    <>
      <h1 className="title">Playlists</h1>
      <Playlists />
      <AddButton href="/edit/playlist" />
    </>
  );
};

export default PlaylistsRoute;
