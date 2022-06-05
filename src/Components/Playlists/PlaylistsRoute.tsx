import React, { useEffect, useState } from 'react';
import UserMenu from 'Components/Common/UserMenu/UserMenu';
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
        <h4>Playlists</h4>
      </div>
      <Playlists />
      <UserMenu userID={userID} options={menuOptions} />
      {/* body */}
      <Playlists />
    </>
  );
};

export default PlaylistsRoute;
