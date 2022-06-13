import React, { useEffect, useState } from 'react';
import { Playlist, Song, BodyType } from 'Types';
import axios from 'axios';
import { addSongToPlaylist } from 'Services/SongSvc';
import Items from './Items/Items';
import SearchBar from '../SearchBar/SearchBar';
import './Accordion.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

type AccordionProps = {
  playlist: Playlist;
  playlistSongs: Song[];
  selectedSongID: number;
  setSelectedSongID: any;
  isAdding: boolean;
  refreshPlaylistSongs: any;
  isLoading: boolean;
  changeSong: any;
}

const Accordion = ({
  playlist,
  playlistSongs,
  selectedSongID,
  setSelectedSongID,
  isAdding,
  refreshPlaylistSongs,
  isLoading,
  changeSong,
}: AccordionProps) => {
  const [isSelectedSongOpen, setIsSelectedSongOpen] = useState<boolean>(false);
  const [bodyType, setBodyType] = useState<BodyType>('info');

  // State for searching
  const [query, setQuery] = useState<string>('');
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  // State for upload option
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);

  /* ******************* FUNCTIONS ******************** */

  // Sets filteredSongs based on current query and playlist
  const filterSongs = (songs = null) => {
    // if allSongs not available yet, expect songs to be passed in param
    const tempSongs = allSongs ?? songs;
    if (!tempSongs) {
      console.log('Found no songs to filter!');
      return false;
    }

    // new empty array we will use to store our results
    const tempFilteredSongs: Song[] = [];

    // check if each song passes filters
    tempSongs.forEach((song) => {
      let isSongInPlaylist = false;
      let doesSongContainQuery = false;

      // check if song is already in playlist
      playlistSongs.forEach((playlistSong) => {
        if (song.id === playlistSong.id) {
          isSongInPlaylist = true;
        }
      });

      // check if song name contains query
      doesSongContainQuery = song.name.includes(query);

      // if it passes, push it
      if (!isSongInPlaylist && doesSongContainQuery) {
        tempFilteredSongs.push(song);
      }
    });

    setFilteredSongs(tempFilteredSongs);
    return true;
  };

  // When upload, download, or options are selected on song
  const handleOptionsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { className } = e.currentTarget;

    if (className === 'optionButton') {
      setBodyType('versions');
    } else if (className === 'uploadButton') {
      setBodyType('upload');
    } else if (className === 'downloadButton') {
      setBodyType('download');
    }
    return true;
  };

  // When add button is clicked for a particular item
  const addSong = (id: number) => {
    addSongToPlaylist(id, playlist.id);
    refreshPlaylistSongs();
    filterSongs();
  };

  const handleUploadedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const { files } = target;
    if (!files) {
      console.log('Upload failed');
      return false;
    }
    const fileArray: File[] = [];
    for (let i = 0; i < files.length; i += 1) {
      fileArray.push(files[i]);
    }
    setUploadedFiles(fileArray);
    return true;
  };

  // Grabs JSON info for all songs from API
  const fetchAllSongs = async () => {
    let res;
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      res = await axios.get(
        `${baseUrl}public/songs`,
      );
    } catch (e) {
      return 0;
    }

    if (res.data) {
      // Initially there are no filters, so both are the same songs
      setAllSongs(res.data);
      filterSongs(res.data);
      return true;
    }
    return false;
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  /* ******************* EFFECTS ******************** */

  // Filter songs when user query changes
  useEffect(() => {
    if (isAdding) {
      filterSongs();
    }
  }, [query]);

  // Set current item to first song when songs change
  useEffect(() => {
    if (playlistSongs.length > 0 && playlistSongs[0].id) {
      setSelectedSongID(playlistSongs[0].id);

      // re-filter if currently adding
      if (isAdding) {
        filterSongs();
      }
    }
  }, [playlistSongs]);

  // Set current item when an item is selected via parent
  useEffect(() => {
    setSelectedSongID(selectedSongID);
  }, [selectedSongID]);

  // Fetch songs when the user decides to add songs
  useEffect(() => {
    if (isAdding) {
      fetchAllSongs();
    }
  }, [isAdding]);

  /* ******************* RETURN ******************** */

  if (isLoading) {
    return (
      <div className="accordionContainer">
        <LoadingSpinner />
      </div>
    );
  }

  if (selectedSongID === 0 && !isAdding) {
    return <div className="accordionContainer"> No songs in this playlist yet, use top menu in right to add some :)</div>;
  }

  return (
    <div className="accordionContainer listContainer">
      <ul className="accordion">
        {isAdding
        && (
        <li className="searchItem">
          <div className="bar">
            <SearchBar
              onChange={handleQueryChange}
              query={query}
            />
          </div>
        </li>
        )}
        <Items
          playlistSongs={playlistSongs}
          selectedSongID={selectedSongID}
          isSelectedSongOpen={isSelectedSongOpen}
          setIsSelectedSongOpen={setIsSelectedSongOpen}
          isAdding={isAdding}
          filteredSongs={filteredSongs ?? undefined}
          uploadedFiles={uploadedFiles ?? undefined}
          addSong={addSong}
          handleUploadedFiles={handleUploadedFiles}
          handleClick={handleOptionsClick}
          bodyType={bodyType}
          changeSong={changeSong}
        />
      </ul>
    </div>
  );
};

export default Accordion;
