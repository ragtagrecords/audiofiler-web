import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import './OptionButton.scss';

type OptionButtonProps = {
    username: string;
    setBodyType: any;
    setIsBodyOpen: any;
}

const OptionButton = ({ setBodyType, setIsBodyOpen }: OptionButtonProps) => {
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
        setIsBodyOpen(true);
      }}
    >
      <IconContext.Provider value={iconStyles}>
        <BiDotsVerticalRounded />
      </IconContext.Provider>
    </button>
  );
};

export default OptionButton;
