import React from "react";
import axios from "axios";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import internal from "stream";

interface Song {
  id: number;
  name: string;
  path: string;
  artist: string;
  tempo: number;
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
  onSongClick = (index:Number):void => {
    this.setState(
        (state, props) => ({
          currentSongIndex: 0,
        }),
        // callback function
        this.changeSong
      );
  }

  render() {
    return (
      <>
        <Accordion defaultActiveKey="0" flush>
          {this.state.songs.map((song, i) => {
            return (
              <>
                <Accordion.Item eventKey="1">
                  <Accordion.Header onClick={() => {this.onSongClick(song.id)}}>{song.name}</Accordion.Header>
                  <Accordion.Body>
                    <p>id: {song.id}</p>
                    <p>artist: {song.artist}</p>
                    <p>tempo: {song.tempo}</p>
                  </Accordion.Body>
                </Accordion.Item>
              </>
            );
          })}
        </Accordion>

        <AudioPlayer song={this.state.song} />
      </>
    );
  }
}
