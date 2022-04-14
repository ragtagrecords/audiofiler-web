import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/Gallery">Gallery</Link>
          </li>
          <li>
            <Link to="/Manager">Manager</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
  
export default Home;