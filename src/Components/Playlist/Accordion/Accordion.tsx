import React, { useEffect, useState } from 'react';
import { Playlist, Song, BodyType } from 'Types';
import { getSongs } from 'Services/SongSvc';
import { addSongToPlaylist } from 'Services/PlaylistSvc';
import Item from './Item/Item';
import SearchBar from '../../Common/SearchBar/SearchBar';
import LoadingSpinner from '../../Common/LoadingSpinner/LoadingSpinner';
import './Accordion.scss';

type AccordionProps = {
  playlist: Playlist | null;
  playlistSongs: Song[] | null;
  selectedSongID: number;
  setSelectedSongID: any;
  loadPlaylistSongs: any;
  isAdding: boolean;
  isLoading: boolean;
  isEditing: boolean;
  changeSong: any;
}

const Accordion = ({
  playlist,
  playlistSongs,
  selectedSongID,
  setSelectedSongID,
  loadPlaylistSongs,
  isAdding,
  isLoading,
  isEditing,
  changeSong,
}: AccordionProps) => {
  const [bodyType, setBodyType] = useState<BodyType>('info');

  // State for searching
  const [query, setQuery] = useState<string>(''); // The input provided by user
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  // State for upload option
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);

  /* ******************* FUNCTIONS ******************** */

  // Sets filteredSongs based on current query and playlist
  const filterSongs = () => {
    if (!allSongs || !playlistSongs) {
      console.log("Can't filter based on search unless all songs are fetched");
      return false;
    }

    const tempSongs: Song[] = [];
    for (let i = 0; i < allSongs.length; i += 1) {
      let songAlreadyInPlaylist = false;
      const song = allSongs[i];

      // Loop through playlist to see if song already exists here
      for (let j = 0; j < playlistSongs.length; j += 1) {
        const playlistSong = playlistSongs[j];
        if (playlistSong.id === song.id) {
          songAlreadyInPlaylist = true;
        }
      }

      const songMatchesQuery = query === '' ? true : song.name.includes(query);
      if (!songAlreadyInPlaylist && songMatchesQuery) {
        tempSongs.push(song); // Add song to results
      }
    }

    setFilteredSongs(tempSongs);
    return true;
  };

  // When add button is clicked for a particular item
  const addSong = (id: number) => {
    if (!playlist) {
      console.log("Couldn't add song");
      return false;
    }
    addSongToPlaylist(id, playlist.id);
    loadPlaylistSongs();
    filterSongs();
    return true;
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

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const fetchAllSongs = async () => {
    const songs = await getSongs(null);
    if (songs) {
      setAllSongs(songs);
      return true;
    }
    return false;
  };

  /* ******************* EFFECTS ******************** */

  // When component is loaded
  useEffect(() => {
    fetchAllSongs();
  }, []);

  // Filter songs when user query changes
  useEffect(() => {
    if (isAdding) {
      filterSongs();
    }
  }, [query]);

  // Set current item to first song when songs change
  useEffect(() => {
    if (playlistSongs && playlistSongs.length > 0 && playlistSongs[0].id) {
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

  // Filter songs when allSongs is updated
  useEffect(() => {
    if (allSongs) {
      filterSongs();
    }
  }, [allSongs]);

  /* ******************* RETURN ******************** */

  if (isLoading) {
    return (
      <div className="accordionContainer">
        <LoadingSpinner />
      </div>
    );
  }

  if (selectedSongID === 0 && !isAdding) {
    return <div className="accordionContainer"> No songs in this playlist yet, use three dots in upper right to add some</div>;
  }

  const songs = isAdding ? filteredSongs : playlistSongs;

  return (
    <div className="accordionContainer listContainer">
      <ul className="accordion">
        {isAdding && (
        <li className="searchItem">
          <div className="bar">
            <SearchBar
              onChange={handleQueryChange}
              query={query}
            />
          </div>
        </li>
        )}
        {songs && songs.map((song: Song) => (
          <Item
            key={`accordion-item-${song.id}-${playlist?.id || '-1'}`}
            song={song}
            isSelected={selectedSongID === song.id}
            setBodyType={setBodyType}
            isAdding={isAdding}
            isEditing={isEditing}
            uploadedFiles={uploadedFiles ?? undefined}
            addSong={addSong}
            handleUploadedFiles={handleUploadedFiles}
            bodyType={bodyType}
            changeSong={changeSong}
            setSelectedSongID={setSelectedSongID}
            loadPlaylistSongs={loadPlaylistSongs}
          />
        ))}
      </ul>
    </div>
  );
};

export default Accordion;
