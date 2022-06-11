import React from 'react';
import { Song } from 'Types';
import AddButton from 'Components/Common/AddButton/AddButton';
import DownloadButton from 'Components/Common/DownloadButton/DownloadButton';
import AccordionUploadButton from './AccordionUploadButton/AccordionUploadButton';
import './AccordionItemHeader.scss';

type AccordionItemHeaderProps = {
  item: Song;
  isSelected: boolean;
  isUserAddingSongs: boolean;
  handleItemClick: any;
  handleAddSong: React.MouseEventHandler<HTMLAnchorElement>;
  handleUploadedFiles: React.ChangeEventHandler<HTMLInputElement>;
}

const AccordionItemHeader = ({
  item,
  isSelected,
  isUserAddingSongs,
  handleItemClick,
  handleAddSong,
  handleUploadedFiles,
}: AccordionItemHeaderProps) => {
  return (
    <div className={`accordionHeader ${isSelected ? 'selected' : ''}`}>
      {/* show add button when adding songs */}
      <div className="accordionHeaderSection left">
        {isUserAddingSongs && (
        <AddButton
          onClick={handleAddSong}
          songID={item.id}
        />
        )}
      </div>

      {/* button to select the accordion item */}
      <div className="accordionHeaderSection center">
        <button
          type="button"
          className="accordionButton"
          id={`item-${item.id}`}
          onClick={handleItemClick.bind(null, item.id)}
        ><span>{item.name}</span>
        </button>
      </div>
      {/* show extra buttons if item is selected */}
      <div className="accordionHeaderSection right">
        {isSelected && (
        <>
          <AccordionUploadButton
            handleUploadedFiles={handleUploadedFiles}
          />
          <DownloadButton
            href={item.path}
            fileName={item.path.split('/')[5]}
            key={`download-item-${item.id}`}
          />
        </>
        )}
      </div>
    </div>
  );
};

export default AccordionItemHeader;
