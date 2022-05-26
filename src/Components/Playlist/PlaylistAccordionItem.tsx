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
      <Accordion.Header
        id={`song-${props.song.id}`}
        onClick={props.onSongClick.bind(null, props.song.id)}
      >{props.song.name}
      </Accordion.Header>
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
