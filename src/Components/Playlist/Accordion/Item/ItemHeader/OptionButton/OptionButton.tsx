import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { BiDotsVerticalRounded } from 'react-icons/bi';

type OptionButtonProps = {
    username: string;
    setBodyType: any;
    setIsOpen: any;
}

const OptionButton = ({ setBodyType, setIsOpen }: OptionButtonProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '40px',
  }), []);

  return (
    <button
      type="button"
      className="optionButton"
      onClick={() => {
        setBodyType('versions');
        setIsOpen(true);
      }}
    >
      <IconContext.Provider value={iconStyles}>
        <BiDotsVerticalRounded />
      </IconContext.Provider>
    </button>
  );
};

export default OptionButton;
