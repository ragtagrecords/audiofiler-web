import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './routes/Home';
import ManagerView from './routes/ManagerView';
import PlaylistView from './routes/PlaylistView';
import PlaylistsView from './routes/PlaylistsView';
import EditPlaylistView from './routes/EditPlaylistView';

import styles from './globalstyle.module.css';

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/playlists/' element={<PlaylistsView />} />
          <Route path='/playlists/:playlistID' element={<PlaylistView />} />
          <Route path='/manager/*' element={<ManagerView />} />
          <Route path='/edit/playlist/' element={<EditPlaylistView />} />
        </Routes>
    </Router>
  );
}