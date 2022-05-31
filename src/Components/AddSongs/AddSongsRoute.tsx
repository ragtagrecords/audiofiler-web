import React from 'react';
import { Playlist } from 'Types';
import { useLocation } from 'react-router-dom';
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
        <h1>Manager</h1>
        <AddSongsForm playlist={state.playlist} />
      </>
    );
  }
  return (
    <>
      <h1>Manager</h1>
      <AddSongsForm />
    </>
  );
};

export default AddSongsRoute;
