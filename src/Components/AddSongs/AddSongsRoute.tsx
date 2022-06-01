import React from 'react';
import { Playlist } from 'Types';
import { useLocation } from 'react-router-dom';
import BackButton from 'Components/Common/BackButton/BackButton';
import AddSongsForm from './AddSongsForm/AddSongsForm';

type LocationState = {
  playlist?: Playlist;
}

const AddSongsRoute = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  if (state && state.playlist) {
    return (
      <>
        <BackButton href="/playlists/add" />
        <AddSongsForm playlist={state.playlist ? state.playlist : undefined} />
      </>
    );
  }

  return (
    <>
      <BackButton href="/playlists/add" />
      <AddSongsForm />
    </>
  );
};

export default AddSongsRoute;
