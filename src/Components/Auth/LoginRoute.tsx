import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.scss';
import { useNavigate } from 'react-router-dom';
import BackButton from 'Components/Common/BackButton/BackButton';

const LoginRoute = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
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
      setMessage('Username is not valid!');
      return false;
    }
    if (!password) {
      setMessage('Password is not valid!');
      return false;
    }
    setMessage('');
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
      if (!res.data.auth || !res.data.token) {
        setMessage('Failed to login!');
        return false;
      }
      localStorage.setItem('token', res.data.token);
      navigate('/playlists');
      return true;
    } catch (ex) {
      setMessage('Failed to login!');
      return false;
    }
  };
  return (
    <>
      <BackButton />
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <div
            className="message"
          >{message}
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
            <span>Submit</span>
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginRoute;
