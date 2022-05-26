import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
// import AudioPlayer from './AudioPlayer';
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
          <Accordion.Item key={song.name} eventKey={song.name}>
            <div>
              <Accordion.Header onClick={props.onSongClick}>{song.name}</Accordion.Header>
            </div>
            <Accordion.Body>
              <p>id: {song.id}</p>
              <p>artist: {song.artist}</p>
              <p>tempo: {song.tempo}</p>
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};

export default PlaylistAccordion;
