import React, { useState } from 'react';
import './AuthForm.scss';
import { signup } from 'Services/AuthSvc';
import { useNavigate } from 'react-router-dom';
import BackButton from 'Components/Common/BackButton/BackButton';

const SignupRoute = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  // TODO: Actually use the message in form
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
    } else if (className === 'confirmPasswordInput') {
      setConfirmPassword(e.target.value);
    }
  };

  const hasSpecialCharAndNumber = (str: string) => {
    const hasSpecialChar = !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?]/g.test(str);
    const hasNumber = /\d/.test(str);
    return hasSpecialChar && hasNumber;
  };

  const validateForm = () => {
    let message = '';
    if (!username || !password || !confirmPassword) {
      message = 'All field required!';
    } else if (username.length < 6) {
      message = 'Username must be at least 6 characters';
    } else if (password !== confirmPassword) {
      message = 'Passwords must match';
    } else if (password.length < 15 || !hasSpecialCharAndNumber) {
      message = 'Password must use a special character and a number, or be at least 15 characters';
    } else if (password.length < 8) {
      message = 'Password must be at least 8 characters';
    }
    setMessage(message);
    return message === '';
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const isFormValid = validateForm();

    if (!isFormValid) {
      return false;
    }

    const wasUserCreated = signup(username, password);
    if (!wasUserCreated) {
      setMessage('Failed to create user :( Please try again or reach out');
      return false;
    }

    // If signup was successful, redirect to home page
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
          <label>
            <h4>Confirm Password</h4>
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
