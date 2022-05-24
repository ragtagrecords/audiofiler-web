import React, { useState } from 'react';
import axios from 'axios';
import './EditPlaylistView.css';

type EditPlaylistViewProps = {
    playlistID?: string;
}

const EditPlaylistView = (props:EditPlaylistViewProps) => {

    const [playlistName, setPlaylistName] = useState<string>('');

    const handleChange = (e: any) => {
        if(!e || !e.target || !e.target.value) {
            console.log("Failed to submit new playlist")
            return false;
        }
        setPlaylistName(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', playlistName);
        // post files and info to API
        try {
            const res = await axios.post(
                "http://api.ragtagrecords.com/public/playlists",
                formData
            );
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }
    }

    return (
        <>
            <label> Playlist Name
                <input onChange={handleChange}
                    type="text"
                >
                </input>
            </label>
            <button onClick={handleSubmit}>
                Submit
            </button>
        </>
    )
}

export default EditPlaylistView;