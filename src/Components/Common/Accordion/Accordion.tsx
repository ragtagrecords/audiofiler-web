import React, { useEffect, useState } from 'react';
import { Song } from 'Types';
import AccordionItem from './AccordionItem/AccordionItem';
import './Accordion.scss';

type AccordionProps = {
    songs: Array<Song>;
    onItemClick: any;
    newItemID: number;
}

const Accordion = (props: AccordionProps) => {
  const firstItem = props.songs[0].id;
  const [currentItem, setCurrentItem] = useState<number>(firstItem);

  const handleClick = (id: number) => {
    if (!id) {
      console.log('Failed to handle accordion click');
      return false;
    }
    setCurrentItem(id);
    props.onItemClick(id);
    return true;
  };

  useEffect(() => {
    setCurrentItem(props.songs[0].id);
  }, [props.songs]);

  useEffect(() => {
    setCurrentItem(props.newItemID);
  }, [props.newItemID]);

  return (
    <div className="accordionContainer">
      <ul className="accordion">
        {props.songs && props.songs.map((song: Song) => {
          return (
            <AccordionItem
              show={currentItem === song.id}
              key={`accordion-item-${song.id}`}
              item={song}
              onItemClick={handleClick}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Accordion;
