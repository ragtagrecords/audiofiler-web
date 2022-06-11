import React, { useMemo } from 'react';
import axios from 'axios';
import './DownloadButton.scss';
import { FiDownload } from 'react-icons/fi';
import { IconContext } from 'react-icons';

type DownloadButtonProps = {
    href: string;
    fileName: string;
}

const DownloadButton = (props: DownloadButtonProps) => {
  // Without this function, file opens in new tab
  // Creates a new link using a Blob instead of href and clicks it
  const downloadFile = () => {
    axios({
      url: props.href,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', props.fileName);
      document.body.appendChild(link);
      link.click();
    });
  };

  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '25px',
  }), []);

  return (
    <div className="downloadButtonContainer" onClick={downloadFile}>
      <IconContext.Provider value={iconStyles}>
        <FiDownload />
      </IconContext.Provider>
    </div>
  );
};

export default DownloadButton;
