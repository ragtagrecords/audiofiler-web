import React, { useEffect, useState } from 'react';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
import Logo from 'Assets/audio-logo-192.png';
import { MenuOption } from 'Types';
import { authenticate } from 'Services/AuthSvc';
import Playlists from './Playlists';
import './PlaylistsRoute.scss';

const PlaylistsRoute = () => {
  const [userID, setUserID] = useState<number>(0);

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  useEffect(() => {
    auth();
  }, []);

  const menuOptions: MenuOption[] = [
    {
      href: '/playlists/add',
      text: 'Add playlist',
    },
  ];

  return (
    <>
      <div className="title">
        <img src={Logo} alt="Audiofiler Logo" width="100px" />
      </div>
      <UserMenu userID={userID} options={menuOptions} />
      {/* body */}
      <Playlists />
    </>
  );
};

export default PlaylistsRoute;
