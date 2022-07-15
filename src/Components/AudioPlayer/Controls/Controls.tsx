import React from 'react';
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPlayCircle,
  BsPauseCircle,
} from 'react-icons/bs';
import { ImLoop } from 'react-icons/im';
import './Controls.scss';

type ControlsProps = {
  isPlaying: boolean;
  setIsPlaying: any;
  skipSong: any;
  prevSong: any;
  isLooping: boolean;
  setIsLooping: any;
}

const Controls = ({
  isPlaying,
  setIsPlaying,
  skipSong,
  prevSong,
  isLooping,
  setIsLooping,
}: ControlsProps) => {
  return (
    <span className="audioPlayerUI controls">
      <div style={{ width: 80, color: 'transparent' }}>
        shuffle
      </div>
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
      <button
        type="button"
        className="loop"
        onClick={() => {
          setIsLooping(!isLooping);
        }}
      >
        {isLooping ? <ImLoop id="isLooping" /> : <ImLoop />}
      </button>
    </span>
  );
};

export default Controls;
