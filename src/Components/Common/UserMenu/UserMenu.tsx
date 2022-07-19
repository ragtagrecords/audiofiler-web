import React, {
  useMemo, useState,
} from 'react';
import { MenuOption } from 'Types';
import { logout } from 'Services/AuthSvc';
import { IconContext } from 'react-icons';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import './UserMenu.scss';

// When not logged in
const LoginOptions = () => {
  return (
    <ul>
      <li>
        <Link to="/login">
          Login
        </Link>
      </li>
      <li>
        <Link to="/signup">
          Sign Up
        </Link>
      </li>
    </ul>
  );
};

type UserOptionsProps = {
  userID: number;
  options: MenuOption[];
  openOrCloseMenu: any;
}

// When logged in
const UserOptions = (props: UserOptionsProps) => {
  const navigate = useNavigate();

  const handleNavigate = (option: MenuOption) => {
    navigate(option.href, {
      state: option.state,
    });
  };

  const onClick = (option: MenuOption) => {
    props.openOrCloseMenu();
    option.onClick();
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  return (
    <ul>
      {/* Options from props */}
      {props.options.map((option: MenuOption) => {
        return (
          <li key={`menu-option-${option.text}`}>
            {option.onClick
              ? <a onClick={onClick.bind(null, option)}>{option.text}</a>
              : <a onClick={handleNavigate.bind(null, option)}>{option.text}</a>}

          </li>
        );
      })}
      {/* Logout option */}
      <li key="menu-option-logout">
        <a
          type="button"
          onClick={handleLogout}
        >
          Logout
        </a>
      </li>
    </ul>
  );
};

type UserMenuProps = {
  userID: number | null;
  options: MenuOption[];
}

const UserMenu = (props: UserMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '75px',
  }), []);
  const username = localStorage.getItem('username');

  const openOrCloseMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="userMenuContainer">

      {/* Menu Icon */}
      <IconContext.Provider value={iconStyles}>
        <button type="button" onClick={openOrCloseMenu} className="userMenuButton">
          <BiDotsVerticalRounded />
        </button>
      </IconContext.Provider>

      {/* Options that show on click */}
      <div className={`optionsContainer ${isMenuOpen ? 'show' : ''}`}>
        {props.userID && username
          ? (
            <>
              <h2>{username}</h2>
              <hr />
              <UserOptions
                options={props.options}
                userID={props.userID}
                openOrCloseMenu={openOrCloseMenu}
              />
            </>
          )
          : <LoginOptions />}
      </div>
    </div>
  );
};

export default UserMenu;
