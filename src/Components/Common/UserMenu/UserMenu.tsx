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

type UserMenuProps = {
  userID: number;
  options: MenuOption[];
}

// When logged in
const UserOptions = (props: UserMenuProps) => {
  const navigate = useNavigate();

  const handleNavigate = (option: MenuOption) => {
    navigate(option.href, {
      state: option.state,
    });
  };

  const handleLogout = async () => {
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
              ? <a onClick={option.onClick}>{option.text}</a>
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

const UserMenu = (props: UserMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '75px',
  }), []);

  const handleClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="userMenuContainer">

      {/* Menu Icon */}
      <IconContext.Provider value={iconStyles}>
        <button type="button" onClick={handleClick} className="userMenuButton">
          <BiDotsVerticalRounded />
        </button>
      </IconContext.Provider>

      {/* Options that show on click */}
      <div className={`optionsContainer ${isMenuOpen ? 'show' : ''}`}>
        {props.userID
          ? <UserOptions options={props.options} userID={props.userID} />
          : <LoginOptions />}
      </div>
    </div>
  );
};

export default UserMenu;
