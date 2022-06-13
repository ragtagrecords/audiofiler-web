import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { FiDownload } from 'react-icons/fi';
import './DownloadButton.scss';

type DownloadButtonProps = {
    href: string;
    fileName: string;
    handleClick: React.MouseEventHandler<HTMLButtonElement>;
}

const DownloadButton = ({ handleClick }: DownloadButtonProps) => {
  // Without this function, file opens in new tab
  // Creates a new link using a Blob instead of href and clicks it
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '26px',
  }), []);

  return (
    <button
      type="button"
      className="downloadButton"
      onClick={handleClick}
    >
      <IconContext.Provider value={iconStyles}>
        <FiDownload />
      </IconContext.Provider>
    </button>
  );
};

export default DownloadButton;
