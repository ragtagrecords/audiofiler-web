import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import AddSongsRoute from 'Components/AddSongs/AddSongsRoute';
import AddPlaylistRoute from 'Components/AddPlaylist/AddPlaylistRoute';
import PlaylistRoute from 'Components/Playlist/PlaylistRoute';
import PlaylistsRoute from 'Components/Playlists/PlaylistsRoute';
import LoginRoute from 'Components/Auth/LoginRoute';
import SignupRoute from 'Components/Auth/SignupRoute';
import { App } from './App/App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <App>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlaylistsRoute />} />
          <Route path="/playlists" element={<PlaylistsRoute />} />
          <Route path="/playlists/:playlistID" element={<PlaylistRoute />} />
          <Route path="/playlists/add" element={<AddPlaylistRoute />} />
          <Route path="/songs/add" element={<AddSongsRoute />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/login" element={<LoginRoute />} />
        </Routes>
      </BrowserRouter>
    </App>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
