import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistAccordion from '../components/Playlists/PlaylistAccordion';

type PlaylistViewParams = {
  playlistID: string;
}

const PlaylistView = () => {
  let { playlistID } = useParams<PlaylistViewParams>();
  if (playlistID == undefined) {
    playlistID = '1';
  }
  return (
    <>
      <h1>Playlists</h1>
      <PlaylistAccordion playlistID={playlistID}/>
    </>
  );
}

export default PlaylistView;
