import React, { useEffect, useState } from 'react';
import { Playlist, Song } from 'Types';
import axios from 'axios';
import { addSongToPlaylist } from 'Services/SongSvc';
import AccordionItems from './AccordionItems/AccordionItems';
import SearchBar from '../SearchBar/SearchBar';
import './Accordion.scss';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

type AccordionProps = {
  playlist: Playlist;
  playlistSongs: Song[];
  onItemClick: any;
  newItemID: number;
  isAdding: boolean;
  refreshPlaylistSongs: any;
  isLoading: boolean;
}

const Accordion = ({
  playlist,
  playlistSongs,
  newItemID,
  isAdding,
  refreshPlaylistSongs,
  isLoading,
  onItemClick,
}: AccordionProps) => {
  const doesPlaylistHaveSongs = playlistSongs.length > 0 && playlistSongs[0].id;
  const firstItemID = doesPlaylistHaveSongs ? playlistSongs[0].id : 0;
  const [currentItemID, setCurrentItemID] = useState<number>(firstItemID);
  const [isCurrentItemOpen, setIsCurrentItemOpen] = useState<boolean>(false);

  // State for searching
  const [query, setQuery] = useState<string>('');
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  // State for uploading
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

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

  // When center of accordion header is clicked
  const onItemClickLocal = (id: number) => {
    if (!id) {
      console.log('Failed to handle accordion click');
      return false;
    }
    const clickedCurrentItem = id === currentItemID;
    if (clickedCurrentItem && !uploadedFiles) { // clicked current item
      setIsCurrentItemOpen(!isCurrentItemOpen);
      onItemClick(id);
    } else if (!clickedCurrentItem && uploadedFiles) { // clicked new item while uploading files
      const wantsToCancelUpload = confirm('Are you sure you want to cancel the upload?');
      if (wantsToCancelUpload) {
        setUploadedFiles(null);
        setCurrentItemID(id);
        onItemClick(id);
      }
    } else { // clicked new item
      setCurrentItemID(id);
      onItemClick(id);
    }
    return true;
  };

  // When add button is clicked for a particular item
  const onItemAdd = (id: number) => {
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
    setUploadedFiles(files);
    setIsCurrentItemOpen(true);
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
      setCurrentItemID(playlistSongs[0].id);

      // re-filter if currently adding
      if (isAdding) {
        filterSongs();
      }
    }
  }, [playlistSongs]);

  // Set current item when an item is selected via parent
  useEffect(() => {
    setCurrentItemID(newItemID);
  }, [newItemID]);

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

  if (currentItemID === 0 && !isAdding) {
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
        <AccordionItems
          playlistSongs={playlistSongs}
          isAdding={isAdding}
          onItemClick={onItemClickLocal}
          onItemAdd={onItemAdd}
          currentItemID={currentItemID}
          isCurrentItemOpen={isCurrentItemOpen}
          filteredSongs={filteredSongs ?? undefined}
          uploadedFiles={uploadedFiles ?? undefined}
          handleUploadedFiles={handleUploadedFiles}
        />
      </ul>
    </div>
  );
};

export default Accordion;
