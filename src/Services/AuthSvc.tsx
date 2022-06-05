import axios from 'axios';

export const authenticate = async (): Promise<number> => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    console.log('No access token found in local storage, try logging in again');
    return 0;
  }

  let res;
  try {
    res = await axios.get(
      `${baseUrl}public/authenticate`,
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
  return 0;
};

export const logout = () => {
  localStorage.removeItem('token');
};
