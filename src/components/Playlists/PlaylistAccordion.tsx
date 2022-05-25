import React, { useEffect, useState } from "react";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Accordion from "react-bootstrap/Accordion";

import styles from "../../globalstyle.module.css";
import "./PlaylistAccordion.css";

interface Song {
    id: Number;
    name: string;
    path: string;
    artist: string;
    tempo: Number;
}

interface PlaylistAccordionProps {
    playlistID: string;
}

const PlaylistAccordion = (props: PlaylistAccordionProps) => {
    const defaultSong = {
        id: 0,
        name: "",
        path: "",
        artist: "",
        tempo: 0,
    };

    const [playlistID, setPlaylistID] = useState<string>(props.playlistID);
    const [songs, setSongs] = useState<Array<Song>>([defaultSong]);
    const [song, setSong] = useState<Song>(defaultSong);
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);

    const onSongClick = (i: number): void => {
        setCurrentSongIndex(i);
    };

    const loadPlaylist = () => {
        fetch("http://api.ragtagrecords.com/public/playlists/" + playlistID)
        .then((response) => response.json())
        .then((data) => setSongs(data));
    };

    const onSongEnded = () => {
        setCurrentSongIndex(currentSongIndex + 1);
    }

    // load new playlist when ID changes
    useEffect(() => {
        loadPlaylist();
    }, [playlistID]);

    useEffect(() => {
        setSong(songs[currentSongIndex]);
    }, [songs]);

    useEffect(() => {
        setSong(songs[currentSongIndex]);
    }, [currentSongIndex]);

    // set new playlistID if props update
    useEffect(() => {
        setPlaylistID(props.playlistID);
    }, [props]);


    return (
        <>
            <Accordion defaultActiveKey="0" flush>
                {songs && songs.map((song: Song, i: number) => {
                    return (
                        <Accordion.Item key={i} eventKey={i.toString()}>
                            <div onClick={onSongClick.bind(null, i)}>
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
            {song && song.name != "" &&
                <div className={styles.audioPlayer}>
                <AudioPlayer
                    song={song}
                    onSongEnded={onSongEnded}
                />
            </div>
            }
        </>
    );
};
        export default PlaylistAccordion;
        