import React, { useMemo } from 'react';
import { IconContext } from 'react-icons';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import './UploadArea.scss';

type UploadAreaProps = {
  handleUpload: React.ChangeEventHandler<HTMLInputElement>;
}

const UploadArea = ({ handleUpload }: UploadAreaProps) => {
  const iconStyles = useMemo(() => ({
    color: '#5ae7ff', // this is tertiaryColor from Styles/vars.. couldnt figure out how to import it
    size: '50px',
  }), []);

  return (
    <div className="uploadArea">
      <IconContext.Provider value={iconStyles}>
        <label>
          click, or drag files to upload!
          <AiOutlineCloudUpload />
          <input type="file" onChange={handleUpload} multiple />
        </label>
      </IconContext.Provider>

    </div>
  );
};

export default UploadArea;
