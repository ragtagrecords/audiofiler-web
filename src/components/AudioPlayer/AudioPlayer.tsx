import React, { SyntheticEvent, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import "./AudioPlayer.css";

import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
import { BsPlayCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";

type Song = {
    name: string,
    path: string,
}
type AudioPlayerProps = {
    song: Song,
    onSongEnded: any,
    skipSong: any,
    prevSong: any,
}

const defaultSong = {
    name: '',
    path: '',
}

const AudioPlayer = (props: AudioPlayerProps) => {
    
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [durationText,setDurationText] = useState<string>('00:00');
    const [currentTime,setCurrentTime] = useState<number>(0);
    const [currentTimeText,setCurrentTimeText] = useState<string>('00:00');
    const [song,setSong] = useState<Song>(defaultSong);

    const audioPlayer: React.RefObject<HTMLAudioElement> = useRef(null);
    const progressBar: React.RefObject<HTMLInputElement> = useRef(null);

    useEffect(() => {
        setSong(props.song);
        console.log(props.song);
    }, [props.song]);

    useEffect(() => {
        if(audioPlayer.current) {
            console.log(isPlaying);
            console.log("audioplayer source" + audioPlayer.current.src);
            console.log("song path: " + song.path);
            isPlaying ? audioPlayer.current.play() : audioPlayer.current.pause();
        } else {
            console.log('ERROR: failed to play song');
        }
    }, [isPlaying]);


    const onLoadedSongMetadata = () : void => {
        if(audioPlayer.current && audioPlayer.current.duration) {
            const duration = audioPlayer.current.duration;
            const durationText = convertTimeToString(duration);
            setDuration(duration);
            setDurationText(durationText);
            audioPlayer.current.play();
        }
    }

    const convertTimeToString = (secs: number) : string => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
        return `${returnedMinutes}:${returnedSeconds}`;
    };

    const updateAudioPlayerTime = () : void => {
        if(audioPlayer.current && audioPlayer.current.currentTime) {
            audioPlayer.current.currentTime = currentTime;
        }
    }

    const updateTimeSlider = () : void => {
        if( progressBar.current && 
            progressBar.current.value && 
            audioPlayer.current 
        ) {
            const songProgress = currentTime / audioPlayer.current.duration * 100;
            progressBar.current.value = (songProgress).toString();
        }
    }

    const onAudioPlayerTimeUpdate = () : void => {
        if( audioPlayer.current 
            && audioPlayer.current.currentTime
        ) {
            const timeFromAudioPlayer = audioPlayer.current.currentTime;
            const timeText = convertTimeToString(timeFromAudioPlayer);
            setCurrentTime(timeFromAudioPlayer);
            setCurrentTimeText(timeText);
            updateTimeSlider();
        }
    }

    const onTimeSliderChange = (event: any) : void => {
        if (audioPlayer.current
            && audioPlayer.current
            && progressBar.current 
            && progressBar.current.value
        ) {
            const valueOfProgressBar = parseInt(progressBar.current.value);
            const timeFromProgressBar = valueOfProgressBar * duration / 100;
            const timeText = convertTimeToString(timeFromProgressBar);
            setCurrentTime(timeFromProgressBar);
            setCurrentTimeText(timeText);
            audioPlayer.current.currentTime = timeFromProgressBar;
        }
    };
    
    const pause = (): void => {
        setIsPlaying(false);
    }
    
    const play = (): void => {
        setIsPlaying(true);
    }
    
    return (
        <div className="audioPlayer">
            {song && song.path != "" &&
                <audio 
                ref={audioPlayer} 
                src={song.path} 
                preload="metadata"
                onTimeUpdate={onAudioPlayerTimeUpdate}
                onLoadedMetadata={onLoadedSongMetadata}
                onEnded={props.onSongEnded}
                onPause={pause}
                onPlay={play}
                ></audio>
            }
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
                    {durationText ? durationText : '00:00'}
                </div>
            </span>

            <span className="audioPlayerUI controls">
                <button 
                    className="forwardBackward" 
                    onClick={props.prevSong}
                >
                    <BsArrowLeftCircle />
                </button>
                <button className="playPause" onClick={isPlaying ? pause : play} >
                    {isPlaying 
                        ? <BsPauseCircle />
                        : <BsPlayCircle className="play" />
                    }
                </button>
                <button 
                    className="forwardBackward" 
                    onClick={props.skipSong}
                >
                    <BsArrowRightCircle />
                </button>
            </span>
        </div>
    );
}

export default AudioPlayer;
