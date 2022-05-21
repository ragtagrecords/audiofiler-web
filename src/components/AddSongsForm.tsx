import React, { useEffect, useState } from 'react';
import SongInfoFieldset from '../components/SongInfoFieldset';
import UploadSongsInput from '../components/UploadSongsInput';
import axios from 'axios';
import './AddSongsForm.css';

type SongInputInfo = {
    name: string,
    tempo?: string,
    fileName: string,
    playlistIDs?: Array<string>,
}

type Playlist = {
    id: string,
    name: string,
}

const defaultSong =  {
    name: "defaultName",
    tempo: "defaultTempo",
    fileName: "defaultFileName.mp3",
    playlistIDs: [],
};

const defaultPlaylist =  {
    id: '0',
    name: "defaultPlaylist",
};

type AddSongsFormProps = {
    songs: Array<SongInputInfo>;
}

const AddSongForm = (props: AddSongsFormProps) => {
  
    const [songs, setSongs] = useState<Array<SongInputInfo>>([defaultSong]);
    const [files, setFiles] = useState<FileList>();
    const [playlists, setPlaylists] = useState<Array<Playlist>>([defaultPlaylist]);
    
    useEffect(() => {
        getPlaylists();
    }, []);

    const updateSongName = (fileName: string, newSongName: string) => {
        let newSongInfo = songs;
        newSongInfo.every(songInfo => {
            if(songInfo.fileName === fileName) {
                songInfo.name = newSongName;
                return false;
            }
            return true;
        });
        setSongs(newSongInfo);
    }

    const updateSongTempo = (fileName: string, newSongTempo: string) => {
        let newSongInfo = songs;
        newSongInfo.every(songInfo => {
            if (songInfo.fileName === fileName) {
                songInfo.tempo = newSongTempo;
                return false;
            }
            return true;
        });
        setSongs(newSongInfo);
    }

    const updateSongPlaylistIDs = (fileName: string, options: Array<HTMLOptionElement>) => {
        let newSongInfo = songs;
        let playlistIDs : Array<string> = [];
        // store selected dropdown values in array
        for (let i = 0; i < options.length; ++i) {
            if(options[i].selected) {
                playlistIDs.push(options[i].value)
            }
        }
        newSongInfo.every(songInfo => {
            if (songInfo.fileName === fileName) {
                songInfo.playlistIDs = playlistIDs;
                return false;
            }
            return true;
        });
        setSongs(newSongInfo);
    }

    const handleChange = (e : any) => {
        if (!e || !e.target || !e.target.value) {
            console.log('Error updating based on user input')
            return null;
        }

        // save raw files to state
        if (e.target.type == 'file') {
            saveFiles(e);
        } 
        else if (e.target.className.includes('songNameInput')) {
            updateSongName(e.target.id, e.target.value);
        } 
        else if (e.target.className.includes('songTempoInput')) {
            updateSongTempo(e.target.id, e.target.value);
        } 
        else if (e.target.className.includes('songPlaylistInput')) {
            updateSongPlaylistIDs(e.target.id, e.target.options);
        } 
        else {
            console.log("Unexpected event in AddSongsForm::handleChange()");
        }
    }

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        const formData = new FormData();

        if (!files || !songs) {
            console.log('songs info or files not found for upload');
            return false;
        }

        // add files to form data
        for(let i = 0; i < files.length; ++i) {
            formData.append(files[i].name, files[i]);
        }

        // add songs to form data
        formData.append('songs', JSON.stringify(songs));

        // post files and info to API
        try {
            const res = await axios.post(
                "http://api.ragtagrecords.com/public/songs",
                formData
            );
            console.log(res);
        } catch (ex) {
            console.log(ex);
        }
    }

    const saveFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        let target = e.target as HTMLInputElement;
        let newFiles = target.files;

        if (!newFiles) {
            console.log("ERROR: FILE NOT UPLOADED TO FE");
            return false;
        }

        // store raw files so we can POST them later
        setFiles(newFiles);

        // build temp array of uploaded songs
        let newSongs = new Array<SongInputInfo>();
        for(let i = 0; i < newFiles.length; ++i) {
            newSongs[i] = {
                fileName: newFiles[i].name,
                name: newFiles[i].name
            };
        }

        // update songs in state so map will update
        setSongs(newSongs);
        console.log("SUCCESS: FILE UPLOADED TO FE");
        return true;
    };

    const getPlaylists = () => {
        fetch("http://api.ragtagrecords.com/public/playlists/")
        .then(response => response.json())
        .then(data => setPlaylists(data));
    }
    
    return (
        <>
            <form className="addSongsForm" onSubmit={handleSubmit} key="addSongsForm">
                <UploadSongsInput handleChange={handleChange} />
                
                {files && songs && songs.map((song : SongInputInfo, i) => {
                    return (
                        <SongInfoFieldset 
                            key={song.fileName} 
                            index={i.toString()} 
                            fileName={song.name}
                            playlists={playlists}
                            handleChange={handleChange} 
                        />
                    );
                })}
                {files && songs && 
                    <input
                        type="submit"
                        value="Add Songs"
                    />
                }
            </form>
        </>
    );
}

export default AddSongForm;
