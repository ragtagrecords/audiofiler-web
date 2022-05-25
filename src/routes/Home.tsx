import React from "react";
import { Link } from "react-router-dom";

import "../globalstyle.module.css";
import styles from "./home.module.css";

const Home = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.primeBtn}>
            <Link to="/playlists">Playlists</Link>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.primeBtn}>
            <Link to="/manager">Manager</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
