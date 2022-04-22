import React from 'react';
import axios from 'axios';
import AudioPlayer from './AudioPlayer/AudioPlayer';

interface Song {
    name: string,
    path: string,
}
interface PlaylistProps {
    //foo: Foo
}

interface PlaylistState {
    currentSongIndex: number,
    songs: Song[],
    song: Song,
}

export default class Playlist extends React.Component<PlaylistProps, PlaylistState> {


    constructor(props:PlaylistProps) {
        super(props);
        
        this.state = {
            currentSongIndex: 0,
            songs: 
            [
                {
                  name: "defaultName",
                  path: "defaultPath",
                }
            ],
            song:
            {
                name: "defaultName",
                path: "defaultPath",
            },
        }
    }

    changeSong(){
        this.setState(
            (state, props) => ({
                song: state.songs[state.currentSongIndex],
            }),
            // callback function
            // () => {console.log(this.state.songs)}
        );
    }

    componentDidMount = () => {
        const songs = this.getSongs();
    }

    getSongs = (): void => {
        axios.get("http://api.ragtagrecords.com/public/songs").then((response) => {
            this.setState(
                (state, props) => ({
                    songs: response.data
                }),
                // callback function
                // () => {console.log(this.state.songs)}
                this.changeSong
            );
        });
    };


    render() {
        return (
            <>              
                <AudioPlayer song={this.state.song}/>
            </>
        )
    }
}