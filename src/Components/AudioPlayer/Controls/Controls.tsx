import React from 'react';
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPlayCircle,
  BsPauseCircle,
} from 'react-icons/bs';
import './Controls.scss';

type ControlsProps = {
  isPlaying: boolean;
  setIsPlaying: any;
  skipSong: any;
  prevSong: any;
}

const Controls = ({
  isPlaying,
  setIsPlaying,
  skipSong,
  prevSong,
}: ControlsProps) => {
  return (
    <span className="audioPlayerUI controls">
      <button type="button" className="forwardBackward" id="backward" onClick={prevSong}>
        <BsArrowLeftCircle />
      </button>
      <button
        type="button"
        className="playPause"
        onClick={() => {
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
      </button>
      <button type="button" className="forwardBackward" id="forward" onClick={skipSong}>
        <BsArrowRightCircle />
      </button>
    </span>
  );
};

export default Controls;
