import React from 'react';
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
      className="accordionItem"
    >
      <button
        type="button"
        className="accordionButton"
        id={`item-${props.item.id}`}
        onClick={props.onItemClick.bind(null, props.item.id)}
      >{props.item.name}
      </button>
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
