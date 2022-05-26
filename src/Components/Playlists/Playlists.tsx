import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import styles from '../../global.module.scss';
import { Playlist } from '../../Types';

const Playlists = () => {
  const defaultPlaylist = {
    id: 0,
    name: '',
  };

  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);

  const getPlaylists = (): void => {
    // TODO: handle error
    axios
      .get('http://api.ragtagrecords.com/public/playlists')
      .then((response) => {
        setPlaylists(response.data);
      });
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <div className={styles.playlists}>
      <ul>
        {playlists && playlists[0].name
            && playlists.map((playlist: Playlist) => {
              return (
                <li key={playlist.name}>
                  <Link to={`/playlists/${playlist.id}`}>
                    {playlist.name}
                  </Link>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default Playlists;
