import React from 'react';
import { Link } from 'react-router-dom';

import '../globalstyle.module.css';
import styles from './home.module.css';

const Home = () => {
  return (
    <>
      <nav>
        <ul className={styles.container}>
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