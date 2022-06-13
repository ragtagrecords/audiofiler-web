import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { FiUpload } from 'react-icons/fi';
import './AccordionUploadButton.scss';

type AccordionUploadButtonProps = {
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>,
}

const AccordionUploadButton = (props: AccordionUploadButtonProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '25px',
  }), []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.handleUploadedFiles(e);
    return true;
  };

  return (
    <div className="songFileUploadContainer">
      <IconContext.Provider value={iconStyles}>
        <label>
          <FiUpload />
          <input type="file" onChange={handleUpload} />
        </label>
      </IconContext.Provider>

    </div>
  );
};

export default AccordionUploadButton;
