import React, { useState } from 'react';
import axios from 'axios';
import './LoginRoute.scss';
import { useNavigate } from 'react-router-dom';

const LoginRoute = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const handleChange = (e: any) => {
    if (!e || !e.target || !e.target.className) {
      console.log('Error saving inputs');
    }
    const { className } = e.target;
    if (className === 'usernameInput') {
      setUsername(e.target.value);
    } else if (className === 'passwordInput') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username) {
      setError('Username is not valid!');
      return false;
    }
    if (!password) {
      setError('Password is not valid!');
      return false;
    }
    setError('');
    const formData = new FormData();

    // add songs to form data
    formData.append('username', username);
    formData.append('password', password);

    // post files and info to API
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(
        `${baseUrl}public/login`,
        formData,
      );
      console.log(res);
      setError('Logged In!');
      navigate('/playlists');
      return true;
    } catch (ex) {
      setError('Failed to login!');
      console.log(ex);
      return false;
    }
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div
          className="error"
        >{error}
        </div>
        <label>Username
          <input
            type="text"
            value={username}
            className="usernameInput"
            name="username"
            onChange={handleChange}
          />
        </label>
        <label>Password
          <input
            type="password"
            value={password}
            className="passwordInput"
            name="password"
            onChange={handleChange}
          />
        </label>
        <button
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginRoute;
