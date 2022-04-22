import React, { SyntheticEvent, useRef } from 'react';
import axios from 'axios';
import styles from "./AudioPlayer.module.css";

import { BsArrowLeftCircle } from "react-icons/bs";
import { BsArrowRightCircle } from "react-icons/bs";
import { BsPlayCircle } from "react-icons/bs";
import { BsPauseCircle } from "react-icons/bs";
import { AppProps } from 'next/app';
import { stringify } from 'querystring';

import { Button } from 'react-bootstrap';

interface Song {
    name: string,
    path: string,
}
interface AudioPlayerProps {
    //foo: Foo
    song: Song
}

interface AudioPlayerState {
    currentSongIndex: number,
    isPlaying: boolean,
    duration: Number,
    durationText: string,
    currentTime: number,
    currentTimeText: string,
    song: Song
}

export default class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {

    
    private audioPlayer: React.RefObject<HTMLAudioElement>;
    private progressBar: React.RefObject<HTMLInputElement>;
    

    constructor(props:AudioPlayerProps) {
        super(props);
        
        this.audioPlayer = React.createRef();
        this.progressBar = React.createRef();
        this.state = {
            currentSongIndex: 0,
            isPlaying: false,
            duration: 0,
            durationText: '00:00',
            currentTime: 0,
            currentTimeText: '00:00',
            song:
            {
                name: "defaultName",
                path: "defaultPath",
            },
        }
    }

    static getDerivedStateFromProps(nextProps:AudioPlayerProps, prevState:AudioPlayerState) {
        if (prevState.song !== nextProps.song) {
          return { song: nextProps.song };
        }
    
        return null;
    }


    componentDidMount = () => {
        //
    }

    onLoadedSongMetadata = () : void => {
        if(this.audioPlayer.current && this.audioPlayer.current.duration) {
            const duration = this.audioPlayer.current.duration;
            const durationText = this.convertTimeToString(duration);
            this.setState(
                (state, props) => ({
                    duration: duration,
                    durationText: durationText
                }),
                // function
            );
        }
        
    }


    convertTimeToString = (secs: number) : string => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    
        return `${returnedMinutes}:${returnedSeconds}`;
    };

    updateAudioPlayerTime = () : void => {
        console.log("hello world");
        if(this.audioPlayer.current && this.audioPlayer.current.currentTime) {
            this.audioPlayer.current.currentTime = this.state.currentTime;
            console.log("hello world 2");
        }
    }

    updateTimeSlider = () : void => {
        if(
            this.progressBar.current && 
            this.progressBar.current.value && 
            this.audioPlayer.current 
        ){
            const songProgress = this.state.currentTime / this.audioPlayer.current.duration * 100;
            this.progressBar.current.value = (songProgress).toString();
        }
    }

    onAudioPlayerTimeUpdate = () : void => {
        
        if( this.audioPlayer.current && this.audioPlayer.current.currentTime) {
            const timeFromAudioPlayer = this.audioPlayer.current.currentTime;
            const timeText = this.convertTimeToString(timeFromAudioPlayer);
            this.setState(
                (state, props) => ({
                    currentTime: timeFromAudioPlayer,
                    currentTimeText: timeText
                }),
                this.updateTimeSlider
            );
        }
    }

    onTimeSliderChange = (event: SyntheticEvent) : void => {
        if (this.progressBar.current && this.progressBar.current.value) {
            const valueOfProgressBar = Number(this.progressBar.current.value);
            const timeFromProgressBar = valueOfProgressBar * Number(this.state.duration) / 100;
            const timeText = this.convertTimeToString(timeFromProgressBar);
            this.setState(
                (state, props) => ({
                    currentTime: timeFromProgressBar,
                    currentTimeText: timeText
                }),
                this.updateAudioPlayerTime
            );
        }
        
    };
    
    
    whilePlaying = () : void => {
        if( this.audioPlayer.current) {
            console.log(this.audioPlayer.current.currentTime);
        }
        if (this.progressBar.current && this.audioPlayer.current)
        {
            this.progressBar.current.value = (this.audioPlayer.current.currentTime).toString();
            //this.changePlayerCurrentTime();
        }
    };

    togglePlayPause = (): void => {
        const prevState = this.state.isPlaying;
        this.setState(
            (state, props) => ({
                isPlaying: !state.isPlaying
            }),
        );
    
        if( this.audioPlayer.current ) {
            if (!prevState ) {
                this.audioPlayer.current.play();
              } else {
                this.audioPlayer.current.pause();
              }
        }
        
    };

    backThirty = () : void => {
        this.setState(
            (state, props) => ({
                currentTime: state.currentTime - 30,
                currentTimeText: this.convertTimeToString(state.currentTime - 30)
            }),
            this.updateAudioPlayerTime
        );
    };

    forwardThirty = () : void => {
        this.setState(
            (state, props) => ({
                currentTime: state.currentTime + 30,
                currentTimeText: this.convertTimeToString(state.currentTime - 30)
            }),
            this.updateAudioPlayerTime
        );
    };

    render() {
        return (
            <div className={styles.audioPlayer}>
                <h1>{this.state.song.name}</h1>
                <audio 
                    ref={this.audioPlayer} 
                    src={this.state.song.path} 
                    preload="metadata"
                    onTimeUpdate={this.onAudioPlayerTimeUpdate}
                    onLoadedMetadata={this.onLoadedSongMetadata}
                ></audio>
                <button 
                    className={styles.forwardBackward} 
                    onClick={this.backThirty}
                >
                    <BsArrowLeftCircle /> 30
                </button>
                <button className={styles.playPause} onClick={this.togglePlayPause} >
                    {this.state.isPlaying ? (
                    <BsPauseCircle />
                    ) : (
                    <BsPlayCircle className={styles.play} />
                    )}
                </button>
                <button 
                    className={styles.forwardBackward} 
                    onClick={this.forwardThirty}
                >
                30 
                <BsArrowRightCircle />
                </button>

                {/* current time */}
                <div className={styles.currentTime}>{this.state.currentTimeText}</div>

                {/* progress bar */}
                <div>
                    <input
                    type="range"
                    defaultValue="0"
                    className={styles.progressBar}
                    ref={this.progressBar}
                    onChange={this.onTimeSliderChange}
                    />
                </div>

                {/* duration */}
                <div className={styles.duration}>
                    {this.state.durationText ? this.state.durationText : '00:00'}
                </div>
            </div>

        );
    }
}