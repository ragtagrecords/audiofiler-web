import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import './IconButton.scss';

type IconButtonProps = {
  type: 'save' | 'cancel';
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({ type, onClick }: IconButtonProps) => {
  // Without this function, file opens in new tab
  // Creates a new link using a Blob instead of href and clicks it
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '26px',
  }), []);

  let icon = null;

  if (type === 'save') { icon = <AiOutlineCheck />; }
  if (type === 'cancel') { icon = <AiOutlineClose />; }

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
