import React from 'react';
import { Song } from 'Types';
import './AccordionItemBody.scss';

type AccordionItemBodyProps = {
  item: Song;
  isSelected: boolean;
  isOpen: boolean;
  uploadedFiles: FileList | null;
}

const AccordionItemBody = ({
  item,
  isSelected,
  isOpen,
  uploadedFiles,
}: AccordionItemBodyProps) => {
  if (uploadedFiles) {
    // change body details
    // prob make component for both options
    // remove accordion from names
    return (
      <div
        className={`accordionBody ${isSelected && isOpen ? 'open' : ''}`}
      >
        <div> upload info!</div>
      </div>
    );
  }
  return (
    <div
      className={`accordionBody ${(isSelected && isOpen) || uploadedFiles ? 'open' : ''}`}
    >
      <p>
        id:
        {item.id}
      </p>
      <p>
        artist:
        {item.artist}
      </p>
      <p>
        tempo:
        {item.tempo}
      </p>
    </div>
  );
};

export default AccordionItemBody;
