import React from 'react';
import { useParams } from 'react-router-dom';
import PlaylistAccordion from '../components/Playlists/PlaylistAccordion';

import '../globalstyle.module.css';
import styles from '../globalstyle.module.css';

type PlaylistViewParams = {
    playlistID: string;
}

const PlaylistView = () => {
    let { playlistID } = useParams<PlaylistViewParams>();
    if (playlistID == undefined) {
        playlistID = '1';
    }
    return (
        <>
            <h1 className={styles.title}>Name of Playlist</h1>
            <PlaylistAccordion playlistID={playlistID}/>
        </>
    );
}
    
export default PlaylistView;
