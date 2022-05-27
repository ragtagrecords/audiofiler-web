import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.scss';
import PlaylistRoute from 'Components/Playlist/PlaylistRoute';
import PlaylistsRoute from 'Components/Playlists/PlaylistsRoute';
import SignupRoute from 'Components/Auth/SignupRoute';
import LoginRoute from 'Components/Auth/LoginRoute';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlaylistsRoute />} />
        <Route path="/playlists" element={<PlaylistsRoute />} />
        <Route path="/playlists/:playlistID" element={<PlaylistRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/login" element={<LoginRoute />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
