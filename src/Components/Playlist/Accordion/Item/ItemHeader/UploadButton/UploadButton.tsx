import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { FiUpload } from 'react-icons/fi';

// import './UploadButton.scss';

type UploadButtonProps = {
    onClick: any;
}

const UploadButton = ({ onClick }: UploadButtonProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '25px',
  }), []);

  return (
    <button
      type="button"
      className="uploadButton"
      onClick={onClick}
    >
      <IconContext.Provider value={iconStyles}>
        <FiUpload />
      </IconContext.Provider>
    </button>
  );
};

export default UploadButton;
