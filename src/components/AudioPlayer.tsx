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
    currentAudioUrl: string,
    audioPlayer: Howl
    index: number
}

export default class audioPlayer extends React.Component<AudioPlayerProps, AudioPlayerState> {

    constructor(props:AudioPlayerProps) {
        super(props);
        this.state = {
            currentAudioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3?_=1',
            audioPlayer: new Howl({
                src: ['https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3?_=1'],
                html5: true
            }),
            index: 0
        }
    }
    

    playAudio = () => {
        this.state.audioPlayer.play()
    };

    updatePlayer = () => {
        const currentUrl = this.props.Tracks[this.state.index].url;
        if (currentUrl !== null) {
            this.state.audioPlayer.stop();
            this.setState(
                (state, props) => ({
                    audioPlayer: new Howl({
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
                currentAudioUrl: this.props.Tracks[index].url,
                index: index
            }),
            this.updatePlayer
          );
    };

    // TODO: generate <PlayButtons> from a .map
    render() {
        return (
            <>
                <h2>audio player</h2>
                <p> {this.props.Tracks[this.state.index].label}</p>
                <PlayButton clickHandler={this.changeAudioUrl} index={0} />
                <PlayButton clickHandler={this.changeAudioUrl} index={1} />
            </>

        );
    }
}
