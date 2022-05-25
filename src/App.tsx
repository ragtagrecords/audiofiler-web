import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './routes/Home';
import ManagerView from './routes/ManagerView';
import PlaylistView from './routes/PlaylistView';
import PlaylistsView from './routes/PlaylistsView';

export default function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<PlaylistsView />} />
          <Route path='/playlists/' element={<PlaylistsView />} />
          <Route path='/playlists/:playlistID/:playlistName' element={<PlaylistView />} />
          <Route path='manager/*' element={<ManagerView />} />
        </Routes>
    </Router>
  );
}