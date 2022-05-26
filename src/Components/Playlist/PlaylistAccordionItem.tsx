import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { Song } from '../../Types';
import './PlaylistAccordionItem.scss';

type PlaylistAccordionItemProps = {
    song: Song;
    onSongClick: any;
}

const PlaylistAccordionItem = (props: PlaylistAccordionItemProps) => {
  return (
    <Accordion.Item key={props.song.name} eventKey={props.song.name}>
      <div>
        <Accordion.Header onClick={props.onSongClick}>{props.song.name}</Accordion.Header>
      </div>
      <Accordion.Body>
        <p>
          id:
          {props.song.id}
        </p>
        <p>
          artist:
          {props.song.artist}
        </p>
        <p>
          tempo:
          {props.song.tempo}
        </p>
      </Accordion.Body>
    </Accordion.Item>

  );
};

export default PlaylistAccordionItem;
