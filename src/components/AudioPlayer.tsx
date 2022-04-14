import React from 'react';
import { PlayButton } from './PlayButton';
import { Howl, Howler } from 'howler';

interface Track {
    label: string,
    url: string
}

type Tracks = Array<Track>;

interface AudioPlayerProps {
    Tracks: Tracks
}

interface AudioPlayerState {
    CurrentAudioUrl: string,
    AudioPlayer: Howl
    Index: number
}

export default class AudioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {

    constructor(props:AudioPlayerProps) {
        super(props);
        this.state = {
            CurrentAudioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3?_=1',
            AudioPlayer: new Howl({
                src: ['https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3?_=1'],
                html5: true
            }),
            Index: 0
        }
    }
    

    playAudio = () => {
        this.state.AudioPlayer.play()
    };

    updatePlayer = () => {
        const currentUrl = this.props.Tracks[this.state.Index].url;
        if (currentUrl !== null) {
            this.state.AudioPlayer.stop();
            this.setState(
                (state, props) => ({
                    AudioPlayer: new Howl({
                        src: [currentUrl],
                        html5: true
                    })
                }),
                this.playAudio
              );
        }
    };

    changeAudioUrl = (index:number) => {
        this.setState(
            (state, props) => ({
                CurrentAudioUrl: this.props.Tracks[index].url,
                Index: index
            }),
            this.updatePlayer
          );
    };

    // TODO: generate <PlayButtons> from a .map
    render() {
        return (
            <>
                <h2>audio player</h2>
                <p> {this.props.Tracks[this.state.Index].label}</p>
                <PlayButton ClickHandler={this.changeAudioUrl} Index={0} />
                <PlayButton ClickHandler={this.changeAudioUrl} Index={1} />
            </>

        );
    }
}
