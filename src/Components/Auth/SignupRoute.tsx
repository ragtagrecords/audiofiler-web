import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.scss';
import { useNavigate } from 'react-router-dom';
import BackButton from 'Components/Common/BackButton/BackButton';

const SignupRoute = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
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
    } else if (className === 'confirmPasswordInput') {
      setConfirmPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      console.log('Necessary info not found');
      return false;
    }

    if (password !== confirmPassword) {
      console.log('Passwords dont match');
      return false;
    }

    const formData = new FormData();

    // add songs to form data
    formData.append('username', username);
    formData.append('password', password);

    // post files and info to API
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(
        `${baseUrl}public/signup`,
        formData,
      );
      navigate('/playlists');
      console.log(res);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };
  return (
    <>
      <BackButton />
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label> Username
            <input
              type="text"
              value={username}
              className="usernameInput"
              name="username"
              onChange={handleChange}
            />
          </label>
          <label> Password
            <input
              type="password"
              value={password}
              className="passwordInput"
              name="password"
              onChange={handleChange}
            />
          </label>
          <label> Confirm Password
            <input
              type="password"
              value={confirmPassword}
              className="confirmPasswordInput"
              name="confirmPassword"
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
    </>
  );
};

export default SignupRoute;
