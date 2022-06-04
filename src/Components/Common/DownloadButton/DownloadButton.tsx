import React from 'react';
import downloadButton from 'Assets/blue-download-arrow.png';
import axios from 'axios';
import './DownloadButton.scss';

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
  return (
    <button
      type="button"
      className="downloadButton"
      onClick={downloadFile}
    >
      <img
        alt="downloadButtonIcon"
        className="downloadButtonIcon"
        src={downloadButton}
      />
    </button>
  );
};

export default DownloadButton;
