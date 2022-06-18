import React, { useEffect, useRef } from 'react';

type PlayerProps = {
  src: string;
  isPlaying: boolean;
  seekTime: number;
  skipSong: any;
  onTimeUpdate: any;
  onLoadedMetadata: any;
}

const Player = ({
  src,
  isPlaying,
  seekTime,
  skipSong,
  onTimeUpdate,
  onLoadedMetadata,
}: PlayerProps) => {
  // Ref gives us access to dom properties
  // https://www.w3schools.com/tags/ref_av_dom.asp
  const ref: React.RefObject<HTMLAudioElement> = useRef(null);

  // Play or pause based on parent state
  if (ref.current) isPlaying ? ref.current.play() : ref.current.pause();

  // Update player time when user selects new time
  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  return (
    <audio
      ref={ref}
      src={src}
      preload="metadata"
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onEnded={skipSong}
    />
  );
};

export default Player;
