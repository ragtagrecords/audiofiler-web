import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Gallery from './routes/Gallery';
import Home from './routes/Home';
import Manager from './routes/Manager';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='gallery/*' element={<Gallery />} />
        <Route path='manager/*' element={<Manager />} />
      </Routes>
    </Router>
  );
}