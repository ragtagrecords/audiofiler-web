import React, { useState } from 'react';
import { Song } from 'Types';
import Controls from './Controls/Controls';
import './AudioPlayer.scss';
import Player from './Player/Player';
import CurrentPosition from './CurrentPosition/CurrentPosition';

type AudioPlayerProps = {
    song: Song,
    skipSong: any,
    prevSong: any,
}

const AudioPlayer = ({ song, skipSong, prevSong }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // Time is tracked in seconds
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0); // controlled by audio player
  const [seekTime, setSeekTime] = useState<number>(0);

  return (
    <div className="footer">
      <div className="audioPlayer">
        {song && song.path !== ''
                && (
                <Player
                  src={song.path}
                  isPlaying={isPlaying}
                  skipSong={skipSong}
                  seekTime={seekTime}
                  onTimeUpdate={(e: React.ChangeEvent<HTMLAudioElement>) => {
                    setCurrentTime(e.target.currentTime);
                  }}
                  onLoadedMetadata={(e: React.ChangeEvent<HTMLAudioElement>) => {
                    setDuration(e.target.duration);
                  }}
                />
                )}

        <span className="audioPlayerUI name">
          {song.name}
        </span>

        <CurrentPosition
          duration={duration}
          currentTime={currentTime}
          setSeekTime={setSeekTime}
        />

        <Controls
          prevSong={prevSong}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          skipSong={skipSong}
        />
      </div>
    </div>
  );
};

export default AudioPlayer;
