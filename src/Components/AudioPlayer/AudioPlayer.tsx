import React, { useState, useEffect, useRef } from 'react';
import { Song } from 'Types';
import './AudioPlayer.scss';
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPlayCircle,
  BsPauseCircle,
} from 'react-icons/bs';

type AudioPlayerProps = {
    song: Song,
    onSongEnded: any,
    skipSong: any,
    prevSong: any,
}

const defaultSong = {
  id: 0,
  name: '',
  path: '',
};

const AudioPlayer = (props: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [durationText, setDurationText] = useState<string>('00:00');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentTimeText, setCurrentTimeText] = useState<string>('00:00');
  const [song, setSong] = useState<Song>(defaultSong);

  const audioPlayer: React.RefObject<HTMLAudioElement> = useRef(null);
  const progressBar: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    setSong(props.song);
  }, [props.song]);

  useEffect(() => {
    if (!audioPlayer.current) {
      console.log('ERROR: failed to play song');
      return;
    }

    if (isPlaying) {
      audioPlayer.current.play();
    } else {
      audioPlayer.current.pause();
    }
  }, [isPlaying]);

  const convertTimeToString = (secs: number) : string => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const onLoadedSongMetadata = () : void => {
    if (audioPlayer.current && audioPlayer.current.duration) {
      const dur = audioPlayer.current.duration;
      const durText = convertTimeToString(dur);
      setDuration(dur);
      setDurationText(durText);
      audioPlayer.current.play();
    }
  };

  const updateTimeSlider = () : void => {
    if (progressBar.current
            && progressBar.current.value
            && audioPlayer.current
    ) {
      const songProgress = (currentTime / audioPlayer.current.duration) * 100;
      progressBar.current.value = (songProgress).toString();
    }
  };

  const onAudioPlayerTimeUpdate = () : void => {
    if (audioPlayer.current
            && audioPlayer.current.currentTime
    ) {
      const timeFromAudioPlayer = audioPlayer.current.currentTime;
      const timeText = convertTimeToString(timeFromAudioPlayer);
      setCurrentTime(timeFromAudioPlayer);
      setCurrentTimeText(timeText);
      updateTimeSlider();
    }
  };

  const onTimeSliderChange = () : void => {
    if (audioPlayer.current
            && audioPlayer.current
            && progressBar.current
            && progressBar.current.value
    ) {
      const valueOfProgressBar = parseInt(progressBar.current.value, 10);
      const timeFromProgressBar = (valueOfProgressBar * duration) / 100;
      const timeText = convertTimeToString(timeFromProgressBar);
      setCurrentTime(timeFromProgressBar);
      setCurrentTimeText(timeText);
      audioPlayer.current.currentTime = timeFromProgressBar;
    }
  };

  const pause = (): void => {
    setIsPlaying(false);
  };

  const play = (): void => {
    setIsPlaying(true);
  };

  return (
    <div className="audioPlayer">
      {song && song.path !== ''
                && (
                <audio
                  ref={audioPlayer}
                  src={song.path}
                  preload="metadata"
                  onTimeUpdate={onAudioPlayerTimeUpdate}
                  onLoadedMetadata={onLoadedSongMetadata}
                  onEnded={props.onSongEnded}
                  onPause={pause}
                  onPlay={play}
                />
                )}
      <span className="audioPlayerUI name">
        <h2>{song.name}</h2>
      </span>

      <span className="audioPlayerUI slider">
        <div className="currentTime">{currentTimeText}</div>
        <div>
          <input
            type="range"
            defaultValue="0"
            className="progressBar"
            ref={progressBar}
            onChange={onTimeSliderChange}
          />
        </div>
        <div className="duration">
          {durationText || '00:00'}
        </div>
      </span>

      <span className="audioPlayerUI controls">
        <button
          type="button"
          className="forwardBackward"
          onClick={props.prevSong}
        >
          <BsArrowLeftCircle />
        </button>
        <button type="button" className="playPause" onClick={isPlaying ? pause : play}>
          {isPlaying
            ? <BsPauseCircle />
            : <BsPlayCircle className="play" />}
        </button>
        <button
          type="button"
          className="forwardBackward"
          onClick={props.skipSong}
        >
          <BsArrowRightCircle />
        </button>
      </span>
    </div>
  );
};

export default AudioPlayer;
