import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import './IconButton.scss';

type IconButtonProps = {
  type: 'save' | 'cancel';
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({ type, onClick }: IconButtonProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '26px',
  }), []);

  let icon = null;

  switch (type) {
    case 'save':
      icon = <AiOutlineCheck />;
      break;
    case 'cancel':
      icon = <AiOutlineClose />;
      break;
    default:
      return null;
  }

  return (
    <button
      type="button"
      className="iconButton"
      onClick={onClick}
    >
      <IconContext.Provider value={iconStyles}>
        {icon}
      </IconContext.Provider>
    </button>
  );
};

export default IconButton;
