import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Playlists.scss';
import { Playlist } from 'Types';

const Playlists = () => {
  const defaultPlaylist = {
    id: 0,
    name: '',
  };

  const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);

  const getPlaylists = (): void => {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    axios
      .get(`${baseUrl}public/playlists`)
      .then((response) => {
        if (!response.data) {
          console.log("Couldn't retrieve playlists");
          return;
        }
        setPlaylists(response.data);
      });
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <div className="playlists">
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
