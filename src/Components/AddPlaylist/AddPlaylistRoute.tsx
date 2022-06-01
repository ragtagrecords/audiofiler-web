import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddPlaylistRoute.scss';
import BackButton from 'Components/Common/BackButton/BackButton';

const AddPlaylistRoute = () => {
  const [playlistName, setPlaylistName] = useState<string>('');
  const [isAddingSongs, setIsAddingSongs] = useState<boolean>(false);
  const navigate = useNavigate();

  // Whenever inputs change the events are directed here
  // Updates the appropriate state variable with new value from input
  const handleChange = (e: any) => {
    if (!e || !e.target || !e.target.value || !e.target.className) {
      console.log('Failed to submit new playlist');
    } else if (e.target.className === 'playlistNameInput') {
      setPlaylistName(e.target.value);
    } else if (e.target.className === 'addSongsCheckbox') {
      setIsAddingSongs(e.target.checked);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Assemble formData for POST
    const formData = new FormData();
    formData.append('name', playlistName);

    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;

      // POST new playlist to API
      const res = await axios.post(
        `${baseURL}public/playlists`,
        formData,
      );

      // Redirect to add songs page if user checked the box
      if (isAddingSongs) {
        navigate('/songs/add', {
          state: { playlist: res.data },
        });
      } else {
        navigate(`/playlist/${res.data.playlist}`);
      }
      console.log(res);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <>
      <BackButton />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label> Playlist Name
            <input
              onChange={handleChange}
              type="text"
              className="playlistNameInput"
              value={playlistName}
            />
          </label>
          <label> Add songs?
            <input
              onChange={handleChange}
              type="checkbox"
              className="addSongsCheckbox"
              checked={isAddingSongs}
            />
          </label>
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPlaylistRoute;
