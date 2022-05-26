import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import PlaylistAccordionItem from './PlaylistAccordionItem';
import { Song } from '../../Types';
import './PlaylistAccordion.scss';

type PlaylistAccordionProps = {
    songs: Array<Song>;
    onSongClick: any;
}

const PlaylistAccordion = (props: PlaylistAccordionProps) => {
  return (
    <Accordion defaultActiveKey="0" flush>
      {props.songs && props.songs.map((song: Song) => {
        return (
          <PlaylistAccordionItem
            key={song.id}
            song={song}
            onSongClick={props.onSongClick}
          />
        );
      })}
    </Accordion>
  );
};

export default PlaylistAccordion;
