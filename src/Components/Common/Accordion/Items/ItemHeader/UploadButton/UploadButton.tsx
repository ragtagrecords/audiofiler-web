import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { FiUpload } from 'react-icons/fi';

// import './UploadButton.scss';

type UploadAreaProps = {
    handleClick: React.MouseEventHandler<HTMLButtonElement>;
}

const UploadButton = ({ handleClick }: UploadAreaProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '25px',
  }), []);

  return (
    <button
      type="button"
      className="uploadButton"
      onClick={handleClick}
    >
      <IconContext.Provider value={iconStyles}>
        <FiUpload />
      </IconContext.Provider>
    </button>
  );
};

export default UploadButton;
