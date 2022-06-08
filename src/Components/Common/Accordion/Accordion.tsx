import React, { useEffect, useState } from 'react';
import { Playlist, Song } from 'Types';
import axios from 'axios';
import addSongToPlaylist from 'Services/SongSvc';
import AccordionItem from './AccordionItem/AccordionItem';
import './Accordion.scss';
import SearchBar from '../SearchBar/SearchBar';

type AccordionItemsProps = {
  playlistSongs: Song[];
  onItemClick: any;
  isAdding: boolean;
  currentItem: number;
  filteredSongs: Song[] | null;
  onItemAdd: any;
}

const AccordionItems = (props: AccordionItemsProps) => {
  let accordionItems = null;
  if (!props.isAdding) {
    let i = 0;
    accordionItems = (
      <>
        {props.playlistSongs && props.playlistSongs.map((song: Song) => {
          i += 1;
          return (
            <AccordionItem
              show={props.currentItem === song.id}
              key={`accordion-item-${song.id}-${i}`}
              item={song}
              onItemClick={props.onItemClick}
              isAdding={props.isAdding}
              onItemAdd={props.onItemAdd}
            />
          );
        })}
      </>
    );
  } else {
    accordionItems = (
      <>
        {props.filteredSongs && props.filteredSongs.map((song: Song) => {
          return (
            <AccordionItem
              show={props.currentItem === song.id}
              key={`accordion-item-add-${song.id}`}
              item={song}
              onItemClick={props.onItemClick}
              isAdding={props.isAdding}
              onItemAdd={props.onItemAdd}

            />
          );
        })}
      </>
    );
  }

  return accordionItems;
};

type AccordionProps = {
  playlist: Playlist;
  playlistSongs: Song[];
  onItemClick: any;
  newItemID: number;
  isAdding: boolean;
  refreshPlaylistSongs: any;
}

const Accordion = (props: AccordionProps) => {
  const firstItem = props.playlistSongs[0].id;
  const [currentItem, setCurrentItem] = useState<number>(firstItem);
  const [query, setQuery] = useState<string>('');
  const [allSongs, setAllSongs] = useState<Song[] | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<Song[] | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
      let doesSongMatchQuery = false;

      // check if song is already in playlist
      props.playlistSongs.forEach((playlistSong) => {
        if (song.id === playlistSong.id) {
          isSongInPlaylist = true;
        }
      });

      // check if song name contains query
      doesSongMatchQuery = song.name.includes(query);

      // if it passes, push it
      if (!isSongInPlaylist && doesSongMatchQuery) {
        tempFilteredSongs.push(song);
      }
    });

    setFilteredSongs(tempFilteredSongs);
    return true;
  };

  // when center of accordion header is clicked
  const onItemClick = (id: number) => {
    if (!id) {
      console.log('Failed to handle accordion click');
      return false;
    }
    setCurrentItem(id);
    props.onItemClick(id);
    return true;
  };

  // when add button is clicked for a particular item
  const onItemAdd = (id: number) => {
    addSongToPlaylist(id, props.playlist.id);
    props.refreshPlaylistSongs();
    filterSongs();
  };

  // set current item to first song when songs change
  useEffect(() => {
    setCurrentItem(props.playlistSongs[0].id);

    // re-filter if currently adding
    if (props.isAdding) {
      filterSongs();
    }
  }, [props.playlistSongs]);

  // set current item when an item is selected via parent
  useEffect(() => {
    setCurrentItem(props.newItemID);
  }, [props.newItemID]);

  useEffect(() => {
    if (props.isAdding) {
      filterSongs();
    }
  }, [query]);

  // grabs JSON info for all songs from API
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
      // at first all and filtered are the same thing, we are filtering nothing
      setAllSongs(res.data);
      filterSongs(res.data);
      return true;
    }
    return false;
  };

  // fetch songs when the user decides to add songs
  useEffect(() => {
    if (props.isAdding) {
      fetchAllSongs();
    }
  }, [props.isAdding]);

  return (
    <div className="accordionContainer listContainer">
      <ul className="accordion">
        {props.isAdding
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
          playlistSongs={props.playlistSongs}
          onItemClick={onItemClick}
          isAdding={props.isAdding}
          currentItem={currentItem}
          filteredSongs={filteredSongs}
          onItemAdd={onItemAdd}
        />
      </ul>
    </div>
  );
};

export default Accordion;
