import React, { useState } from 'react';
import axios from 'axios';

const LoginRoute = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

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

    if (!username || !password) {
      console.log('Necessary info not found');
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
        `${baseUrl}public/login`,
        formData,
      );
      console.log(res);
      return true;
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };
  return (
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
          type="text"
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
  );
};

export default LoginRoute;
