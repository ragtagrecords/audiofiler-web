import React, { useEffect } from 'react';
import DownloadButton from 'Components/Common/DownloadButton/DownloadButton';
import { Song } from 'Types';
import './AccordionItem.scss';

type AccordionItemProps = {
    item: Song;
    show: boolean;
    onItemClick: any;
}

const AccordionItem = (props: AccordionItemProps) => {
  return (
    <li
      className={`accordionItem  ${props.show ? 'show' : ''}`}
    >
      <div className="accordionHeader">
        <div className="accordionHeaderSection left" />
        {/* button to select the accordion item */}
        <div className="accordionHeaderSection center">
          <button
            type="button"
            className="accordionButton"
            id={`item-${props.item.id}`}
            onClick={props.onItemClick.bind(null, props.item.id)}
          >{props.item.name}
          </button>
        </div>
        <div className="accordionHeaderSection right">
          {/* show download button if item is selected */}
          {props.show && (
          <DownloadButton
            href={props.item.path}
            fileName={props.item.path.split('/')[5]}
            key={`download-item-${props.item.id}`}
          />
          )}
        </div>
      </div>
      <div
        className={`accordionBody ${props.show ? 'show' : ''}`}
      >
        <p>
          id:
          {props.item.id}
        </p>
        <p>
          artist:
          {props.item.artist}
        </p>
        <p>
          tempo:
          {props.item.tempo}
        </p>
      </div>
    </li>

  );
};

export default AccordionItem;
