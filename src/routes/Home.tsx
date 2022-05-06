import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/playlists">Playlists</Link>
          </li>
          <li>
            <Link to="/manager">Manager</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
  
export default Home;