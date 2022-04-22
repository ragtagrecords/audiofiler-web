import React, { isValidElement, SyntheticEvent } from "react";
import axios from "axios";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import internal from "stream";

interface Song {
  id: Number;
  name: string;
  path: string;
  artist: string;
  tempo: Number;
}
interface PlaylistProps {
  //foo: Foo
}

interface PlaylistState {
  currentSongIndex: number;
  songs: Song[];
  song: Song;
}

export default class Playlist extends React.Component<
  PlaylistProps,
  PlaylistState
> {
  constructor(props: PlaylistProps) {
    super(props);

    const defSong =  {
        id: 0,
        name: "defaultName",
        path: "defaultPath",
        artist: "defaultArtist",
        tempo: 0,
      };
    this.state = {
      currentSongIndex: 0,
      songs: [defSong],
      song: defSong,
    };
  }

  changeSong() {
    this.setState(
      (state, props) => ({
        // TODO:
        song: state.songs[state.currentSongIndex],
      })
      // callback function
      // () => {console.log(this.state.songs)}
    );
  }

  componentDidMount = () => {
    const songs = this.getSongs();
  };

  getSongs = (): void => {
    axios.get("http://api.ragtagrecords.com/public/songs").then((response) => {
      this.setState(
        (state, props) => ({
          songs: response.data,
        }),
        // callback function
        // () => {console.log(this.state.songs)}
        this.changeSong
      );
    });
  };

  // DOES NOT WORK
  // should update the value of the current song to the song selected in the accordion
  onSongClick = (i: number):void => {
    console.log(i);
    this.setState(
        {
          currentSongIndex: i,
        },
        // callback function
        this.changeSong
    );
  }

  render() {
    return (
      <>
        <Accordion defaultActiveKey="0" flush>
          {this.state.songs.map((song : Song, i : number) => {
            return (
                <Accordion.Item eventKey={i.toString()}>
                  <div onClick={this.onSongClick.bind(null, i)}>
                    <Accordion.Header>{song.name}</Accordion.Header>
                  </div>
                  <Accordion.Body>
                    <p>id: {song.id}</p>
                    <p>artist: {song.artist}</p>
                    <p>tempo: {song.tempo}</p>
                  </Accordion.Body>
                </Accordion.Item>
            );
          })}
        </Accordion>

        <AudioPlayer song={this.state.song} />
      </>
    );
  }
}
