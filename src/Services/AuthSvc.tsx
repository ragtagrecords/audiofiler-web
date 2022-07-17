import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

export const authenticate = async (): Promise<number> => {
  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    console.log('No access token found in local storage, try logging in again');
    return 0;
  }

  let res;
  try {
    res = await axios.get(
      `${baseURL}/authenticate`,
      {
        headers: {
          'x-access-token': accessToken,
        },
      },
    );
  } catch (e) {
    return 0;
  }

  if (res.data.auth) {
    return res.data.userID;
  }
  localStorage.clear();
  return 0;
};

export const logout = async () => {
  await localStorage.clear();
  return true;
};

// Returns true if the credentials are valid, false otherwise
export const authorize = async (username: string, password: string) => {
  const formData = new FormData();

  // add songs to form data
  formData.append('username', username);
  formData.append('password', password);

  let res;
  try {
    res = await axios.post(
      `${baseURL}/authorize`,
      formData,
    );
  } catch (ex) {
    console.log(ex);
    return false;
  }
  if (!res.data.auth || !res.data.token) {
    return false;
  }
  await localStorage.setItem('token', res.data.token);
  await localStorage.setItem('username', username);
  return true;
};

// Returns true if the credentials are valid, false otherwise
export const signup = async (username: string, password: string) => {
  const formData = new FormData();

  // add songs to form data
  formData.append('username', username);
  formData.append('password', password);

  let res = null;
  try {
    res = await axios.post(
      `${baseURL}/users`,
      formData,
    );
  } catch (ex) {
    console.log(ex);
    return false;
  }

  // user wasnt created
  if (!res.data.added) {
    return false;
  }

  // user created but couldnt login for some reason
  if (!res.data.token) {
    return false;
  }

  await localStorage.setItem('token', res.data.token);
  await localStorage.setItem('username', username);
  return true;
};
