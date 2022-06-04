import axios from 'axios';

const authenticate = async () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const accessToken = localStorage.getItem('token');
  if (!accessToken) {
    console.log('No access token found in local storage, try logging in again');
    return false;
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
    return false;
  }

  if (res.data.auth) {
    return res.data.userID;
  }
  return false;
};

export default authenticate;
