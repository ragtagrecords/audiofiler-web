import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../../globalstyle.module.css";
import styles from "../../globalstyle.module.css";

interface Playlist {
  id: Number;
  name: string;
}
interface PlaylistsProps {
  //foo: Foo
}

interface PlaylistsState {
  playlists: [Playlist];
}

export default class Playlists extends React.Component<
  PlaylistsProps,
  PlaylistsState
> {
  constructor(props: PlaylistsProps) {
    super(props);

    const defPlaylist = {
      id: 0,
      name: "defaultName",
    };
    this.state = {
      playlists: [defPlaylist],
    };
  }

  componentDidMount = () => {
    const playlists = this.getPlaylists();
  };

  getPlaylists = (): void => {
    // TODO: handle error
    axios
      .get("http://api.ragtagrecords.com/public/playlists")
      .then((response) => {
        this.setState(
          (state, props) => ({
            playlists: response.data,
          }),
          // callback function
          () => {
            console.log(this.state.playlists);
          }
        );
      });
  };

  render() {
    return (
      <>
        <div className={styles.playlists}>
          <ul>
            {this.state.playlists.map((playlist: Playlist, i: number) => {
              return (
                <li key={i}>
                  <Link to={"/playlists/" + playlist.id + "/" + playlist.name}>
                    {playlist.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
  }
}
