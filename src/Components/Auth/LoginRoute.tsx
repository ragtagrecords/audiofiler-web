import React, { useState } from 'react';
import './AuthForm.scss';
import { useNavigate } from 'react-router-dom';
import { authorize } from 'Services/AuthSvc';
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

  const validateForm = () => {
    let message = '';
    if (!username) {
      message = 'Must enter a username!';
    } else if (!password) {
      message = 'Password is not valid!';
    }
    setMessage(message);
    return message === '';
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    validateForm();
    const isAuthorized = await authorize(username, password);
    if (!isAuthorized) {
      setMessage('Failed to login!');
      return false;
    }
    navigate('/playlists');
    return true;
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
          <label>
            <h4>Username</h4>
            <input
              type="text"
              value={username}
              className="usernameInput"
              name="username"
              onChange={handleChange}
            />
          </label>
          <label>
            <h4>Password</h4>
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
