import React from 'react';
import './CurrentPosition.scss';

type CurrentPositionProps = {
  duration: number; // in seconds
  currentTime: number; // in seconds
  setSeekTime: any;
}

const CurrentPosition = ({
  duration,
  currentTime,
  setSeekTime,
}: CurrentPositionProps) => {
  const timeToString = (time: number) => {
    const minutes = Math.floor(time / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const timeToPercentage = (time: number, duration: number) => {
    if ((time || duration) === 0) {
      return 0;
    }
    return ((time / duration) * 100);
  };

  const percentageToTime = (value: string) => {
    if (!value) {
      return 0;
    }
    const numValue = parseInt(value, 10);
    return (numValue * duration) / 100;
  };

  return (
    <span className="audioPlayerUI currentPosition">
      <div className="currentTime">{timeToString(currentTime)}</div>
      <div className="slider">
        <div className="thumb" />
        <input
          type="range"
          value={timeToPercentage(currentTime, duration)}
          className="progressBar"
          onChange={(e) => {
            setSeekTime(percentageToTime(e.currentTarget.value));
          }}
        />
      </div>
      <div className="duration">
        {timeToString(duration) || '00:00'}
      </div>
    </span>
  );
};

export default CurrentPosition;
